import React, { createContext, useContext, useState, useEffect } from 'react';
import { Table, MenuItem, Order, OrderItem, Bill } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface CafeContextType {
  tables: Table[];
  menuItems: MenuItem[];
  orders: Order[];
  bills: Bill[];
  categories: string[];
  addTable: (table: Omit<Table, 'id'>) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addCategory: (category: string) => void;
  createOrder: (tableId: string, items: OrderItem[]) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  addItemsToOrder: (orderId: string, items: OrderItem[]) => void;
  generateBill: (orderId: string) => Bill;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const useCafeContext = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafeContext must be used within CafeProvider');
  }
  return context;
};

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<string[]>(['Beverages', 'Food', 'Snacks', 'Desserts']);

  // Initialize with sample data
  useEffect(() => {
    const sampleTables: Table[] = [
      { id: '1', name: 'Table 1', seats: 4, status: 'available' },
      { id: '2', name: 'Table 2', seats: 2, status: 'occupied' },
    ];
    
    const sampleMenuItems: MenuItem[] = [
      { id: '1', name: 'Coffee', price: 120, category: 'Beverages', available: true },
      { id: '2', name: 'Sandwich', price: 180, category: 'Food', available: true },
    ];
    
    setTables(sampleTables);
    setMenuItems(sampleMenuItems);
  }, []);

  const addTable = (table: Omit<Table, 'id'>) => {
    const newTable: Table = { ...table, id: Date.now().toString() };
    setTables(prev => [...prev, newTable]);
    toast({ title: 'Table added successfully' });
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setTables(prev => prev.map(table => 
      table.id === id ? { ...table, ...updates } : table
    ));
  };

  const deleteTable = (id: string) => {
    setTables(prev => prev.filter(table => table.id !== id));
    toast({ title: 'Table deleted' });
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: Date.now().toString() };
    setMenuItems(prev => [...prev, newItem]);
    toast({ title: 'Menu item added' });
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Menu item deleted' });
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      toast({ title: 'Category added successfully' });
    }
  };

  const createOrder = (tableId: string, items: OrderItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: Date.now().toString(),
      tableId,
      items,
      status: 'pending',
      createdAt: new Date(),
      total
    };
    setOrders(prev => [...prev, newOrder]);
    updateTable(tableId, { status: 'occupied' });
    toast({ title: 'Order created' });
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
  };

  const addItemsToOrder = (orderId: string, items: OrderItem[]) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = [...order.items];
        
        items.forEach(newItem => {
          const existingItemIndex = updatedItems.findIndex(item => item.id === newItem.id);
          if (existingItemIndex >= 0) {
            updatedItems[existingItemIndex].quantity += newItem.quantity;
          } else {
            updatedItems.push(newItem);
          }
        });
        
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return { ...order, items: updatedItems, total: newTotal };
      }
      return order;
    }));
    toast({ title: 'Items added to order' });
  };

  const generateBill = (orderId: string): Bill => {
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    const subtotal = order.total;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;
    
    const bill: Bill = {
      id: Date.now().toString(),
      orderId,
      tableId: order.tableId,
      items: order.items,
      subtotal,
      tax,
      total,
      createdAt: new Date()
    };
    
    setBills(prev => [...prev, bill]);
    updateOrder(orderId, { status: 'completed' });
    updateTable(order.tableId, { status: 'available' });
    toast({ title: 'Bill generated successfully' });
    
    return bill;
  };

  return (
    <CafeContext.Provider value={{
      tables,
      menuItems,
      orders,
      bills,
      categories,
      addTable,
      updateTable,
      deleteTable,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addCategory,
      createOrder,
      updateOrder,
      addItemsToOrder,
      generateBill
    }}>
      {children}
    </CafeContext.Provider>
  );
};