export interface Artisan {
  id: string;
  name: string;
  location: string;
  craft_category: string;
  languages: string[];
  business_type: string;
  verification_status: "pending" | "approved" | "rejected";
  phone?: string;
  email?: string;
  profile_image?: string;
  bio?: string;
  created_at: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  artisan_id: string;
  artisan_name?: string;
  title: string;
  description: string | null;
  category: string;
  materials: string | null;
  price: number;
  currency: string;
  quantity: number;
  tags: string | null;
  images: string | null;
  status: "draft" | "published" | "sold";
  created_at: string;
  crafting_process?: string | null;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email?: string;
  product_id: string;
  product_title: string;
  artisan_id: string;
  quantity: number;
  price: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  created_at: string;
  is_active: boolean;
}

export interface OrderItem {
  product_id: string;
  product_title: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "artisan" | "admin" | "customer";
  avatar?: string;
}

export interface DashboardStats {
  totalArtisans: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth?: number;
}

export interface AIInsight {
  title: string;
  description: string;
  type: "trending" | "tip" | "alert";
}
