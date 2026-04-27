export interface ProductVariant {
  label: string;
  price: number;
  stock: number;
  imageIndex?: number;
  image?: { url?: string; secureUrl?: string; publicId?: string };
}

export interface Product {
  id: string | number;
  name: string;
  description?: string;
  subtitle?: string;
  price: string | number;
  category?: string;
  subcategory?: string | null;
  marketed_by?: string | null;
  manufactured_by?: string | null;
  stock?: number;
  variants?: ProductVariant[];
  images?: Array<{ url?: string; secureUrl?: string }>;
  featured_image?: { url?: string; secureUrl?: string } | null;
  is_organic?: boolean;
  is_available?: boolean;
  is_featured?: boolean;
  tags?: string[] | string;
  key_features?: string[];
  rating?: string | number;
  review_count?: number;
  discount?: string | number;
  unit?: string;
  views?: number;
  createdAt?: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
}

export interface CartItem {
  productId: string | number;
  product: Product;
  quantity: number;
  variantIndex?: number;
}

export interface OrderAddress {
  address: string;
  city: string;
  zipCode: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
