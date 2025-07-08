import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { cn } from 'lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className={cn('flex min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <Sidebar />
      <main className="flex-1 ml-56 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
