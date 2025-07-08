import { useState } from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';

export default function MCP() {
  const [providers, setProviders] = useState([
    { name: 'OpenAI', status: 'active', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
    { name: 'Anthropic', status: 'active', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
    { name: 'Ollama', status: 'inactive', models: ['llama2', 'codellama', 'mistral'] },
  ]);
  const [newProvider, setNewProvider] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('OpenAI');
  const [primaryModel, setPrimaryModel] = useState('gpt-4o');
  const [fallbackModel, setFallbackModel] = useState('claude-3-sonnet');
  const [contextLength, setContextLength] = useState('128k');
  const [isConnecting, setIsConnecting] = useState(false);

  const toggleProvider = (providerName: string) => {
    setProviders(providers.map(p => 
      p.name === providerName 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
  };

  const addProvider = () => {
    if (newProvider.trim()) {
      setProviders([...providers, {
        name: newProvider.trim(),
        status: 'inactive',
        models: ['model-1', 'model-2']
      }]);
      setNewProvider('');
    }
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    // TODO: Integrate with backend
    setTimeout(() => {
      setIsConnecting(false);
      alert('Connection test successful! (This is a demo - backend integration needed)');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Model Context Protocol (MCP)</h1>
      
      {/* Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          MCP enables advanced model and tool orchestration, multi-provider support, and context-aware AI workflows. 
          Configure and monitor MCP features here.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Connection Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">MCP Status:</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Active Providers:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {providers.filter(p => p.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Tool Routing:</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  Automatic
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Current Configuration</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Primary Model:</span>
                <span className="text-gray-900 dark:text-white font-medium">{primaryModel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Fallback Model:</span>
                <span className="text-gray-900 dark:text-white font-medium">{fallbackModel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Context Length:</span>
                <span className="text-gray-900 dark:text-white font-medium">{contextLength} tokens</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400">Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Model
            </label>
            <Select value={primaryModel} onValueChange={setPrimaryModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fallback Model
            </label>
            <Select value={fallbackModel} onValueChange={setFallbackModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select fallback model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Context Length
            </label>
            <Select value={contextLength} onValueChange={setContextLength}>
              <SelectTrigger>
                <SelectValue placeholder="Select context length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="32k">32k tokens</SelectItem>
                <SelectItem value="64k">64k tokens</SelectItem>
                <SelectItem value="128k">128k tokens</SelectItem>
                <SelectItem value="200k">200k tokens</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleTestConnection} disabled={isConnecting} className="w-full">
              {isConnecting ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </div>
      </div>

      {/* Providers Management */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Providers</h2>
          <div className="flex gap-4">
            <Input
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              placeholder="Add new provider..."
              className="w-48"
            />
            <Button onClick={addProvider} disabled={!newProvider.trim()}>
              Add Provider
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map(provider => (
            <div key={provider.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">{provider.name}</h4>
                <button
                  onClick={() => toggleProvider(provider.name)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    provider.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {provider.status}
                </button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {provider.models.length} models available
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {provider.models.slice(0, 2).join(', ')}
                {provider.models.length > 2 && '...'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
