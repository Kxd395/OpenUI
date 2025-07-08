import { Link, useLocation } from 'react-router-dom';
import { cn } from 'lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useState } from 'react';
import { 
	HamburgerMenuIcon, 
	HomeIcon, 
	FileTextIcon, 
	ReaderIcon, 
	BookmarkIcon, 
	PersonIcon, 
	GearIcon, 
	LinkBreak2Icon, 
	LockClosedIcon 
} from '@radix-ui/react-icons';

const navItems = [
	{ path: '/ai', label: 'Builder', icon: HomeIcon },
	{ path: '/instructions', label: 'Instructions', icon: FileTextIcon },
	{ path: '/rules', label: 'Rules', icon: ReaderIcon },
	{ path: '/memory', label: 'Memory', icon: BookmarkIcon },
	{ path: '/user', label: 'User', icon: PersonIcon },
	{ path: '/settings', label: 'Settings', icon: GearIcon },
	{ path: '/mcp', label: 'MCP', icon: LinkBreak2Icon },
	{ path: '/env', label: 'Env & Secrets', icon: LockClosedIcon },
];

export default function Sidebar() {
	const location = useLocation();
	const [isExpanded, setIsExpanded] = useState(() => {
		const saved = localStorage.getItem('sidebar-expanded');
		return saved !== 'false';
	});

	const toggleExpanded = () => {
		const newExpanded = !isExpanded;
		setIsExpanded(newExpanded);
		localStorage.setItem('sidebar-expanded', newExpanded.toString());
		// Dispatch custom event to notify other components
		window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { expanded: newExpanded } }));
	};

	const sidebarWidth = isExpanded ? 'w-64' : 'w-16';
	
	return (
		<aside className={cn(
			"fixed top-0 left-0 h-full bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col z-40 transition-all duration-300 ease-in-out",
			sidebarWidth
		)}>
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50">
				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleExpanded}
						className="h-8 w-8 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
					>
						<HamburgerMenuIcon className="h-4 w-4" />
					</Button>
					{isExpanded && (
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white text-sm font-bold">UI</span>
							</div>
							<div>
								<h1 className="text-lg font-semibold text-gray-900 dark:text-white">OpenUI</h1>
								<p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">AI Platform</p>
							</div>
						</div>
					)}
				</div>
				{isExpanded ? (
					<ThemeToggle />
				) : (
					<Tooltip>
						<TooltipTrigger asChild>
							<div>
								<ThemeToggle />
							</div>
						</TooltipTrigger>
						<TooltipContent side="right">
							<p>Toggle theme</p>
						</TooltipContent>
					</Tooltip>
				)}
			</div>

			{/* Navigation */}
			<nav className="flex flex-col gap-1 p-3 flex-1">
				{navItems.map(item => {
					const IconComponent = item.icon;
					const isActive = location.pathname.startsWith(item.path);
					
					const linkContent = (
						<Link
							to={item.path}
							className={cn(
								'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group w-full',
								isActive
									? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
									: 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
							)}
						>
							<IconComponent className={cn(
								"h-4 w-4 transition-transform duration-200 group-hover:scale-110 flex-shrink-0",
								isActive ? 'scale-110' : ''
							)} />
							{isExpanded && <span className="font-medium">{item.label}</span>}
						</Link>
					);

					if (isExpanded) {
						return <div key={item.path}>{linkContent}</div>;
					}

					return (
						<Tooltip key={item.path}>
							<TooltipTrigger asChild>
								{linkContent}
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>{item.label}</p>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</nav>

			{/* Footer */}
			{isExpanded && (
				<div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30">
					<div className="text-xs text-gray-500 dark:text-gray-400 text-center">
						<div className="font-medium">&copy; {new Date().getFullYear()} OpenUI</div>
						<div className="text-xs opacity-70 mt-1">v1.1.0</div>
					</div>
				</div>
			)}
		</aside>
	);
}
