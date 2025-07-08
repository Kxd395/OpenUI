import { Outlet } from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import { useState, useEffect } from 'react';

export default function RootLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    return saved !== 'false' ? 256 : 64;
  });

  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setSidebarWidth(event.detail.expanded ? 256 : 64);
    };

    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
  }, []);

  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-gray-950'>
      <Sidebar />
      <main 
        className='flex-1 bg-white dark:bg-gray-900 min-h-screen transition-all duration-300 ease-in-out'
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
