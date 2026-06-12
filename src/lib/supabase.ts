import { createClient } from '@supabase/supabase-js';
import { Product, Order, Review, UserProfile } from '@/types';
import { PRODUCTS as initialProducts, REVIEWS as initialReviews } from '@/data/cms';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase if keys are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Local Storage Keys
const KEYS = {
  PRODUCTS: 'endlezz_db_products',
  ORDERS: 'endlezz_db_orders',
  REVIEWS: 'endlezz_db_reviews',
  WAITLIST: 'endlezz_db_waitlist',
  NEWSLETTER: 'endlezz_db_newsletter',
  PROFILE: 'endlezz_db_profile',
  ACTIVE_USER: 'endlezz_active_user',
};

// Helper: Get data from LocalStorage or initialize with defaults
function getLocalData<T>(key: string, initialData: T): T {
  if (typeof window === 'undefined') return initialData;
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return initialData;
  }
}

// Helper: Set data in LocalStorage
function setLocalData<T>(key: string, data: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// ==========================================
// DB SERVICE METHODS (Supabase + Local Fallback)
// ==========================================

export const dbService = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) return data as Product[];
    }
    return getLocalData<Product[]>(KEYS.PRODUCTS, initialProducts);
  },

  async updateProductStock(id: string, size_stock: Record<string, number>): Promise<boolean> {
    const totalStock = Object.values(size_stock).reduce((a, b) => a + b, 0);
    if (supabase) {
      const { error } = await supabase
        .from('products')
        .update({ size_stock, stock: totalStock })
        .eq('id', id);
      if (!error) return true;
    }
    const products = getLocalData<Product[]>(KEYS.PRODUCTS, initialProducts);
    const updated = products.map(p => 
      p.id === id ? { ...p, size_stock, stock: totalStock } : p
    );
    setLocalData(KEYS.PRODUCTS, updated);
    return true;
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    if (supabase) {
      const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
      if (!error && data) return data as Product;
    }
    const products = getLocalData<Product[]>(KEYS.PRODUCTS, initialProducts);
    products.push(newProduct as Product);
    setLocalData(KEYS.PRODUCTS, products);
    return newProduct as Product;
  },

  // REVIEWS
  async getReviews(productId: string): Promise<Review[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId);
      if (!error && data) return data as Review[];
    }
    const reviews = getLocalData<Review[]>(KEYS.REVIEWS, initialReviews);
    return reviews.filter(r => r.productId === productId);
  },

  async addReview(productId: string, userName: string, rating: number, text: string): Promise<Review> {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName,
      rating,
      text,
      createdAt: new Date().toISOString(),
    };
    if (supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ 
          product_id: productId, 
          user_name: userName, 
          rating, 
          text 
        }])
        .select()
        .single();
      if (!error && data) return data as unknown as Review;
    }
    const reviews = getLocalData<Review[]>(KEYS.REVIEWS, initialReviews);
    reviews.unshift(newReview);
    setLocalData(KEYS.REVIEWS, reviews);
    return newReview;
  },

  // ORDERS
  async getOrders(userId: string): Promise<Order[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);
      if (!error && data) return data as unknown as Order[];
    }
    const orders = getLocalData<Order[]>(KEYS.ORDERS, []);
    return orders.filter(o => o.userId === userId);
  },

  async getAllOrders(): Promise<Order[]> {
    if (supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as unknown as Order[];
    }
    return getLocalData<Order[]>(KEYS.ORDERS, []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (supabase) {
      const { data, error } = await supabase.from('orders').insert([newOrder]).select().single();
      if (!error && data) return data as unknown as Order;
    }
    
    // Deduct stock locally
    const products = getLocalData<Product[]>(KEYS.PRODUCTS, initialProducts);
    const updatedProducts = products.map(p => {
      const orderItemsForProduct = newOrder.items.filter(item => item.productId === p.id);
      if (orderItemsForProduct.length === 0) return p;

      const newSizeStock = { ...p.size_stock };
      orderItemsForProduct.forEach(item => {
        if (newSizeStock[item.size] !== undefined) {
          newSizeStock[item.size] = Math.max(0, newSizeStock[item.size] - item.quantity);
        }
      });
      const newStock = Object.values(newSizeStock).reduce((a, b) => a + b, 0);
      return { ...p, size_stock: newSizeStock, stock: newStock };
    });
    setLocalData(KEYS.PRODUCTS, updatedProducts);

    const orders = getLocalData<Order[]>(KEYS.ORDERS, []);
    orders.push(newOrder);
    setLocalData(KEYS.ORDERS, orders);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: 'pending' | 'shipped' | 'delivered'): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      if (!error) return true;
    }
    const orders = getLocalData<Order[]>(KEYS.ORDERS, []);
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setLocalData(KEYS.ORDERS, updated);
    return true;
  },

  // NEWSLETTER & WAITLISTS
  async subscribeNewsletter(email: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase.from('newsletter').insert([{ email }]);
      if (!error) return true;
    }
    const emails = getLocalData<string[]>(KEYS.NEWSLETTER, []);
    if (!emails.includes(email)) {
      emails.push(email);
      setLocalData(KEYS.NEWSLETTER, emails);
    }
    return true;
  },

  async joinWaitlist(email: string, productId: string, size: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, product_id: productId, size }]);
      if (!error) return true;
    }
    const waitlist = getLocalData<{ email: string; productId: string; size: string; date: string }[]>(KEYS.WAITLIST, []);
    waitlist.push({ email, productId, size, date: new Date().toISOString() });
    setLocalData(KEYS.WAITLIST, waitlist);
    return true;
  },

  // AUTHENTICATION & PROFILES MOCK
  async getActiveUser(): Promise<UserProfile | null> {
    return getLocalData<UserProfile | null>(KEYS.ACTIVE_USER, null);
  },

  async login(email: string): Promise<UserProfile> {
    // Standard mock user - if admin email, flag as admin
    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'jerusalem@endlezz.market';
    const profile: UserProfile = {
      id: isAdmin ? 'admin-user' : `user-${Date.now()}`,
      email,
      fullName: isAdmin ? 'Admin Chief' : email.split('@')[0],
      role: isAdmin ? 'admin' : 'customer',
      avatarUrl: undefined,
      shippingAddress: {
        street: '123 Streetwear Ave',
        city: 'Manila',
        state: 'NCR',
        postalCode: '1000',
        country: 'Philippines'
      }
    };
    setLocalData(KEYS.ACTIVE_USER, profile);
    return profile;
  },

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    setLocalData(KEYS.ACTIVE_USER, profile);
    return profile;
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KEYS.ACTIVE_USER);
    }
  }
};
