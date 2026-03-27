export interface OrderProduct {
  watchId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  products: OrderProduct[];
  totalPrice: number;
  address: string;
  city: string;
  paymentMethod: 'Razorpay' | 'Stripe' | 'Cash on Delivery';
  orderStatus: 'Processing' | 'Packed' | 'Shipped' | 'Delivered';
  createdAt?: string;
  deliveredAt?: string;
}
