import { useMediaQuery } from 'hooks'
import { Prism as PrismHighlighter } from 'react-syntax-highlighter'
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface SyntaxHighlighterProps {
	language?: string | undefined
	className?: string | undefined
	PreTag?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
	React.ComponentType<any> | keyof React.JSX.IntrinsicElements | undefined
	children: string[] | string
}

export default function SyntaxHighlighter(props: SyntaxHighlighterProps) {
	const darkMode = useMediaQuery('(prefers-color-scheme: dark)')
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <PrismHighlighter {...props} style={darkMode ? atomDark : prism} />
}

SyntaxHighlighter.defaultProps = {
	PreTag: undefined,
	className: undefined,
	language: 'jsx'
}
