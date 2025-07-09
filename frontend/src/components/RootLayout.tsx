import { Outlet } from 'react-router-dom';
import Sidebar from 'components/Sidebar';

export default function RootLayout() {
  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-gray-950'>
      <Sidebar />
      <main className='flex-1 ml-64 bg-white dark:bg-gray-900 min-h-screen'>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
