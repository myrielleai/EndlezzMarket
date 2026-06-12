'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, UserProfile } from '@/types';
import { dbService } from '@/lib/supabase';

interface StoreContextType {
  // Auth
  user: UserProfile | null;
  loadingAuth: boolean;
  loginUser: (email: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // UI
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Custom toast notification system
  notification: string | null;
  showNotification: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Notifications State
  const [notification, setNotification] = useState<string | null>(null);

  // Helper to show temporary notification toasts
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // On Mount: Load user & cart from LocalStorage
  useEffect(() => {
    async function initStore() {
      // 1. Get active user
      const activeUser = await dbService.getActiveUser();
      setUser(activeUser);
      setLoadingAuth(false);

      // 2. Get active cart
      const savedCart = localStorage.getItem('endlezz_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart storage', e);
        }
      }
    }
    initStore();
  }, []);

  // Save Cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('endlezz_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth Functions
  const loginUser = async (email: string) => {
    setLoadingAuth(true);
    try {
      const profile = await dbService.login(email);
      setUser(profile);
      showNotification(`Logged in as ${profile.fullName}`);
    } catch (e) {
      console.error(e);
      showNotification('Login failed.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const logoutUser = async () => {
    setLoadingAuth(true);
    try {
      await dbService.logout();
      setUser(null);
      showNotification('Logged out successfully.');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAuth(false);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    try {
      const updated = await dbService.updateProfile(profile);
      setUser(updated);
      showNotification('Profile updated successfully.');
    } catch (e) {
      console.error(e);
      showNotification('Failed to update profile.');
    }
  };

  // Cart Functions
  const addToCart = (product: Product, size: string, quantity: number) => {
    setCart((prevCart) => {
      // Check if size stock is available
      const stockAvailable = product.size_stock[size] || 0;
      if (stockAvailable <= 0) {
        showNotification(`${product.name} (${size}) is currently out of stock.`);
        return prevCart;
      }

      // Check if product with size already exists in cart
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIdx > -1) {
        const newQty = prevCart[existingIdx].quantity + quantity;
        if (newQty > stockAvailable) {
          showNotification(`Cannot add more. Limit of ${stockAvailable} reached for size ${size}.`);
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
        };
        showNotification(`Added another ${product.name} (${size}) to Bag.`);
        return updated;
      } else {
        if (quantity > stockAvailable) {
          showNotification(`Cannot add. Limit of ${stockAvailable} reached for size ${size}.`);
          return prevCart;
        }
        showNotification(`Added ${product.name} (${size}) to Bag.`);
        return [...prevCart, { product, selectedSize: size, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    ));
    showNotification('Removed item from bag.');
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prevCart) => {
      const updated = prevCart.map((item) => {
        if (item.product.id === productId && item.selectedSize === size) {
          // Check stock limit
          const stockAvailable = item.product.size_stock[size] || 0;
          if (quantity > stockAvailable) {
            showNotification(`Only ${stockAvailable} items available in size ${size}.`);
            return { ...item, quantity: stockAvailable };
          }
          return { ...item, quantity };
        }
        return item;
      });
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Derive cart statistics
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        user,
        loadingAuth,
        loginUser,
        logoutUser,
        updateUserProfile,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSearchOpen,
        setIsSearchOpen,
        notification,
        showNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
