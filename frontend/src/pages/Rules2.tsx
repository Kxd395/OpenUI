import Layout from 'components/Layout';

export default function Rules() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Rules & Guidelines</h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2 className="text-2xl font-semibold mb-4 text-red-600 dark:text-red-400">Important Guidelines</h2>
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
      </div>
    </Layout>
  );
}
