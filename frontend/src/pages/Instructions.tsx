import { useState } from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';

export default function Instructions() {
  const [question, setQuestion] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Integrate with backend
    setTimeout(() => {
      setIsSubmitting(false);
      setQuestion('');
      alert('Question submitted! (This is a demo - backend integration needed)');
    }, 1000);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Integrate with backend
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback('');
      alert('Feedback submitted! (This is a demo - backend integration needed)');
    }, 1000);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Instructions</h1>
          <p className="text-gray-600 dark:text-gray-400">Get started with OpenUI and learn how to make the most of our platform.</p>
        </div>
        
        {/* Getting Started Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 lg:p-8 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📚</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Getting Started</h2>
          </div>
          
          <div className="grid gap-4">
            {[
              {
                number: "1",
                title: "Builder",
                description: "Navigate to the Builder page to describe your UI idea. The AI will generate interactive code and live previews.",
                color: "from-blue-500 to-indigo-600"
              },
              {
                number: "2", 
                title: "Tools",
                description: "Use the built-in tool execution system for JavaScript code, data generation, and visualization.",
                color: "from-purple-500 to-pink-600"
              },
              {
                number: "3",
                title: "Settings", 
                description: "Configure AI models, manage API keys, and enable/disable RAG database connections.",
                color: "from-green-500 to-emerald-600"
              },
              {
                number: "4",
                title: "Memory",
                description: "View and manage your session memory to track conversations and preferences.",
                color: "from-orange-500 to-red-600"
              },
              {
                number: "5",
                title: "Rules",
                description: "Review usage guidelines and best practices for optimal results.",
                color: "from-cyan-500 to-blue-600"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30">
                <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                  {item.number}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Question Form */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 lg:p-8 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">❓</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ask a Question</h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Need help with a specific feature? Ask your question and get personalized assistance.
          </p>
          
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Question
              </label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="How do I integrate custom RAG databases with OpenUI?"
                className="w-full bg-white/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-600/50 rounded-xl"
                rows={4}
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || !question.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl px-6 py-2 shadow-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </Button>
          </form>
        </div>

        {/* Feedback Form */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 lg:p-8 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💬</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Feedback</h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Help us improve OpenUI by sharing your experience and suggestions.
          </p>
          
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Feedback
              </label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="I love the new dark mode feature, but I'd like to see more customization options..."
                className="w-full bg-white/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-600/50 rounded-xl"
                rows={4}
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || !feedback.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl px-6 py-2 shadow-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
