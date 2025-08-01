import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { CafeProvider } from '@/contexts/CafeContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import TableManagement from './TableManagement';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import BillManagement from './BillManagement';

const AppLayout: React.FC = () => {
  const { toggleSidebar } = useAppContext();
  const [activeTab, setActiveTab] = useState(localStorage.getItem('active') || 'dashboard');

  const renderContent = () => {
   
    switch (activeTab) {
    
      case 'dashboard':

        return <Dashboard />;
      case 'tables':

        return <TableManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'bills':
        return <BillManagement />;
      default:
        return <Dashboard />;
    }

  };

  return (
    <CafeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </header>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </CafeProvider>
  );
};

export default AppLayout;