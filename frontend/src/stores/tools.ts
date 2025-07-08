import { atomWithStorage } from 'jotai/utils'

export interface ToolDefinition {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, {
      type: string
      description: string
    }>
    required: string[]
  }
}

export interface ToolSchema {
  name: string
  schema: ToolDefinition[]
}

// Default tools for UI generation and interaction
const defaultTools: ToolSchema[] = [
  {
    name: 'UI Components',
    schema: [
      {
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
      },
      {
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
    ]
  },
  {
    name: 'Data & Analytics',
    schema: [
      {
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
      },
      {
        name: 'create_chart',
        description: 'Creates interactive charts and data visualizations',
        parameters: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'Chart type (bar, line, pie, scatter, area, etc.)'
            },
            data: {
              type: 'string',
              description: 'Chart data as JSON string or data source'
            },
            options: {
              type: 'string',
              description: 'Chart configuration options as JSON string (optional)'
            }
          },
          required: ['type', 'data']
        }
      }
    ]
  },
  {
    name: 'Development Tools',
    schema: [
      {
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
    ]
  }
]

export const toolsEnabledAtom = atomWithStorage('toolsEnabled', false)
export const toolSchemaAtom = atomWithStorage('toolSchema', defaultTools)
export const enabledToolsAtom = atomWithStorage('enabledTools', [] as string[])
