'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { dbService } from '@/lib/supabase';
import { Product, Order } from '@/types';
import { AlertOctagon, Package, DollarSign, Users, RefreshCw, Plus, Edit } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loadingAuth, showNotification } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Stock edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sizeStockForm, setSizeStockForm] = useState<Record<string, number>>({});

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    description: '',
    price: 420.90,
    status: 'new' as 'new' | 'sale' | 'popular' | 'sold-out',
    collection: 'grid' as 'grid' | 'minimalist' | 'angel',
    image_url: '/img/products/img-1.jpg',
    image_hover_url: '/img/products/img-2.jpg',
    stock: 20,
    sizes: 'S,M,L,XL',
    size_stock: { S: 5, M: 5, L: 5, XL: 5 }
  });

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const prods = await dbService.getProducts();
      const ords = await dbService.getAllOrders();
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch admin dashboard records.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const startEditingStock = (prod: Product) => {
    setEditingId(prod.id);
    setSizeStockForm(prod.size_stock);
  };

  const handleStockInputChange = (size: string, val: number) => {
    setSizeStockForm({ ...sizeStockForm, [size]: Math.max(0, val) });
  };

  const submitStockUpdate = async (productId: string) => {
    try {
      await dbService.updateProductStock(productId, sizeStockForm);
      showNotification('Product stock counts updated successfully.');
      setEditingId(null);
      loadDashboardData(); // reload
    } catch (err) {
      console.error(err);
      showNotification('Stock update failed.');
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sizesArray = newProductForm.sizes.split(',').map((s) => s.trim().toUpperCase());
      await dbService.addProduct({
        name: newProductForm.name,
        description: newProductForm.description,
        price: Number(newProductForm.price),
        status: newProductForm.status,
        collection: newProductForm.collection,
        image_url: newProductForm.image_url,
        image_hover_url: newProductForm.image_hover_url,
        stock: Object.values(newProductForm.size_stock).reduce((a, b) => a + b, 0),
        sizes: sizesArray,
        size_stock: newProductForm.size_stock,
      });

      showNotification('New dropped garment registered.');
      setShowAddForm(false);
      setNewProductForm({
        name: '',
        description: '',
        price: 420.90,
        status: 'new',
        collection: 'grid',
        image_url: '/img/products/img-1.jpg',
        image_hover_url: '/img/products/img-2.jpg',
        stock: 20,
        sizes: 'S,M,L,XL',
        size_stock: { S: 5, M: 5, L: 5, XL: 5 }
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
      showNotification('Failed to add product.');
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'shipped' | 'delivered') => {
    try {
      await dbService.updateOrderStatus(orderId, status);
      showNotification(`Order status updated to ${status}.`);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      showNotification('Failed to update order status.');
    }
  };

  if (loadingAuth) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
          VERIFYING ADMINISTRATOR SECURITY CREDENTIALS...
        </div>
      </div>
    );
  }

  // Security check: Access Denied if user role is not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 select-none flex justify-center items-center min-h-[70vh]">
        <div className="w-full max-w-md border border-red-950 p-8 sm:p-10 bg-red-950/10 text-center shadow-2xl">
          <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-[0.25em] block mb-2">ACCESS DEPRIVED</span>
          <h2 className="text-white text-lg uppercase tracking-wider font-extrabold mb-4">RESTRICTED ADMINISTRATOR ARCHIVE</h2>
          <p className="text-zinc-500 text-xs font-sans uppercase leading-relaxed font-light mb-8">
            You do not possess security access permissions to view inventory databases.
          </p>
          <a
            href="/profile"
            className="inline-block bg-white text-black font-mono text-[9px] tracking-widest uppercase px-6 py-3 font-bold hover:bg-zinc-250 transition-colors"
          >
            SIGN IN AS ADMIN
          </a>
        </div>
      </div>
    );
  }

  // Derive Admin statistics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 select-none">
      
      {/* Header */}
      <div className="border-b border-zinc-900 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-[0.3em]">ADMIN PORTAL</span>
          <h1 className="text-3xl sm:text-5xl uppercase tracking-wider font-extrabold mt-1 text-white">
            MANAGEMENT CONSOLE
          </h1>
        </div>

        <button
          onClick={loadDashboardData}
          className="text-zinc-550 hover:text-white flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer border border-zinc-900 px-4 py-2 hover:bg-zinc-900/40"
        >
          <RefreshCw className="w-4 h-4" /> SYNC CONSOLE RECORDS
        </button>
      </div>

      {/* 1. Quick Stat Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="border border-zinc-900 p-6 bg-zinc-950/20 shadow-xl">
          <div className="flex justify-between items-center text-zinc-500 mb-2">
            <span className="text-[9px] font-mono tracking-widest uppercase">GROSS REVENUE</span>
            <DollarSign className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="text-xl font-mono text-white font-bold">Php {totalRevenue.toFixed(2)}</span>
        </div>

        <div className="border border-zinc-900 p-6 bg-zinc-950/20 shadow-xl">
          <div className="flex justify-between items-center text-zinc-500 mb-2">
            <span className="text-[9px] font-mono tracking-widest uppercase">TOTAL ORDERS</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="text-xl font-mono text-white font-bold">{orders.length} LOGS</span>
        </div>

        <div className="border border-zinc-900 p-6 bg-zinc-950/20 shadow-xl">
          <div className="flex justify-between items-center text-zinc-500 mb-2">
            <span className="text-[9px] font-mono tracking-widest uppercase">INVENTORY PIECES</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="text-xl font-mono text-white font-bold">{totalStock} UNITS</span>
        </div>

        <div className="border border-zinc-900 p-6 bg-zinc-950/20 shadow-xl">
          <div className="flex justify-between items-center text-zinc-500 mb-2">
            <span className="text-[9px] font-mono tracking-widest uppercase">CATALOG ITEMS</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="text-xl font-mono text-white font-bold">{products.length} APPARELS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Product inventory editing */}
        <div className="xl:col-span-8 space-y-6">
          <div className="border border-zinc-900 p-6 sm:p-8 bg-zinc-950/20 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                <Package className="w-4 h-4 text-zinc-450" /> STOCK MANAGEMENT
              </h3>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-white text-black font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 font-bold hover:bg-zinc-250 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> ADD NEW POLO
              </button>
            </div>

            {/* Inline Add Product Form */}
            {showAddForm && (
              <form onSubmit={handleAddProductSubmit} className="border border-zinc-850 p-6 bg-black/40 mb-8 space-y-4 shadow-inner">
                <h4 className="font-display text-white text-xs uppercase tracking-widest border-b border-zinc-850 pb-2 mb-4">
                  REGISTER APPAREL SPECIFICATIONS
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Garment Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Blue Grid Cropped Polo"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-2.5 uppercase outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Price (PHP)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                      className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-2.5 uppercase outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Garment Description</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter specs"
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-2.5 uppercase outline-none focus:border-zinc-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Status Flag</label>
                    <select
                      value={newProductForm.status}
                      onChange={(e) => setNewProductForm({ ...newProductForm, status: e.target.value as any })}
                      className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-2.5 uppercase outline-none focus:border-zinc-500 cursor-pointer"
                    >
                      <option value="new">NEW</option>
                      <option value="sale">SALE</option>
                      <option value="popular">POPULAR</option>
                      <option value="sold-out">SOLD OUT</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Collection Type</label>
                    <select
                      value={newProductForm.collection}
                      onChange={(e) => setNewProductForm({ ...newProductForm, collection: e.target.value as any })}
                      className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-2.5 uppercase outline-none focus:border-zinc-500 cursor-pointer"
                    >
                      <option value="grid">GRID</option>
                      <option value="minimalist">MINIMALIST</option>
                      <option value="angel">ANGEL</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Primary Image URL</label>
                    <input
                      required
                      type="text"
                      value={newProductForm.image_url}
                      onChange={(e) => setNewProductForm({ ...newProductForm, image_url: e.target.value })}
                      className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-2.5 outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Hover Image URL</label>
                    <input
                      required
                      type="text"
                      value={newProductForm.image_hover_url}
                      onChange={(e) => setNewProductForm({ ...newProductForm, image_hover_url: e.target.value })}
                      className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-2.5 outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black font-mono text-[9px] tracking-widest py-3 uppercase font-bold hover:bg-zinc-250 transition-colors cursor-pointer"
                >
                  SAVE NEW PRODUCT TO DATABASE
                </button>
              </form>
            )}

            {/* Inventory table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px] text-zinc-400 uppercase border border-zinc-900">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-950/40 text-white font-bold">
                    <th className="p-4">Garment</th>
                    <th className="p-4">Collection</th>
                    <th className="p-4">Sizes Stock Configuration</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} className="border-b border-zinc-900 hover:bg-black/10">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-8 h-10 object-cover bg-zinc-900 border border-zinc-850"
                          />
                          <div>
                            <span className="text-white font-bold block">{prod.name}</span>
                            <span className="text-[8px] text-zinc-550 block">ID: {prod.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{prod.collection}</td>
                      <td className="p-4">
                        {editingId === prod.id ? (
                          <div className="flex gap-2">
                            {['S', 'M', 'L', 'XL'].map((size) => (
                              <div key={size} className="flex flex-col items-center gap-0.5">
                                <span className="text-[7px] text-zinc-500">{size}</span>
                                <input
                                  type="number"
                                  value={sizeStockForm[size] || 0}
                                  onChange={(e) => handleStockInputChange(size, Number(e.target.value))}
                                  className="bg-black border border-zinc-850 text-white text-center text-[9px] w-8 p-1 uppercase outline-none focus:border-zinc-500"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex gap-3 text-zinc-400">
                            {Object.entries(prod.size_stock).map(([size, stock]) => (
                              <span key={size} className={stock === 0 ? 'text-red-900 line-through' : ''}>
                                {size}: {stock}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {editingId === prod.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => submitStockUpdate(prod.id)}
                              className="text-white font-bold hover:underline cursor-pointer"
                            >
                              SAVE
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-zinc-650 hover:underline cursor-pointer"
                            >
                              CANCEL
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditingStock(prod)}
                            className="text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                          >
                            <Edit className="w-3.5 h-3.5" /> EDIT
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Right Side: Order dispatch logistics logs */}
        <div className="xl:col-span-4">
          <div className="border border-zinc-900 p-6 sm:p-8 bg-zinc-950/20 shadow-xl min-h-[50vh]">
            <h3 className="text-white text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2 border-b border-zinc-900 pb-3 mb-6">
              ORDER SYSTEM DISPATCH LOGS
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-20 text-zinc-650 uppercase font-mono text-[9px]">
                No orders filed in database.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((ord) => (
                  <div key={ord.id} className="border border-zinc-900 bg-black/40 p-4 space-y-3 shadow-lg text-[9px] font-mono uppercase tracking-wider">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                      <div>
                        <span className="text-zinc-500 font-bold">ID: </span>
                        <span className="text-white font-extrabold">{ord.id}</span>
                      </div>
                      <span className="text-zinc-450">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-1">
                      {ord.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex justify-between text-zinc-450">
                          <span>{item.productName} ({item.size}) x {item.quantity}</span>
                          <span>Php {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-zinc-900 pt-2 flex justify-between items-center">
                      <span className="text-zinc-500 font-bold">TOTAL: Php {ord.total.toFixed(2)}</span>
                      
                      {/* Order status dispatch selector */}
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="bg-black border border-zinc-850 text-white text-[8px] tracking-widest p-1 uppercase outline-none focus:border-zinc-500 cursor-pointer font-bold"
                      >
                        <option value="pending">PENDING</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                      </select>
                    </div>

                    <div className="text-[8px] text-zinc-650 border-t border-zinc-900/60 pt-2 leading-relaxed">
                      SHIPPED TO:
                      <br />
                      {ord.shippingAddress.fullName}
                      <br />
                      {ord.shippingAddress.street}, {ord.shippingAddress.city}
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
