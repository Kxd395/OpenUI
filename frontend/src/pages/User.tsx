import { Button } from 'components/ui/button';

export default function User() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">User Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
            U
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">Username</div>
            <div className="text-lg text-gray-600 dark:text-gray-400">user@email.com</div>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Member since January 2024</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Account Actions</h3>
            <div className="space-y-3">
              <Button variant="default" className="w-full">Sign In</Button>
              <Button variant="secondary" className="w-full">Sign Out</Button>
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Usage Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">UIs Created:</span>
                <span className="font-semibold text-gray-900 dark:text-white">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tools Used:</span>
                <span className="font-semibold text-gray-900 dark:text-white">48</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sessions:</span>
                <span className="font-semibold text-gray-900 dark:text-white">7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
