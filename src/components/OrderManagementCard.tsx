import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle, Utensils, Receipt } from 'lucide-react';
import { Order, Table } from '@/types';

interface OrderCardProps {
  order: Order;
  table: Table | undefined;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onGenerateBill: (orderId: string) => void;
}

const OrderManagementCard: React.FC<OrderCardProps> = ({ order, table, onUpdateOrder, onGenerateBill }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <Utensils className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{table?.name || 'Unknown Table'}</CardTitle>
          <Badge className={`${getStatusColor(order.status)} text-white flex items-center gap-1`}>
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(order.createdAt).toLocaleString()}
          </div>
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {order.status !== 'completed' && (
              <Select value={order.status} onValueChange={(value: any) => onUpdateOrder(order.id, { status: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            )}
            {order.status === 'completed' && (
              <Button onClick={() => onGenerateBill(order.id)} className="bg-green-600 hover:bg-green-700 flex-1">
                <Receipt className="w-4 h-4 mr-2" />
                Generate Bill
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManagementCard;