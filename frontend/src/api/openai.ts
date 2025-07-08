import { OpenAI } from 'openai'
import { useAtom } from 'jotai'
import { toolSchemaAtom, enabledToolsAtom } from '../stores/tools'
import { toolExecutor, ToolCall } from '../lib/toolExecutor'

function host() {
	const { hostname, protocol } = window.location
	const port = window.location.port ? `:${window.location.port}` : ''
	return `${protocol}//${hostname}${port}`
}

const openai = new OpenAI({
	apiKey: 'sk-fake',
	baseURL: `${host()}/v1`,
	dangerouslyAllowBrowser: true
})

export type Action = 'create' | 'refine';
interface CreateOptions {
	model: string
	systemPrompt: string
	query: string
	temperature: number
	html?: string
	image?: string
	action: Action
}

export const systemPrompt = `You are an expert frontend developer specializing in creating beautiful, modern, and functional web interfaces using Tailwind CSS and vanilla JavaScript.

CORE PRINCIPLES:
- Create pixel-perfect, responsive designs that work on desktop, tablet, and mobile
- Use modern Tailwind CSS classes and design patterns
- Support both dark and light modes automatically with Tailwind's dark: variants
- Write clean, semantic HTML with proper accessibility attributes
- Use modern JavaScript (ES6+) for interactivity with native browser APIs
- Implement smooth animations and transitions where appropriate

DESIGN GUIDELINES:
- Follow modern design trends: clean layouts, proper spacing, subtle shadows
- Use a harmonious color palette with good contrast ratios
- Implement proper typography hierarchy with appropriate font sizes and weights
- Add hover states, focus states, and loading states for better UX
- Use icons from Heroicons or Lucide via CDN when needed
- Create components that feel premium and polished

TECHNICAL REQUIREMENTS:
- Keep responses concise and focused on the HTML/CSS/JS code
- Use placehold.co or similar services for placeholder images
- Ensure all interactive elements work without external dependencies
- Write efficient, performant JavaScript that handles edge cases
- Include proper error handling for user interactions

COMPONENT TYPES TO EXCEL AT:
- Forms with validation and beautiful styling
- Data tables with sorting, filtering, pagination
- Modals, tooltips, and overlays
- Navigation menus and sidebars
- Cards, dashboards, and layout components
- Interactive charts and data visualizations
- E-commerce product listings and checkout flows
- Social media interfaces and comment systems

Return only the HTML that would go in the <body> tag - no need for <head> or full document structure.
Always prioritize user experience, accessibility, and modern web standards.`

const GPT4_MAX_TOKENS = 8192  // Increased for better responses

export async function createOrRefine(
	options: CreateOptions,
	callback: (response: string) => void
) {
	let { model, systemPrompt: sp } = options
	const { temperature, query, html, image, action } = options
	// Add instructions for frontmatter unless we're iterating on existing html
	// Some models don't support this being in a separate system message so we append
	if (!html) {
		sp += `\n\nAlways start your response with frontmatter wrapped in ---.  Set name: with a 2 to 5 word description of the component. Set emoji: with an emoji for the component, i.e.:
---
name: Fancy Button
emoji: 🎉
---

<button class="bg-blue-500 text-white p-2 rounded-lg">Click me</button>\n\n`
	}
	const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
		{
			role: 'system',
			content: sp
		}
	]
	if (action === 'create') {
		// Call the vision models only for creating action
		if (image) {
			// Use the latest vision model
			if (model.startsWith('gpt')) {
				model = 'gpt-4o'
			}
			let imageUrl = image
			// OpenAI wants a data url, ollama just wants base64 bytes
			if (model.startsWith('ollama/')) {
				const parts = image.toString().split(',')
				imageUrl = parts.pop() ?? ''
			}
			const textImageRequirements = query ?
				`The following are some special requirements: \n ${query}`
				: '';
			messages.push({
				role: 'user',
				content: [
					{
						type: 'text',
						text: `This is a screenshot of a web component I want to replicate.  Please generate HTML for it.\n ${textImageRequirements}`
					},
					{
						type: 'image_url',
						image_url: {
							url: imageUrl
						}
					}
				]
			})
		} else { 
			messages.push({
				role: 'user',
				content: query
			})
		}
	} else {
		// Annotation comments should like <!--FIX (1): make the image larger-->
		const hasAnnotationComments = /<!--FIX (\(\d+\)): (.+)-->/g.test(html as string);
		let userPrompt = hasAnnotationComments ? 'Address the FIX comments.': query
		
		const instructions = `Given the following HTML:\n\n${html}\n\n${userPrompt}`
		console.log('Providing instructions:\n', instructions)
		messages.push({
			role: 'user',
			content: instructions
		})
	}

	const response = await openai.chat.completions.create({
		model, // can change to "gpt-4" if you fancy
		messages,
		temperature,
		stream: true,
		max_tokens: GPT4_MAX_TOKENS
	})
	let markdown = ''
	for await (const chunk of response) {
		const part = chunk.choices[0]?.delta?.content ?? ''
		markdown += part
		callback(part)
	}
	return markdown
}

const systemPromptConvert = `You're a frontend web developer that specializes in $FRAMEWORK.
Given html and javascript, generate a $FRAMEWORK component. Factor the code into smaller
components if necessary. Keep all code in one file. Use hooks and put tailwind class strings
that are repeated atleast 3 times into a shared constant. Leave comments when necessary.`

interface ConvertOptions {
	model: string
	temperature: number
	framework: string
	html: string
}

export async function convert(
	options: ConvertOptions,
	callback: (response: string) => void
) {
	const { framework, model, temperature, html } = options

	const systemPromptCompiled = systemPromptConvert.replaceAll(
		'$FRAMEWORK',
		framework
	)
	const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
		{
			role: 'system',
			content: systemPromptCompiled
		}
	]
	/*
  let inputTok = ''
  const encoder = encoding_for_model('gpt-3.5-turbo')
  inputTok += systemPromptCompiled + '\n'
  */
	const userPrompt = `Please turn this into a ${framework} component.`
	const instructions = `Given the following HTML:\n\n${html}\n\n${userPrompt}`
	// inputTok += instructions + '\n'
	messages.push({
		role: 'user',
		content: instructions
	})
	/*
  const tokens = encoder.encode(inputTok)
  encoder.free()
  console.log('Model: ', model)
  // TODO: use a bigger model if we're length limited
  console.log('Tokens: ', tokens.length)
  */
	const response = await openai.chat.completions.create({
		model,
		messages,
		temperature,
		stream: true
	})
	for await (const chunk of response) {
		callback(chunk.choices[0]?.delta?.content ?? '')
	}
}

interface ToolCallResult {
  toolCalls: ToolCall[]
  response: string
}

interface CreateWithToolsOptions extends CreateOptions {
  enableTools?: boolean
  onToolCall?: (toolCall: ToolCall) => void
}

export async function createOrRefineWithTools(
  options: CreateWithToolsOptions,
  callback: (response: string) => void,
  onToolCall?: (toolCall: ToolCall) => void
): Promise<ToolCallResult> {
  const { enableTools = false } = options
  const toolCalls: ToolCall[] = []
  
  // Convert our tool schema to OpenAI format
  const convertedTools = enableTools ? await getOpenAITools() : []
  
  let { model, systemPrompt: sp } = options
  const { temperature, query, html, image, action } = options
  
  // Enhanced system prompt for tool-enabled generation
  if (enableTools && convertedTools.length > 0) {
    sp += `\n\nYou have access to powerful tools that can help create better UI components:
- Use 'create_interactive_component' to generate complex interactive elements
- Use 'html_renderer' to preview and test HTML components
- Use 'generate_sample_data' to create realistic data for components
- Use 'javascript' to add custom logic and interactivity
- Use 'create_chart' to generate data visualizations

When creating components, consider using these tools to enhance functionality and provide better user experiences.`
  }
  
  if (!html) {
    sp += `\n\nAlways start your response with frontmatter wrapped in ---.  Set name: with a 2 to 5 word description of the component. Set emoji: with an emoji for the component, i.e.:
---
name: Fancy Button
emoji: 🎉
---

<button class="bg-blue-500 text-white p-2 rounded-lg">Click me</button>\n\n`
  }

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: sp
    }
  ]

  // Handle images and user messages same as original function
  if (action === 'create') {
    if (image) {
      if (model.startsWith('gpt')) {
        model = 'gpt-4o'
      }
      let imageUrl = image
      if (model.startsWith('ollama/')) {
        const parts = image.toString().split(',')
        imageUrl = parts.pop() ?? ''
      }
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: query
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      })
    } else {
      messages.push({
        role: 'user',
        content: query
      })
    }
  } else {
    // This is a 'refine' operation
    messages.push({
      role: 'user',
      content: `Here's the current HTML:\n\n${html}\n\n${query}`
    })
  }

  // Create completion with tools if enabled
  const completionOptions: any = {
    model,
    messages,
    temperature,
    stream: true,
    max_tokens: GPT4_MAX_TOKENS
  }

  if (enableTools && convertedTools.length > 0) {
    completionOptions.tools = convertedTools
    completionOptions.tool_choice = 'auto'
  }

  const response = await openai.chat.completions.create(completionOptions) as any
  let markdown = ''
  let currentToolCall: Partial<ToolCall> | null = null

  for await (const chunk of response) {
    const choice = chunk.choices[0]
    if (!choice) continue

    // Handle regular content
    if (choice.delta?.content) {
      const part = choice.delta.content
      markdown += part
      callback(part)
    }

    // Handle tool calls
    if (choice.delta?.tool_calls) {
      for (const toolCall of choice.delta.tool_calls) {
        if (toolCall.index !== undefined) {
          // New tool call
          if (currentToolCall) {
            // Finish previous tool call
            const completeToolCall: ToolCall = {
              id: currentToolCall.id || '',
              name: currentToolCall.name || '',
              arguments: currentToolCall.arguments || {},
              status: 'pending',
              timestamp: Date.now()
            }
            toolCalls.push(completeToolCall)
            if (onToolCall) {
              onToolCall(completeToolCall)
            }
          }

          // Start new tool call
          currentToolCall = {
            id: toolCall.id,
            name: toolCall.function?.name,
            arguments: {}
          }
        }

        // Accumulate arguments
        if (toolCall.function?.arguments && currentToolCall) {
          try {
            const partialArgs = JSON.parse(toolCall.function.arguments)
            currentToolCall.arguments = { ...currentToolCall.arguments, ...partialArgs }
          } catch {
            // Arguments might be partial, continue accumulating
          }
        }
      }
    }

    // Handle completion
    if (choice.finish_reason === 'tool_calls' && currentToolCall) {
      const completeToolCall: ToolCall = {
        id: currentToolCall.id || '',
        name: currentToolCall.name || '',
        arguments: currentToolCall.arguments || {},
        status: 'pending',
        timestamp: Date.now()
      }
      toolCalls.push(completeToolCall)
      if (onToolCall) {
        onToolCall(completeToolCall)
      }
    }
  }

  return { toolCalls, response: markdown }
}

async function getOpenAITools() {
  // In a real implementation, we would get these from the stores
  // For now, return the default tools in OpenAI format
  const tools = [
    {
      type: 'function',
      function: {
        name: 'create_interactive_component',
        description: 'Creates an interactive UI component with JavaScript functionality',
        parameters: {
          type: 'object',
          properties: {
            componentType: {
              type: 'string',
              description: 'Type of component (form, table, modal, chart, dashboard, etc.)'
            },
            features: {
              type: 'string',
              description: 'Comma-separated list of features to include (validation, search, sorting, pagination, animation, etc.)'
            },
            styling: {
              type: 'string',
              description: 'Design style preference (modern, minimal, colorful, professional, etc.)'
            }
          },
          required: ['componentType', 'features']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'html_renderer',
        description: 'Renders HTML content with optional CSS styling as a live preview',
        parameters: {
          type: 'object',
          properties: {
            html: {
              type: 'string',
              description: 'The HTML content to render'
            },
            css: {
              type: 'string',
              description: 'Optional CSS styles to apply'
            }
          },
          required: ['html']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'generate_sample_data',
        description: 'Generates realistic sample data for components like tables, lists, or cards',
        parameters: {
          type: 'object',
          properties: {
            dataType: {
              type: 'string',
              description: 'Type of data (users, products, posts, analytics, companies, events, etc.)'
            },
            count: {
              type: 'string',
              description: 'Number of items to generate'
            },
            fields: {
              type: 'string',
              description: 'Comma-separated list of specific fields to include (optional)'
            }
          },
          required: ['dataType', 'count']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'javascript',
        description: 'Executes JavaScript code in a safe environment and returns the result',
        parameters: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The JavaScript code to execute. Use return statement to return a value.'
            }
          },
          required: ['code']
        }
      }
    }
  ]
  
  return tools
}
