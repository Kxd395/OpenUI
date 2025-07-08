import { atomWithStorage } from 'jotai/utils'

export interface APIKeys {
  openai: string
  anthropic: string
  google: string
  groq: string
  mistral: string
}

export const apiKeysAtom = atomWithStorage<APIKeys>('apiKeys', {
  openai: '',
  anthropic: '',
  google: '',
  groq: '',
  mistral: ''
})

export const getAPIKey = (provider: string, keys: APIKeys): string => {
  switch (provider.toLowerCase()) {
    case 'openai':
      return keys.openai || ''
    case 'anthropic':
      return keys.anthropic || ''
    case 'google':
      return keys.google || ''
    case 'groq':
      return keys.groq || ''
    case 'mistral':
      return keys.mistral || ''
    default:
      return ''
  }
}

export const getProviderFromModel = (model: string): string => {
  if (model.startsWith('gpt-') || model.startsWith('o1-')) {
    return 'openai'
  }
  if (model.startsWith('claude-')) {
    return 'anthropic'
  }
  if (model.startsWith('gemini-')) {
    return 'google'
  }
  return 'openai' // default
}
