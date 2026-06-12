'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { dbService } from '@/lib/supabase';
import { Order } from '@/types';
import { User, LogOut, Package, ShieldCheck, MapPin } from 'lucide-react';

export default function Profile() {
  const { user, loginUser, logoutUser, updateUserProfile, loadingAuth } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  
  // Shipping Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    state: 'NCR',
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Sync shipping address fields on load
  useEffect(() => {
    if (user) {
      setAddressForm({
        fullName: user.fullName,
        street: user.shippingAddress?.street || '',
        city: user.shippingAddress?.city || '',
        postalCode: user.shippingAddress?.postalCode || '',
        state: user.shippingAddress?.state || 'NCR',
      });

      // Load orders
      setLoadingOrders(true);
      dbService.getOrders(user.id).then((res) => {
        setOrders(res);
        setLoadingOrders(false);
      });
    }
  }, [user]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setLoadingLogin(true);
    await loginUser(emailInput);
    setLoadingLogin(false);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    await updateUserProfile({
      ...user,
      fullName: addressForm.fullName,
      shippingAddress: {
        street: addressForm.street,
        city: addressForm.city,
        state: addressForm.state,
        postalCode: addressForm.postalCode,
        country: 'Philippines',
      }
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  if (loadingAuth) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
          SECURE CONNECTION PROTOCOLS SYNCING...
        </div>
      </div>
    );
  }

  // 1. Not Logged In View
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 select-none flex justify-center items-center min-h-[70vh]">
        <div className="w-full max-w-md border border-zinc-900 p-8 sm:p-10 bg-zinc-950/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-4">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.25em] block mb-2">AUTHENTICATION</span>
            <h2 className="text-white text-xl uppercase tracking-wider font-extrabold">SECURE ACCESS ENTRY</h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">MAPUAN CREDENTIAL EMAIL</label>
              <input
                required
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-4 w-full uppercase outline-none focus:border-zinc-500"
              />
            </div>

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full bg-white text-black font-mono text-[10px] tracking-widest py-4 uppercase font-bold hover:bg-zinc-250 transition-colors cursor-pointer"
            >
              {loadingLogin ? 'AUTHENTICATING...' : 'TRANSMIT PASS CODE'}
            </button>
          </form>

          <p className="text-zinc-650 text-[9px] font-mono uppercase text-center mt-6 leading-relaxed">
            * PING: ADMIN PASSCODES INCLUDE EMAIL PREFIX &ldquo;ADMIN&rdquo;
            <br />
            (E.G. JERUSALEM@ENDLEZZ.MARKET)
          </p>
        </div>
      </div>
    );
  }

  // 2. Logged In Profile View
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 select-none">
      
      {/* Profile Header */}
      <div className="border-b border-zinc-900 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">USER PORTAL</span>
          <h1 className="text-3xl sm:text-5xl uppercase tracking-wider font-extrabold mt-1 text-white flex items-center gap-3">
            YOUR PROFILE
            {user.role === 'admin' && (
              <span className="text-[9px] font-mono text-red-500 border border-red-900 px-2 py-0.5 align-middle select-none">
                ADMIN PRIVILEGES
              </span>
            )}
          </h1>
        </div>

        <button
          onClick={() => logoutUser()}
          className="text-zinc-500 hover:text-white flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors cursor-pointer border border-zinc-900 px-4 py-2 hover:bg-zinc-900/40"
        >
          <LogOut className="w-4 h-4" /> DISCONNECT PROFILE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Shipping details and user stats */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* User Account block */}
          <div className="border border-zinc-900 p-6 bg-zinc-950/20 shadow-xl space-y-4">
            <h3 className="text-white text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2 border-b border-zinc-900 pb-3">
              <ShieldCheck className="w-4 h-4 text-zinc-400" /> ACCOUNT SPECIFICATIONS
            </h3>
            <div className="space-y-3 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <div className="flex justify-between">
                <span className="text-zinc-500">IDENTIFIER:</span>
                <span className="text-white font-bold">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">EMAIL CONTACT:</span>
                <span className="text-white font-bold">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ROLE VALUE:</span>
                <span className="text-white font-bold">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Edit address form */}
          <div className="border border-zinc-900 p-6 bg-zinc-950/20 shadow-xl">
            <h3 className="text-white text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
              <MapPin className="w-4 h-4 text-zinc-400" /> SHIPPING COORDINATES
            </h3>
            
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Recipient Name</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={addressForm.fullName}
                  onChange={handleFormChange}
                  className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3 uppercase outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Street Address</label>
                <input
                  required
                  type="text"
                  name="street"
                  value={addressForm.street}
                  onChange={handleFormChange}
                  className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3 uppercase outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">City</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleFormChange}
                    className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3 uppercase outline-none focus:border-zinc-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Postal Code</label>
                  <input
                    required
                    type="text"
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleFormChange}
                    className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3 uppercase outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-mono text-[9px] tracking-widest py-3 uppercase font-bold hover:bg-zinc-250 transition-colors cursor-pointer"
              >
                SAVE DETAILS
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Order logs */}
        <div className="lg:col-span-7">
          <div className="border border-zinc-900 p-6 sm:p-8 bg-zinc-950/20 shadow-xl min-h-[50vh]">
            <h3 className="text-white text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2 border-b border-zinc-900 pb-3 mb-6">
              <Package className="w-4.5 h-4.5 text-zinc-400" /> DISPATCH ORDER HISTORY
            </h3>

            {loadingOrders ? (
              <div className="text-center py-20 font-mono text-xs text-zinc-550 uppercase tracking-widest animate-pulse">
                QUERYING ORDER STATUS LOGS...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 border border-zinc-900 border-dashed">
                <Package className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                <h4 className="text-white font-display text-xs uppercase tracking-widest mb-1">No Orders Logged</h4>
                <p className="text-zinc-500 text-[9px] uppercase font-mono max-w-xs mx-auto">
                  You have not submitted any physical garment orders yet on this test session profile.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((ord) => (
                  <div key={ord.id} className="border border-zinc-900 bg-black/40 p-5 space-y-4 shadow-lg">
                    {/* Order header information */}
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest border-b border-zinc-900 pb-3">
                      <div>
                        <span className="text-zinc-500">ORDER ID: </span>
                        <span className="text-white font-black">{ord.id}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-500">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-0.5 font-bold ${
                          ord.status === 'delivered'
                            ? 'bg-zinc-850 text-white border border-zinc-700'
                            : ord.status === 'shipped'
                              ? 'bg-white text-black'
                              : 'bg-zinc-900 text-zinc-400'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Order items list */}
                    <div className="space-y-3">
                      {ord.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex gap-4 items-center">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-10 h-12 object-cover bg-zinc-950 border border-zinc-900"
                          />
                          <div className="flex-grow font-mono text-[9px] uppercase tracking-wider">
                            <h4 className="text-white font-bold">{item.productName}</h4>
                            <span className="text-zinc-500">SIZE: {item.size} | QTY: {item.quantity}</span>
                          </div>
                          <span className="font-mono text-xs text-white">
                            Php {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total cost */}
                    <div className="border-t border-zinc-900 pt-3 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                      <span className="text-zinc-550">SHIPPED TO: {ord.shippingAddress.fullName}</span>
                      <div>
                        <span className="text-zinc-500">TOTAL: </span>
                        <span className="text-white font-black">Php {ord.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
