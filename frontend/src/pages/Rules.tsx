import { useState } from 'react';
import { Button } from 'components/ui/button';
import { Textarea } from 'components/ui/textarea';
import { Input } from 'components/ui/input';

export default function Rules() {
  const [customRules, setCustomRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');
  const [reportIssue, setReportIssue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCustomRule = () => {
    if (newRule.trim()) {
      setCustomRules([...customRules, newRule.trim()]);
      setNewRule('');
    }
  };

  const removeCustomRule = (index: number) => {
    setCustomRules(customRules.filter((_, i) => i !== index));
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Integrate with backend
    setTimeout(() => {
      setIsSubmitting(false);
      setReportIssue('');
      alert('Issue reported! (This is a demo - backend integration needed)');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Rules & Guidelines</h1>
      
      {/* Core Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="text-2xl font-semibold mb-4 text-red-600 dark:text-red-400">Core Guidelines</h2>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-center font-bold mr-3 mt-0.5 text-sm">!</span>
              <div>
                <strong>Ethical Use:</strong> Use OpenUI for constructive and ethical purposes only. Avoid generating harmful or malicious content.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-center font-bold mr-3 mt-0.5 text-sm">!</span>
              <div>
                <strong>Privacy:</strong> Do not share sensitive personal data, API keys, or confidential information in prompts.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-center font-bold mr-3 mt-0.5 text-sm">!</span>
              <div>
                <strong>Copyright:</strong> Respect intellectual property rights and licensing of all generated and uploaded content.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-center font-bold mr-3 mt-0.5 text-sm">!</span>
              <div>
                <strong>Legal Compliance:</strong> Ensure all usage complies with applicable laws and platform terms of service.
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full text-center font-bold mr-3 mt-0.5 text-sm">✓</span>
              <div>
                <strong>Support:</strong> Report bugs or issues via the project's GitHub repository or support channels.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Custom Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Custom Rules</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Add your own rules and guidelines for your team or organization.
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Enter a custom rule..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addCustomRule()}
            />
            <Button onClick={addCustomRule} disabled={!newRule.trim()}>
              Add Rule
            </Button>
          </div>
          
          {customRules.length > 0 && (
            <div className="space-y-3">
              {customRules.map((rule, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="inline-block w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-center font-bold mr-3 mt-0.5 text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300">{rule}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomRule(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Issue */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-orange-600 dark:text-orange-400">Report an Issue</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Found a problem or have concerns about content? Report it here.
        </p>
        <form onSubmit={handleReportIssue} className="space-y-4">
          <div>
            <label htmlFor="reportIssue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe the Issue
            </label>
            <Textarea
              id="reportIssue"
              value={reportIssue}
              onChange={(e) => setReportIssue(e.target.value)}
              placeholder="Please describe the issue you encountered..."
              className="w-full"
              rows={4}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !reportIssue.trim()}>
            {isSubmitting ? 'Submitting...' : 'Report Issue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
