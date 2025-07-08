import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { useState } from 'react';

export default function Memory() {
  const [memory, setMemory] = useState<string[]>([
    'Remembered: Last UI built was a pricing table.',
    'Remembered: Preferred model is OpenAI GPT-4.',
    'Remembered: User prefers modern, minimal design styles.',
    'Remembered: Frequently uses tool execution for data visualization.',
  ]);
  const [newMemory, setNewMemory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [memoryNote, setMemoryNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const addMemory = () => {
    if (newMemory.trim()) {
      setMemory([...memory, `Remembered: ${newMemory.trim()}`]);
      setNewMemory('');
    }
  };

  const removeMemory = (index: number) => {
    setMemory(memory.filter((_, i) => i !== index));
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingNote(true);
    // TODO: Integrate with backend
    setTimeout(() => {
      setIsAddingNote(false);
      setMemoryNote('');
      alert('Memory note added! (This is a demo - backend integration needed)');
    }, 1000);
  };

  const filteredMemory = memory.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Session Memory</h1>
      
      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Search Memory</h2>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your memory..."
          className="w-full"
        />
      </div>

      {/* Memory Items */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conversation Context</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your session memory helps maintain context across conversations and improves personalization.
          </p>
        </div>
        
        <div className="space-y-4">
          {filteredMemory.map((item, i) => (
            <div key={i} className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 dark:text-gray-300">{item}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMemory(memory.indexOf(item))}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </Button>
            </div>
          ))}
          
          {filteredMemory.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No memory items found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Add Memory */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">Add Memory</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Manually add important information to remember for future conversations.
        </p>
        <div className="flex gap-4">
          <Input
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            placeholder="Enter something to remember..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addMemory()}
          />
          <Button onClick={addMemory} disabled={!newMemory.trim()}>
            Add Memory
          </Button>
        </div>
      </div>

      {/* Memory Notes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Add Memory Note</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Add detailed notes about preferences, project context, or important decisions.
        </p>
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label htmlFor="memoryNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Memory Note
            </label>
            <Textarea
              id="memoryNote"
              value={memoryNote}
              onChange={(e) => setMemoryNote(e.target.value)}
              placeholder="User prefers React over Vue, likes TypeScript, works on e-commerce projects..."
              className="w-full"
              rows={3}
              required
            />
          </div>
          <Button type="submit" disabled={isAddingNote || !memoryNote.trim()}>
            {isAddingNote ? 'Adding...' : 'Add Note'}
          </Button>
        </form>
      </div>

      {/* Clear All */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Clear Memory</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clear all memory to start fresh. This action cannot be undone.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Are you sure you want to clear all memory? This cannot be undone.')) {
                setMemory([]);
              }
            }}
            className="ml-4"
          >
            Clear All Memory
          </Button>
        </div>
      </div>
    </div>
  );
}
