import { useAtom } from 'jotai';
import { toolsEnabledAtom, toolSchemaAtom, enabledToolsAtom } from 'stores/tools';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { useState } from 'react';

const ragDatabases = [
  { name: 'Pinecone', key: 'pinecone', description: 'Vector database for semantic search' },
  { name: 'Weaviate', key: 'weaviate', description: 'Open-source vector database' },
  { name: 'Qdrant', key: 'qdrant', description: 'High-performance vector database' },
  { name: 'Chroma', key: 'chroma', description: 'Embedding database for LLM apps' },
];

const commonApiKeys = [
  { name: 'OpenAI API Key', key: 'openai_api_key', description: 'For GPT models' },
  { name: 'Anthropic API Key', key: 'anthropic_api_key', description: 'For Claude models' },
  { name: 'Pinecone API Key', key: 'pinecone_api_key', description: 'For vector database' },
  { name: 'Ollama Endpoint', key: 'ollama_endpoint', description: 'Local AI models' },
];

export default function Settings() {
  const [toolsEnabled, setToolsEnabled] = useAtom(toolsEnabledAtom);
  const [enabledTools, setEnabledTools] = useAtom(enabledToolsAtom);
  const [ragEnabled, setRagEnabled] = useState<{[k:string]: boolean}>({});
  const [apiKeys, setApiKeys] = useState<{[k:string]: string}>({});
  const [customApiKey, setCustomApiKey] = useState('');
  const [customApiKeyName, setCustomApiKeyName] = useState('');
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  const addApiKey = (name: string, key: string) => {
    setApiKeys(prev => ({ ...prev, [key]: '' }));
  };

  const addCustomApiKey = () => {
    if (customApiKeyName.trim() && customApiKey.trim()) {
      setApiKeys(prev => ({ ...prev, [customApiKey]: '' }));
      setCustomApiKeyName('');
      setCustomApiKey('');
    }
  };

  const removeApiKey = (key: string) => {
    setApiKeys(prev => {
      const newKeys = { ...prev };
      delete newKeys[key];
      return newKeys;
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // TODO: Integrate with backend
    setTimeout(() => {
      setIsLoading(false);
      alert('Settings saved! (This is a demo - backend integration needed)');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>
      
      <div className="space-y-8">
        {/* General Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* API Keys Management */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">API Keys</h2>
          
          {/* Common API Keys */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Common API Keys</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonApiKeys.map(api => (
                <div key={api.key} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{api.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{api.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addApiKey(api.name, api.key)}
                      disabled={api.key in apiKeys}
                    >
                      {api.key in apiKeys ? 'Added' : 'Add'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom API Key */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Add Custom API Key</h3>
            <div className="flex gap-4">
              <Input
                value={customApiKeyName}
                onChange={(e) => setCustomApiKeyName(e.target.value)}
                placeholder="API Key Name"
                className="flex-1"
              />
              <Input
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="API Key Identifier"
                className="flex-1"
              />
              <Button 
                onClick={addCustomApiKey}
                disabled={!customApiKeyName.trim() || !customApiKey.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Configured API Keys */}
          {Object.keys(apiKeys).length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Configured API Keys</h3>
              <div className="space-y-3">
                {Object.entries(apiKeys).map(([key, value]) => (
                  <div key={key} className="flex gap-4 items-center">
                    <Input value={key} readOnly className="flex-1" />
                    <Input 
                      value={value} 
                      type="password"
                      onChange={(e) => setApiKeys(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder="Enter API key..."
                      className="flex-1"
                    />
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeApiKey(key)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Tool Configuration */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Tool Configuration</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <span className="text-lg font-medium text-gray-900 dark:text-white">Enable Tool Execution</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allow AI to execute JavaScript, generate data, and create visualizations</p>
              </div>
              <input 
                type="checkbox" 
                checked={toolsEnabled} 
                onChange={e => setToolsEnabled(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
            </label>
          </div>
        </section>

        {/* RAG Database Configuration */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">RAG Database Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ragDatabases.map(db => (
              <label key={db.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">{db.name}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{db.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={!!ragEnabled[db.key]}
                  onChange={e => setRagEnabled(r => ({ ...r, [db.key]: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
              </label>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="px-8 py-2"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
