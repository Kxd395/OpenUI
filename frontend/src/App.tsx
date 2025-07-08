import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route,
	RouterProvider
} from 'react-router-dom'
import ErrorBoundary from 'components/ErrorBoundary'
import LoadingOrError from 'components/LoadingOrError'
import { TooltipProvider } from 'components/ui/tooltip'
import { useMediaQuery } from 'hooks'
import type { ReactElement } from 'react'
import { lazy, Suspense, useEffect } from 'react'
import RootLayout from 'components/RootLayout'

const AI = lazy(async () => import('pages/AI'))
const Builder = lazy(async () => import('pages/AI/Builder'))
const Instructions = lazy(async () => import('pages/Instructions'))
const Rules = lazy(async () => import('pages/Rules'))
const User = lazy(async () => import('pages/User'))
const Memory = lazy(async () => import('pages/Memory'))
const Settings = lazy(async () => import('pages/Settings'))
const MCP = lazy(async () => import('pages/MCP'))
const EnvSecrets = lazy(async () => import('pages/EnvSecrets'))

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<RootLayout />}>
			<Route index element={<Navigate replace to='/ai' />} />
			<Route path='ai' element={<AI />}>
				<Route path=':id' element={<Builder />} />
			</Route>
			<Route path='ai/shared/:id' element={<Builder shared />} />
			<Route path='instructions' element={<Instructions />} />
			<Route path='rules' element={<Rules />} />
			<Route path='user' element={<User />} />
			<Route path='memory' element={<Memory />} />
			<Route path='settings' element={<Settings />} />
			<Route path='mcp' element={<MCP />} />
			<Route path='env' element={<EnvSecrets />} />
		</Route>
	)
)

export default function App(): ReactElement {
	const darkMode = useMediaQuery('(prefers-color-scheme: dark)')

	useEffect(() => {
		// Initialize theme from localStorage or system preference
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else if (savedTheme === 'light') {
			document.documentElement.classList.remove('dark');
		} else if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [darkMode])

	return (
		<Suspense fallback={<LoadingOrError />}>
			<ErrorBoundary renderError={error => <LoadingOrError error={error} />}>
				<TooltipProvider>
					<RouterProvider router={router} />
				</TooltipProvider>
			</ErrorBoundary>
		</Suspense>
	)
}
