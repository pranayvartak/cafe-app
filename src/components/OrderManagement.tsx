import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCafeContext } from '@/contexts/CafeContext';
import { OrderItem } from '@/types';
import { Plus, ShoppingCart } from 'lucide-react';
import OrderManagementCard from './OrderManagementCard';

const OrderManagement: React.FC = () => {
  const { tables, orders, menuItems, createOrder, updateOrder, generateBill, addItemsToOrder } = useCafeContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddItemsDialogOpen, setIsAddItemsDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const availableTables = tables.filter(t => t.status === 'available');
  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(order => order.status === statusFilter);

  const addItemToOrder = (menuItemId: string) => {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) return;

    const existingItem = orderItems.find(item => item.menuItemId === menuItemId);
    if (existingItem) {
      setOrderItems(prev => prev.map(item => 
        item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        menuItemId,
        quantity: 1,
        price: menuItem.price,
        name: menuItem.name
      };
      setOrderItems(prev => [...prev, newItem]);
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.id !== itemId));
      return;
    }
    setOrderItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const handleCreateOrder = () => {
    if (!selectedTable || orderItems.length === 0) return;
    createOrder(selectedTable, orderItems);
    setSelectedTable('');
    setOrderItems([]);
    setIsCreateDialogOpen(false);
  };

  const handleAddItemsToOrder = () => {
    if (!selectedOrderId || orderItems.length === 0) return;
    addItemsToOrder(selectedOrderId, orderItems);
    setSelectedOrderId('');
    setOrderItems([]);
    setIsAddItemsDialogOpen(false);
  };

  const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const activeOrders = orders.filter(order => order.status !== 'completed');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
        <div className="flex gap-2">
          <Dialog open={isAddItemsDialogOpen} onOpenChange={setIsAddItemsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add Items
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Items to Existing Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Order</label>
                  <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an order" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeOrders.map(order => {
                        const table = tables.find(t => t.id === order.tableId);
                        return (
                          <SelectItem key={order.id} value={order.id}>
                            {table?.name} - {order.status} (₹{order.total})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Add Items</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {menuItems.filter(item => item.available).map(item => (
                      <Button key={item.id} variant="outline" onClick={() => addItemToOrder(item.id)} className="text-left justify-start">
                        {item.name} - ₹{item.price}
                      </Button>
                    ))}
                  </div>
                </div>

                {orderItems.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Items to Add</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {orderItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span>{item.name}</span>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</Button>
                            <span>{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</Button>
                            <span className="ml-2">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-right font-semibold">Additional Total: ₹{orderTotal.toFixed(2)}</div>
                  </div>
                )}

                <Button onClick={handleAddItemsToOrder} disabled={!selectedOrderId || orderItems.length === 0} className="w-full">
                  Add Items to Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Table</label>
                  <Select value={selectedTable} onValueChange={setSelectedTable}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a table" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map(table => (
                        <SelectItem key={table.id} value={table.id}>
                          {table.name} ({table.seats} seats)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Add Items</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {menuItems.filter(item => item.available).map(item => (
                      <Button key={item.id} variant="outline" onClick={() => addItemToOrder(item.id)} className="text-left justify-start">
                        {item.name} - ₹{item.price}
                      </Button>
                    ))}
                  </div>
                </div>

                {orderItems.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Items</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {orderItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span>{item.name}</span>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</Button>
                            <span>{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</Button>
                            <span className="ml-2">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-right font-semibold">Total: ₹{orderTotal.toFixed(2)}</div>
                  </div>
                )}

                <Button onClick={handleCreateOrder} disabled={!selectedTable || orderItems.length === 0} className="w-full">
                  Create Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'preparing', 'ready', 'completed'].map((status) => (
          <Button key={status} variant={statusFilter === status ? 'default' : 'outline'} onClick={() => setStatusFilter(status)} size="sm">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => {
          const table = tables.find(t => t.id === order.tableId);
          return (
            <OrderManagementCard
              key={order.id}
              order={order}
              table={table}
              onUpdateOrder={updateOrder}
              onGenerateBill={generateBill}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrderManagement;