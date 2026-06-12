'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { dbService } from '@/lib/supabase';
import confetti from 'canvas-confetti';

const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    user,
    showNotification
  } = useStore();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    email: '',
  });

  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Constants
  const FREE_SHIPPING_THRESHOLD = 2000;
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset steps after slide-out completes
    setTimeout(() => setCheckoutStep('cart'), 300);
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    
    if (user) {
      setShippingForm({
        fullName: user.fullName,
        street: user.shippingAddress?.street || '',
        city: user.shippingAddress?.city || '',
        postalCode: user.shippingAddress?.postalCode || '',
        email: user.email,
      });
    }
    setCheckoutStep('shipping');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.fullName || !shippingForm.street || !shippingForm.city || !shippingForm.postalCode || !shippingForm.email) {
      showNotification('Please fill in all shipping fields.');
      return;
    }

    setSubmittingOrder(true);
    try {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        imageUrl: item.product.image_url,
      }));

      await dbService.createOrder({
        userId: user?.id || `guest-${Date.now()}`,
        items: orderItems,
        total: cartTotal,
        status: 'pending',
        shippingAddress: {
          fullName: shippingForm.fullName,
          street: shippingForm.street,
          city: shippingForm.city,
          postalCode: shippingForm.postalCode,
          country: 'Philippines',
        }
      });

      // Clear newsletter email capturing check, add email to newsletter if desired
      await dbService.subscribeNewsletter(shippingForm.email);

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#18181b', '#71717a']
      });

      setCheckoutStep('success');
      clearCart();
      showNotification('Order placed successfully! Thank you.');
    } catch (error) {
      console.error(error);
      showNotification('Failed to process checkout.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-zinc-950 border-l border-zinc-900 z-[110] shadow-2xl flex flex-col justify-between"
          >
            {/* 1. Header */}
            <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="font-display font-semibold tracking-widest text-sm text-white">YOUR BAG</span>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5">
                  {cart.length} UNIQUE ITEMS
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-zinc-500 hover:text-white p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Content Body */}
            <div className="flex-grow overflow-y-auto px-6 py-4">
              {checkoutStep === 'cart' && (
                <>
                  {/* Free Shipping Progress bar */}
                  {cart.length > 0 && (
                    <div className="mb-6 p-4 border border-zinc-900 bg-zinc-900/30 font-mono text-xs uppercase tracking-widest">
                      {remainingForFreeShipping > 0 ? (
                        <div className="mb-2">
                          ADD <span className="text-white font-bold">Php {remainingForFreeShipping.toFixed(2)}</span> MORE FOR FREE SHIPPING
                        </div>
                      ) : (
                        <div className="mb-2 text-white font-bold">
                          ★ YOU ARE ELIGIBLE FOR FREE SHIPPING!
                        </div>
                      )}
                      <div className="w-full bg-zinc-950 h-1 border border-zinc-900">
                        <div
                          className="bg-white h-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {cart.length === 0 ? (
                    <div className="h-[60%] flex flex-col items-center justify-center text-center">
                      <ShoppingBag className="w-12 h-12 text-zinc-800 mb-4 animate-pulse" />
                      <h3 className="font-display uppercase tracking-widest text-sm text-zinc-400">Bag is Empty</h3>
                      <p className="text-zinc-600 text-xs mt-2 max-w-xs font-sans">
                        True discipline is showing up, but first you need your gear. Explore our streetwear drops.
                      </p>
                      <button
                        onClick={handleClose}
                        className="mt-6 border border-zinc-800 px-6 py-3 text-[10px] font-mono tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                      >
                        CONTINUE EXPLORING
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item, idx) => (
                        <div
                          key={`${item.product.id}-${item.selectedSize}`}
                          className="flex gap-4 border-b border-zinc-900 pb-4"
                        >
                          <div className="w-20 h-24 relative bg-zinc-950 border border-zinc-900 shrink-0 overflow-hidden">
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="object-cover w-full h-full"
                            />
                          </div>

                          <div className="flex-grow flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                                  {item.product.name}
                                </h4>
                                <button
                                  onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                  className="text-zinc-650 hover:text-red-500 p-0.5 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block mt-1">
                                Size: {item.selectedSize}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity control */}
                              <div className="flex items-center border border-zinc-850 px-2 py-1 gap-3 bg-zinc-900/10">
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                                  className="text-zinc-500 hover:text-white transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-mono text-xs text-white">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                                  className="text-zinc-500 hover:text-white transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-xs font-mono text-zinc-300">
                                Php {(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'shipping' && (
                <form onSubmit={submitOrder} className="space-y-4 pt-2">
                  <h3 className="font-display text-white text-xs uppercase tracking-[0.2em] mb-4">
                    SHIPPING DETAILS
                  </h3>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Contact Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={shippingForm.email}
                      onChange={handleFormChange}
                      className="bg-zinc-900 border border-zinc-850 text-white text-xs tracking-wider p-3 uppercase outline-none focus:border-zinc-500"
                      placeholder="Enter E-mail"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Full Name</label>
                    <input
                      required
                      type="text"
                      name="fullName"
                      value={shippingForm.fullName}
                      onChange={handleFormChange}
                      className="bg-zinc-900 border border-zinc-850 text-white text-xs tracking-wider p-3 uppercase outline-none focus:border-zinc-500"
                      placeholder="Enter Full Name"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Delivery Address</label>
                    <input
                      required
                      type="text"
                      name="street"
                      value={shippingForm.street}
                      onChange={handleFormChange}
                      className="bg-zinc-900 border border-zinc-850 text-white text-xs tracking-wider p-3 uppercase outline-none focus:border-zinc-500"
                      placeholder="Street address / Subdivision"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">City</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={shippingForm.city}
                        onChange={handleFormChange}
                        className="bg-zinc-900 border border-zinc-850 text-white text-xs tracking-wider p-3 uppercase outline-none focus:border-zinc-500"
                        placeholder="City"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Postal Code</label>
                      <input
                        required
                        type="text"
                        name="postalCode"
                        value={shippingForm.postalCode}
                        onChange={handleFormChange}
                        className="bg-zinc-900 border border-zinc-850 text-white text-xs tracking-wider p-3 uppercase outline-none focus:border-zinc-500"
                        placeholder="Postal Code"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="w-full mt-6 bg-white text-black py-4 text-xs font-mono tracking-widest uppercase font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submittingOrder ? 'TRANSMITTING ORDER...' : 'CONFIRM ORDER PAYMENT'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full text-center text-zinc-500 hover:text-white text-[10px] font-mono tracking-widest uppercase mt-2"
                  >
                    BACK TO BAG
                  </button>
                </form>
              )}

              {checkoutStep === 'success' && (
                <div className="h-[80%] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white mb-6">
                    ✓
                  </div>
                  <h3 className="font-display uppercase tracking-[0.2em] text-white text-base">DISCIPLINE REWARDED</h3>
                  <p className="text-zinc-400 text-xs mt-3 max-w-sm font-sans px-4">
                    Your order request has been received. Your physical transformation gear is packing. Check your email inbox for tracking updates.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-8 bg-white text-black px-8 py-3 text-xs font-mono tracking-widest uppercase hover:bg-zinc-200 transition-all font-bold cursor-pointer"
                  >
                    RETURN TO STORE
                  </button>
                </div>
              )}
            </div>

            {/* 3. Subtotal footer */}
            {cart.length > 0 && checkoutStep === 'cart' && (
              <div className="px-6 py-6 border-t border-zinc-900 bg-zinc-950/90">
                <div className="flex items-center justify-between mb-4 font-mono text-xs uppercase tracking-widest">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-white font-bold">Php {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  <span>Shipping</span>
                  <span>{cartTotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : 'Calculated next'}</span>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-white text-black py-4 text-xs font-mono tracking-widest uppercase font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                >
                  PROCEED TO SECURE CHECKOUT <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
