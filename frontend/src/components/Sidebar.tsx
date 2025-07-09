import { Link, useLocation } from 'react-router-dom';
import { cn } from 'lib/utils';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
	{ path: '/ai', label: 'Builder', icon: '🛠️' },
	{ path: '/instructions', label: 'Instructions', icon: '📖' },
	{ path: '/rules', label: 'Rules', icon: '📜' },
	{ path: '/memory', label: 'Memory', icon: '🧠' },
	{ path: '/user', label: 'User', icon: '👤' },
	{ path: '/settings', label: 'Settings', icon: '⚙️' },
	{ path: '/mcp', label: 'MCP', icon: '🔗' },
	{ path: '/env', label: 'Env & Secrets', icon: '🔑' },
];

export default function Sidebar() {
	const location = useLocation();
	return (
		<aside className="fixed top-0 left-0 h-full w-64 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col z-40">
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
						<span className="text-white text-sm font-bold">UI</span>
					</div>
					<div>
						<h1 className="text-lg font-semibold text-gray-900 dark:text-white">OpenUI</h1>
						<p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">AI Platform</p>
					</div>
				</div>
				<ThemeToggle />
			</div>

			{/* Navigation */}
			<nav className="flex flex-col gap-1 p-3 flex-1">
				{navItems.map(item => (
					<Link
						key={item.path}
						to={item.path}
						className={cn(
							'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
							location.pathname.startsWith(item.path)
								? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
								: 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
						)}
					>
						<span className={cn(
							"text-base transition-transform duration-200 group-hover:scale-110",
							location.pathname.startsWith(item.path) ? 'scale-110' : ''
						)}>
							{item.icon}
						</span>
						<span className="font-medium">{item.label}</span>
					</Link>
				))}
			</nav>

			{/* Footer */}
			<div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30">
				<div className="text-xs text-gray-500 dark:text-gray-400 text-center">
					<div className="font-medium">&copy; {new Date().getFullYear()} OpenUI</div>
					<div className="text-xs opacity-70 mt-1">v1.1.0</div>
				</div>
			</div>
		</aside>
	);
}
