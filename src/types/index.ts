export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status?: 'new' | 'sale' | 'popular' | 'sold-out';
  collection: 'grid' | 'minimalist' | 'angel';
  image_url: string;
  image_hover_url?: string;
  stock: number;
  sizes: string[]; // e.g. ['S', 'M', 'L', 'XL']
  size_stock: Record<string, number>; // e.g. { S: 5, M: 2, L: 0, XL: 1 }
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'admin' | 'customer';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    size: string;
    imageUrl: string;
  }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1-5
  text: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  slug: string;
  readTime: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  collection: string;
}
