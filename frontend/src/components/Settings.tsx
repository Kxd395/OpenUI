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

export default function Settings({ trigger }: { trigger: JSX.Element }) {
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
			<DialogContent className='max-w-xl'>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Make changes to your settings or logout
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
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
							<SelectTrigger className='min-w-[200px]'>
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
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label className='text-right' htmlFor='prompt'>
							System Prompt
						</Label>
						<Textarea
							className='col-span-3'
							id='prompt'
							onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
								setSystemPrompt(event.target.value)
							}
							value={systemPrompt}
						/>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label className='text-right' htmlFor='temperature'>
							Temperature
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
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label className='text-right' htmlFor='api-keys'>
							API Keys
						</Label>
						<div className='col-span-3'>
							{Object.entries(apiKeys).map(([provider, key]) => (
								<div key={provider} className='flex items-center gap-2'>
									<Input
										value={key}
										onChange={e => {
											setApiKeys({...apiKeys, [provider]: e.target.value})
										}}
										placeholder={`${provider} API key`}
										className='flex-1'
									/>
									<Button
										variant='destructive'
										onClick={() => {
											setApiKeys({...apiKeys, [provider]: ''})
										}}
									>
										Clear
									</Button>
								</div>
							))}
						</div>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label className='text-right' htmlFor='tools'>
							Tools
						</Label>
						<div className='col-span-3'>
							{toolSchema.map(tool => (
								<div key={tool.name} className='flex items-center gap-2'>
									<Input
										value={enabledTools.includes(tool.name) ? 'Enabled' : 'Disabled'}
										readOnly
										className='w-[100px]'
									/>
									<Button
										variant={enabledTools.includes(tool.name) ? 'destructive' : 'outline'}
										onClick={() => {
											if (enabledTools.includes(tool.name)) {
												setEnabledTools(enabledTools.filter(t => t !== tool.name))
											} else {
												setEnabledTools([...enabledTools, tool.name])
											}
										}}
									>
										{enabledTools.includes(tool.name) ? 'Disable' : 'Enable'}
									</Button>
								</div>
							))}
						</div>
					</div>
					<div className='mt-3 grid grid-cols-4 items-center gap-4'>
						<div className='col-start-4 flex justify-end'>
							<Button
								variant='secondary'
								onClick={() => {
									fetch('/v1/session', { method: 'DELETE' })
										.then(() => document.location.reload())
										.catch(error_ => console.error(error_))
								}}
							>
								Logout
							</Button>
							<DialogClose asChild>
								<Button type='button' className='ml-2'>
									Update
								</Button>
							</DialogClose>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
