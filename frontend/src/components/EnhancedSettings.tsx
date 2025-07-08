import { useQuery } from '@tanstack/react-query'
import { getModels } from 'api/ollama'
import { Button } from 'components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from 'components/ui/dialog'
import { Label } from 'components/ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from 'components/ui/select'
import { Slider } from 'components/ui/slider'
import { useAtom } from 'jotai'
import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { modelAtom, systemPromptAtom, temperatureAtom } from 'state'
import { apiKeysAtom } from 'stores/apiKeys'
import { toolsEnabledAtom, enabledToolsAtom, toolSchemaAtom } from 'stores/tools'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'

export default function EnhancedSettings({ trigger }: { trigger: JSX.Element }) {
	const { isPending, isError, error, data } = useQuery({
		queryKey: ['ollama-models'],
		queryFn: getModels
	})
	const [model, setModel] = useAtom(modelAtom)
	const [systemPrompt, setSystemPrompt] = useAtom(systemPromptAtom)
	const [temperature, setTemperature] = useAtom(temperatureAtom)
	const [apiKeys, setApiKeys] = useAtom(apiKeysAtom)
	const [toolsEnabled, setToolsEnabled] = useAtom(toolsEnabledAtom)
	const [enabledTools, setEnabledTools] = useAtom(enabledToolsAtom)
	const [toolSchema] = useAtom(toolSchemaAtom)
	const [activeTab, setActiveTab] = useState('general')

	useEffect(() => {
		if (error) {
			console.error('Error fetching ollama models', error)
		}
	}, [error])

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Configure your models, API keys, and tools
					</DialogDescription>
				</DialogHeader>
				
				{/* Tab Navigation */}
				<div className="flex space-x-1 mb-6 border-b">
					{['general', 'api-keys', 'tools'].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
								activeTab === tab
									? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
									: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
							}`}
						>
							{tab === 'general' && 'General'}
							{tab === 'api-keys' && 'API Keys'}
							{tab === 'tools' && 'Tools'}
						</button>
					))}
				</div>

				{/* Tab Content */}
				{activeTab === 'general' && (
					<div className='grid gap-6 py-4'>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label className='text-right' htmlFor='model'>
								Model
							</Label>
							<Select
								value={model}
								onValueChange={val => {
									setModel(val)
								}}
							>
								<SelectTrigger className='col-span-3'>
									<SelectValue placeholder='Switch models' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>OpenAI</SelectLabel>
										<SelectItem value='gpt-4o'>GPT-4o</SelectItem>
										<SelectItem value='gpt-4o-mini'>GPT-4o Mini</SelectItem>
										<SelectItem value='gpt-4-turbo'>GPT-4 Turbo</SelectItem>
										<SelectItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</SelectItem>
										<SelectItem value='o1-preview'>o1 Preview</SelectItem>
										<SelectItem value='o1-mini'>o1 Mini</SelectItem>
									</SelectGroup>
									<SelectGroup>
										<SelectLabel>Anthropic</SelectLabel>
										<SelectItem value='claude-3-5-sonnet-20241022'>Claude 3.5 Sonnet</SelectItem>
										<SelectItem value='claude-3-5-haiku-20241022'>Claude 3.5 Haiku</SelectItem>
										<SelectItem value='claude-3-opus-20240229'>Claude 3 Opus</SelectItem>
									</SelectGroup>
									<SelectGroup>
										<SelectLabel>Google</SelectLabel>
										<SelectItem value='gemini-1.5-pro'>Gemini 1.5 Pro</SelectItem>
										<SelectItem value='gemini-1.5-flash'>Gemini 1.5 Flash</SelectItem>
									</SelectGroup>
									<SelectGroup>
										{isPending || (data && data.length > 0) ? (
											<SelectLabel>Ollama</SelectLabel>
										) : undefined}
										{!!isPending && (
											<SelectItem disabled value='loading'>
												Loading...
											</SelectItem>
										)}
										{!!isError && (
											<SelectItem disabled value='error'>
												Unable to load Ollama models, see console
											</SelectItem>
										)}
										{!!data &&
											data.map(m => (
												<SelectItem key={m.digest} value={`ollama/${m.name}`}>
													{m.name}
												</SelectItem>
											))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className='grid grid-cols-4 items-start gap-4'>
							<Label className='text-right pt-2' htmlFor='prompt'>
								System Prompt
							</Label>
							<Textarea
								className='col-span-3'
								id='prompt'
								rows={8}
								onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
									setSystemPrompt(event.target.value)
								}
								value={systemPrompt}
							/>
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label className='text-right' htmlFor='temperature'>
								Temperature ({temperature})
							</Label>
							<Slider
								min={0}
								max={1}
								step={0.05}
								onValueChange={val => setTemperature(val[0])}
								value={[temperature]}
								className='col-span-3'
								id='temperature'
							/>
						</div>
					</div>
				)}

				{activeTab === 'api-keys' && (
					<div className='grid gap-6 py-4'>
						<div className='text-sm text-gray-600 bg-blue-50 p-4 rounded-lg'>
							<p className='font-medium mb-2'>🔒 Privacy Notice</p>
							<p>All API keys are stored locally in your browser and never sent to our servers. They are only used to communicate directly with the respective AI providers.</p>
						</div>
						
						{[
							{ key: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...', description: 'Required for GPT models and DALL-E' },
							{ key: 'anthropic', label: 'Anthropic API Key', placeholder: 'sk-ant-...', description: 'Required for Claude models' },
							{ key: 'google', label: 'Google AI API Key', placeholder: 'AI...', description: 'Required for Gemini models' },
							{ key: 'groq', label: 'Groq API Key', placeholder: 'gsk_...', description: 'Fast inference for open models' },
							{ key: 'mistral', label: 'Mistral API Key', placeholder: 'mi-...', description: 'Required for Mistral models' }
						].map(({ key, label, placeholder, description }) => (
							<div key={key} className='grid grid-cols-4 items-center gap-4'>
								<div className='text-right'>
									<Label htmlFor={key} className='font-medium'>{label}</Label>
									<p className='text-xs text-gray-500 mt-1'>{description}</p>
								</div>
								<Input
									id={key}
									type='password'
									placeholder={placeholder}
									className='col-span-3'
									value={apiKeys[key as keyof typeof apiKeys]}
									onChange={(e) => {
										setApiKeys(prev => ({
											...prev,
											[key]: e.target.value
										}))
									}}
								/>
							</div>
						))}
					</div>
				)}

				{activeTab === 'tools' && (
					<div className='grid gap-6 py-4'>
						<div className='flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg'>
							<input
								type='checkbox'
								id='tools-enabled'
								checked={toolsEnabled}
								onChange={(e) => setToolsEnabled(e.target.checked)}
								className='w-4 h-4 rounded'
							/>
							<div>
								<Label htmlFor='tools-enabled' className='font-medium'>Enable Tool Calling</Label>
								<p className='text-sm text-gray-600 mt-1'>Allow AI to use tools for creating more interactive and dynamic components</p>
							</div>
						</div>
						
						{toolsEnabled && (
							<div className='space-y-6'>
								{toolSchema.map(group => (
									<div key={group.name} className='border rounded-lg p-6 bg-white shadow-sm'>
										<h4 className='font-semibold text-lg mb-4 text-gray-900'>{group.name}</h4>
										<div className='space-y-4'>
											{group.schema.map(tool => (
												<div key={tool.name} className='flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
													<input
														type='checkbox'
														id={tool.name}
														checked={enabledTools.includes(tool.name)}
														onChange={(e) => {
															if (e.target.checked) {
																setEnabledTools(prev => [...prev, tool.name])
															} else {
																setEnabledTools(prev => prev.filter(t => t !== tool.name))
															}
														}}
														className='w-4 h-4 rounded mt-0.5'
													/>
													<div className='flex-1'>
														<Label htmlFor={tool.name} className='font-medium text-gray-900 cursor-pointer'>
															{tool.name}
														</Label>
														<p className='text-sm text-gray-600 mt-1'>{tool.description}</p>
														<div className='mt-2 text-xs text-gray-500'>
															Parameters: {Object.keys(tool.parameters.properties).join(', ')}
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				<div className='mt-8 flex justify-between items-center pt-6 border-t'>
					<Button
						variant='outline'
						onClick={() => {
							fetch('/v1/session', { method: 'DELETE' })
								.then(() => document.location.reload())
								.catch(error_ => console.error(error_))
						}}
					>
						Logout
					</Button>
					<DialogClose asChild>
						<Button>
							Save Changes
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	)
}
