import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Coffee, 
  ShoppingCart, 
  Receipt, 
  Settings,
  Moon,
  Sun,
  X,
  Pencil
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const { theme, setTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Cafe Manager");

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tables', label: 'Tables', icon: Users },
    { id: 'menu', label: 'Menu', icon: Coffee },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'bills', label: 'Bills', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
             <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Coffee className="w-6 h-6 text-amber-600" />

        {editing ? (
          <input
            className="bg-transparent border-b border-gray-300 focus:outline-none dark:text-white"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditing(false);
            }}
          />
        ) : (
          <span>{name}</span>
        )}

        {!editing && (
          <Pencil
            className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setEditing(true)}
          />
        )}
      </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      activeTab === item.id 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="w-full justify-start text-gray-700 dark:text-gray-300"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 mr-3" />
              ) : (
                <Sun className="w-4 h-4 mr-3" />
              )}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;