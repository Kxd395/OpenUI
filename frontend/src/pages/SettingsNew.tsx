import Layout from 'components/Layout';
import { useAtom } from 'jotai';
import { toolsEnabledAtom, toolSchemaAtom, enabledToolsAtom } from 'stores/tools';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { useState } from 'react';

const ragDatabases = [
  { name: 'Pinecone', key: 'pinecone', description: 'Vector database for semantic search' },
  { name: 'Weaviate', key: 'weaviate', description: 'Open-source vector database' },
  { name: 'Qdrant', key: 'qdrant', description: 'High-performance vector database' },
  { name: 'Chroma', key: 'chroma', description: 'Embedding database for LLM apps' },
];

export default function Settings() {
  const [toolsEnabled, setToolsEnabled] = useAtom(toolsEnabledAtom);
  const [enabledTools, setEnabledTools] = useAtom(enabledToolsAtom);
  const [ragEnabled, setRagEnabled] = useState<{[k:string]: boolean}>({});
  const [secrets, setSecrets] = useState<{[k:string]: string}>({});
  const [envs, setEnvs] = useState<{[k:string]: string}>({});

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>
        <div className="space-y-8">
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

          {/* Secrets Management */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">API Keys & Secrets</h2>
            <div className="space-y-4">
              {Object.entries(secrets).map(([k, v]) => (
                <div key={k} className="flex gap-4 items-center">
                  <Input value={k} readOnly className="flex-1" />
                  <Input 
                    value={v} 
                    type="password"
                    onChange={e => setSecrets(s => ({ ...s, [k]: e.target.value }))}
                    className="flex-1"
                  />
                  <Button 
                    variant="destructive" 
                    onClick={() => setSecrets(s => { const ns = { ...s }; delete ns[k]; return ns; })}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => setSecrets(s => ({ ...s, [prompt('Secret name') || '']: '' }))}
              >
                Add Secret
              </Button>
            </div>
          </section>

          {/* Environment Variables */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Environment Variables</h2>
            <div className="space-y-4">
              {Object.entries(envs).map(([k, v]) => (
                <div key={k} className="flex gap-4 items-center">
                  <Input value={k} readOnly className="flex-1" />
                  <Input 
                    value={v} 
                    onChange={e => setEnvs(s => ({ ...s, [k]: e.target.value }))}
                    className="flex-1"
                  />
                  <Button 
                    variant="destructive" 
                    onClick={() => setEnvs(s => { const ns = { ...s }; delete ns[k]; return ns; })}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => setEnvs(s => ({ ...s, [prompt('Environment variable name') || '']: '' }))}
              >
                Add Environment Variable
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
