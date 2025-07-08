import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { useState } from 'react';

export default function Instructions() {
  const [userQuery, setUserQuery] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = () => {
    setSubmitted(true);
    // Here you would send feedback to backend
    console.log('Feedback submitted:', feedback);
  };

  const handleTryExample = () => {
    setUserQuery('Create a modern pricing table with three tiers');
    // Here you would navigate to builder with this query
    console.log('Example query set:', userQuery);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Instructions</h1>
      
      {/* Getting Started Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-400">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="inline-block w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-center font-bold mr-3 mt-0.5">1</span>
              <div>
                <strong>Builder:</strong> Navigate to the Builder page to describe your UI idea. The AI will generate interactive code and live previews.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-center font-bold mr-3 mt-0.5">2</span>
              <div>
                <strong>Tools:</strong> Use the built-in tool execution system for JavaScript code, data generation, and visualization.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-center font-bold mr-3 mt-0.5">3</span>
              <div>
                <strong>Settings:</strong> Configure AI models, manage API keys, and enable/disable RAG database connections.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-center font-bold mr-3 mt-0.5">4</span>
              <div>
                <strong>Memory:</strong> View and manage your session memory to track conversations and preferences.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-center font-bold mr-3 mt-0.5">5</span>
              <div>
                <strong>Rules:</strong> Review usage guidelines and best practices for optimal results.
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Interactive Example Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Try an Example</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Enter a UI description below or try our example:
        </p>
        <div className="space-y-4">
          <Textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Describe the UI you want to create..."
            className="min-h-[100px]"
          />
          <div className="flex gap-3">
            <Button onClick={handleTryExample} variant="outline">
              Try Example: Pricing Table
            </Button>
            <Button disabled={!userQuery.trim()}>
              Generate UI
            </Button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Help Us Improve</h2>
        {!submitted ? (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Have suggestions or found something confusing? Let us know!
            </p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your feedback helps us improve the documentation..."
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleSubmitFeedback} 
              disabled={!feedback.trim()}
              className="w-full sm:w-auto"
            >
              Submit Feedback
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-green-600 dark:text-green-400 text-lg font-semibold mb-2">
              ✅ Thank you for your feedback!
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              We appreciate your input and will use it to improve OpenUI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
