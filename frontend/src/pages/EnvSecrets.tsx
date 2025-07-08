import { useState } from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';

export default function EnvSecrets() {
  const [envVars, setEnvVars] = useState<{[k:string]: string}>({
    NODE_ENV: 'development',
    PORT: '3000',
  });
  const [secrets, setSecrets] = useState<{[k:string]: string}>({});
  const [newEnvName, setNewEnvName] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');
  const [newSecretName, setNewSecretName] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');
  const [bulkEnvs, setBulkEnvs] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addEnvVar = () => {
    if (newEnvName.trim() && newEnvValue.trim()) {
      setEnvVars(prev => ({ ...prev, [newEnvName.trim()]: newEnvValue.trim() }));
      setNewEnvName('');
      setNewEnvValue('');
    }
  };

  const addSecret = () => {
    if (newSecretName.trim() && newSecretValue.trim()) {
      setSecrets(prev => ({ ...prev, [newSecretName.trim()]: newSecretValue.trim() }));
      setNewSecretName('');
      setNewSecretValue('');
    }
  };

  const removeEnvVar = (key: string) => {
    setEnvVars(prev => {
      const newVars = { ...prev };
      delete newVars[key];
      return newVars;
    });
  };

  const removeSecret = (key: string) => {
    setSecrets(prev => {
      const newSecrets = { ...prev };
      delete newSecrets[key];
      return newSecrets;
    });
  };

  const parseBulkEnvs = () => {
    const lines = bulkEnvs.split('\n').filter(line => line.trim());
    const newVars: {[k:string]: string} = {};
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        newVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    setEnvVars(prev => ({ ...prev, ...newVars }));
    setBulkEnvs('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    // TODO: Integrate with backend
    setTimeout(() => {
      setIsLoading(false);
      alert('Environment variables and secrets saved! (This is a demo - backend integration needed)');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Environment & Secrets</h1>
      
      {/* Environment Variables */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-green-600 dark:text-green-400">Environment Variables</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Configure environment variables for your application runtime.
        </p>
        
        {/* Add Single Environment Variable */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Add Environment Variable</h3>
          <div className="flex gap-4">
            <Input
              value={newEnvName}
              onChange={(e) => setNewEnvName(e.target.value)}
              placeholder="Variable name (e.g., API_URL)"
              className="flex-1"
            />
            <Input
              value={newEnvValue}
              onChange={(e) => setNewEnvValue(e.target.value)}
              placeholder="Variable value"
              className="flex-1"
            />
            <Button onClick={addEnvVar} disabled={!newEnvName.trim() || !newEnvValue.trim()}>
              Add
            </Button>
          </div>
        </div>

        {/* Bulk Add Environment Variables */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Bulk Add Environment Variables</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Paste environment variables in KEY=VALUE format, one per line:
          </p>
          <div className="flex gap-4">
            <Textarea
              value={bulkEnvs}
              onChange={(e) => setBulkEnvs(e.target.value)}
              placeholder="NODE_ENV=production&#10;PORT=8080&#10;DATABASE_URL=postgresql://..."
              className="flex-1"
              rows={4}
            />
            <div className="flex flex-col gap-2">
              <Button onClick={parseBulkEnvs} disabled={!bulkEnvs.trim()}>
                Parse & Add
              </Button>
              <Button variant="outline" onClick={() => setBulkEnvs('')}>
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Current Environment Variables */}
        {Object.keys(envVars).length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Current Environment Variables</h3>
            <div className="space-y-3">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex gap-4 items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Input value={key} readOnly className="flex-1 font-mono text-sm" />
                  <Input 
                    value={value} 
                    onChange={(e) => setEnvVars(prev => ({ ...prev, [key]: e.target.value }))}
                    className="flex-1 font-mono text-sm"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeEnvVar(key)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Secrets */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-red-600 dark:text-red-400">Secrets</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Store sensitive information like API keys, tokens, and passwords securely.
        </p>
        
        {/* Add Secret */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Add Secret</h3>
          <div className="flex gap-4">
            <Input
              value={newSecretName}
              onChange={(e) => setNewSecretName(e.target.value)}
              placeholder="Secret name (e.g., DATABASE_PASSWORD)"
              className="flex-1"
            />
            <Input
              value={newSecretValue}
              onChange={(e) => setNewSecretValue(e.target.value)}
              placeholder="Secret value"
              type="password"
              className="flex-1"
            />
            <Button onClick={addSecret} disabled={!newSecretName.trim() || !newSecretValue.trim()}>
              Add
            </Button>
          </div>
        </div>

        {/* Current Secrets */}
        {Object.keys(secrets).length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Current Secrets</h3>
            <div className="space-y-3">
              {Object.entries(secrets).map(([key, value]) => (
                <div key={key} className="flex gap-4 items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Input value={key} readOnly className="flex-1 font-mono text-sm" />
                  <Input 
                    value={value} 
                    onChange={(e) => setSecrets(prev => ({ ...prev, [key]: e.target.value }))}
                    type="password"
                    className="flex-1 font-mono text-sm"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeSecret(key)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Security Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">🔒</span>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-amber-800 dark:text-amber-200">Security Notice</h3>
            <p className="text-amber-700 dark:text-amber-300 mt-1">
              Secrets are encrypted and stored securely. Environment variables are visible in plain text. 
              Never commit secrets to version control or share them in unsecured channels.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="px-8 py-2"
        >
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </div>
  );
}
