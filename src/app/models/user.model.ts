export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  role: 'user' | 'admin';
  wishlist: string[];
  createdAt?: string;
}
