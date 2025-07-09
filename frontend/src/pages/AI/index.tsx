import {
	ChevronLeft,
	ChevronRight,
	Settings as SettingsIcon,
	Github,
	FilePen,
	X,
} from 'lucide-react';
import ErrorBoundary from 'components/ErrorBoundary'
import Head from 'components/Head'
import HistoryItem from 'components/HistoryItem'
import LoadingOrError from 'components/LoadingOrError'
import Register from 'components/Register'
import Settings from 'components/Settings'
import { Button } from 'components/ui/button'
import { useMediaQuery } from 'hooks'
import { useAtom, useAtomValue, useStore } from 'jotai'
import { MOBILE_WIDTH, cn } from 'lib/utils'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { historyAtomFamily, historyIdsAtom } from 'state'

import { copilot } from '../../api/copilot';

export default function LayoutWithSidebar() {
	const bigEnough = useMediaQuery(`(min-width: ${MOBILE_WIDTH}px)`)
	const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(() => {
		const saved = localStorage.getItem('history-collapsed');
		return saved === 'true';
	});
	const [isHistoryHidden, setIsHistoryHidden] = useState(!bigEnough);
	const navigation = useNavigate()
	const [history] = useAtom(historyIdsAtom)
	const params = useParams()
	const curItem = useAtomValue(historyAtomFamily({ id: params.id ?? 'new' }))
	const store = useStore()
	const [refinedQuery, setRefinedQuery] = useState('');

	const handleCopilotAction = async (action: string, query: string) => {
		try {
			const response = await copilot(action, query);
			setRefinedQuery(response.query);
		} catch (error) {
			console.error('Error refining query:', error);
		}
	};

	useEffect(() => {
		if (params.id === undefined) {
			console.log('redirecting')
			navigation(`/ai/new`)
		}
	}, [params.id, navigation])

	useEffect(() => {
		setIsHistoryHidden(!bigEnough)
	}, [bigEnough])

	const toggleHistoryCollapsed = () => {
		const newCollapsed = !isHistoryCollapsed;
		setIsHistoryCollapsed(newCollapsed);
		localStorage.setItem('history-collapsed', newCollapsed.toString());
	};

	const toggleHistoryHidden = () => {
		setIsHistoryHidden(!isHistoryHidden);
	};

	const now = new Date()
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const today = new Date(now.getTime() - 24 * 60 * 60 * 1000)
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
	let lastLabel = ''

	const historyWidth = isHistoryCollapsed ? 'w-0' : 'w-[300px]';

	return (
		<div className='mobile-safe-container flex overflow-hidden bg-secondary relative'>
			<Head title={curItem.name ?? 'Create a new Elemint'} />
			<Register />
			
			{/* Main content area */}
			<div className={cn(
				'flex-1 transition-all duration-300 ease-in-out',
				!isHistoryCollapsed ? 'mr-[300px]' : 'mr-0'
			)}>
				<ErrorBoundary renderError={error => <LoadingOrError error={error} />}>
					<Outlet context={{ onCopilotAction: handleCopilotAction, refinedQuery, setRefinedQuery }} />
				</ErrorBoundary>
			</div>

			{/* History Sidebar */}
			<div
				className={cn(
					`${historyWidth} fixed top-0 right-0 h-screen flex-none flex-col border-l border-input bg-zinc-300 transition-all duration-300 ease-in-out dark:bg-zinc-900 z-40`,
					isHistoryHidden && !bigEnough && 'hidden'
				)}
			>
				<div className='flex items-center justify-between px-4 py-3 border-b border-input bg-white/50 dark:bg-gray-800/50'>
					{!isHistoryCollapsed && (
						<>
							<h2 className='text-sm font-medium text-secondary-foreground'>
								History
							</h2>
							<div className="flex items-center gap-1">
								<Button
									asChild
									size='icon'
									variant='ghost'
									className='h-8 w-8 hover:bg-inherit'
								>
									<a
										aria-label='GitHub'
										rel='noreferrer'
										target='_blank'
										href='https://github.com/wandb/openui'
									>
										<Github className='h-4 w-4' />
									</a>
								</Button>
								<Settings
									trigger={
										<Button
											className='h-8 w-8 hover:scale-110 hover:bg-inherit'
											variant='ghost'
											size='icon'
										>
											<SettingsIcon className='h-4 w-4' />
										</Button>
									}
								/>
								<Button
									onClick={() => {
										navigation('/ai/new')
										if (!bigEnough) {
											setIsHistoryHidden(true)
										}
									}}
									className='h-8 w-8 hover:scale-110 hover:bg-inherit'
									variant='ghost'
									size='icon'
								>
									<FilePen className='h-4 w-4' />
								</Button>
								{!bigEnough && (
									<Button
										onClick={toggleHistoryHidden}
										className='h-8 w-8 hover:scale-110 hover:bg-inherit'
										variant='ghost'
										size='icon'
									>
										<X className='h-4 w-4' />
									</Button>
								)}
							</div>
						</>
					)}
				</div>

				{!isHistoryCollapsed && (
					<div className='flex h-full max-h-full flex-col items-start justify-start overflow-y-auto overflow-x-hidden p-3'>
						{history.map(id => {
							let label: string | undefined
							const item = store.get(historyAtomFamily({ id }))
							if (
								item.createdAt &&
								item.createdAt >= today &&
								(lastLabel === '' || lastLabel === 'Today')
							) {
								label = lastLabel === 'Today' ? undefined : 'Today'
								lastLabel = 'Today'
							} else if (
								item.createdAt &&
								item.createdAt >= sevenDaysAgo &&
								lastLabel === 'Today'
							) {
								label = 'Previous 7 days'
								lastLabel = label
							} else if (
								lastLabel === 'Previous 7 days' &&
								item.createdAt &&
								item.createdAt <= sevenDaysAgo
							) {
								label = 'Previous 30 days'
								lastLabel = label
							} else {
								label = undefined
							}
							return (
								<HistoryItem
									key={id}
									id={id}
									label={label}
									active={params.id === id}
									collapsed={isHistoryCollapsed}
								/>
							)
						})}
					</div>
				)}

				{/* Toggle Button */}
				<Button
					onClick={toggleHistoryCollapsed}
					className={cn(
						'absolute -left-10 top-4 h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-input shadow-sm hover:scale-110 hover:bg-secondary z-50',
						isHistoryCollapsed && 'left-2'
					)}
					variant='ghost'
					size='icon'
				>
					{isHistoryCollapsed ? (
						<ChevronLeft className='h-4 w-4' />
					) : (
						<ChevronRight className='h-4 w-4' />
					)}
				</Button>
			</div>

			{/* Mobile overlay */}
			{!bigEnough && !isHistoryHidden && (
				<div
					className="fixed inset-0 bg-black/50 z-30"
					onClick={toggleHistoryHidden}
				/>
			)}

			{/* Mobile history toggle button */}
			{!bigEnough && (
				<Button
					onClick={toggleHistoryHidden}
					className='fixed top-4 right-4 h-10 w-10 rounded-full bg-white dark:bg-gray-800 border border-input shadow-lg hover:scale-110 hover:bg-secondary z-50'
					variant='ghost'
					size='icon'
				>
					<SettingsIcon className='h-5 w-5' />
				</Button>
			)}

			{/* Desktop history toggle button when collapsed */}
			{bigEnough && isHistoryCollapsed && (
				<Button
					onClick={toggleHistoryCollapsed}
					className='fixed top-4 right-4 h-10 w-10 rounded-full bg-white dark:bg-gray-800 border border-input shadow-lg hover:scale-110 hover:bg-secondary z-50'
					variant='ghost'
					size='icon'
				>
					<ChevronLeft className='h-5 w-5' />
				</Button>
			)}
		</div>
	)
}
