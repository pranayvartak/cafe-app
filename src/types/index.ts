export interface Table {
  id: string;
  name: string;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  position?: { x: number; y: number };
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: Date;
  total: number;
}

export interface Bill {
  id: string;
  orderId: string;
  tableId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
}