'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { dbService } from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCollection = searchParams.get('collection') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Handle URL change updates
    const col = searchParams.get('collection') || 'all';
    setSelectedCollection(col);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    dbService.getProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCollection =
      selectedCollection === 'all' || p.collection === selectedCollection;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCollection && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'popular':
        return (b.status === 'popular' ? 1 : 0) - (a.status === 'popular' ? 1 : 0);
      default: // 'featured'
        return (b.status === 'new' ? 1 : 0) - (a.status === 'new' ? 1 : 0);
    }
  });

  const collectionsList = [
    { label: 'ALL COLLECTIONS', value: 'all' },
    { label: 'GRID COLLECTION', value: 'grid' },
    { label: 'MINIMALIST COLLECTION', value: 'minimalist' },
    { label: 'ANGEL COLLECTION', value: 'angel' },
  ];

  const sortOptions = [
    { label: 'FEATURED RELEASES', value: 'featured' },
    { label: 'POPULARITY', value: 'popular' },
    { label: 'PRICE: LOW TO HIGH', value: 'price-asc' },
    { label: 'PRICE: HIGH TO LOW', value: 'price-desc' },
    { label: 'NAME: A-Z', value: 'name-asc' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 select-none">
      {/* Page header title */}
      <div className="border-b border-zinc-900 pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">SHOP OVERVIEW</span>
          <h1 className="text-3xl sm:text-5xl uppercase tracking-wider font-extrabold mt-1 text-white">
            THE GARMENTS
          </h1>
        </div>
        <p className="text-zinc-650 text-xs font-mono uppercase tracking-widest max-w-sm">
          A physical showcase of geometric structure, minimal design consistency, and active resilience.
        </p>
      </div>

      {/* Filter Options & Search Header Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
        
        {/* Left Side: Collection selectors & Sort */}
        <div className="lg:col-span-3 space-y-6">
          <div className="border border-zinc-900 p-6 bg-zinc-950/20 shadow-xl space-y-6">
            
            {/* Search Input Box */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase flex items-center gap-1.5">
                <Search className="w-3 h-3" /> SEARCH INVENTORY
              </label>
              <input
                type="text"
                placeholder="ENTER SEARCH QUERY"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3 w-full uppercase outline-none focus:border-zinc-500"
              />
            </div>

            {/* Collection filter */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase flex items-center gap-1.5">
                <Filter className="w-3 h-3" /> COLLECTION CATEGORY
              </span>
              <div className="flex flex-col gap-2">
                {collectionsList.map((col) => (
                  <button
                    key={col.value}
                    onClick={() => setSelectedCollection(col.value)}
                    className={`text-left font-mono text-[10px] tracking-widest uppercase p-2 border transition-all cursor-pointer ${
                      selectedCollection === col.value
                        ? 'border-white text-white font-bold bg-zinc-900/30'
                        : 'border-zinc-950 text-zinc-500 hover:text-white hover:border-zinc-850'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort selectors */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3" /> ORDER SORTING
              </span>
              <div className="flex flex-col gap-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`text-left font-mono text-[10px] tracking-widest uppercase p-2 border transition-all cursor-pointer ${
                      sortBy === opt.value
                        ? 'border-white text-white font-bold bg-zinc-900/30'
                        : 'border-zinc-950 text-zinc-500 hover:text-white hover:border-zinc-850'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Product Card Grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="flex flex-col gap-4 animate-pulse">
                  <div className="aspect-[3/4] bg-zinc-900 w-full" />
                  <div className="h-4 bg-zinc-900 w-2/3" />
                  <div className="h-3 bg-zinc-900 w-1/3" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="border border-zinc-900 bg-zinc-950/20 py-24 text-center">
              <h3 className="font-display uppercase tracking-widest text-sm text-zinc-500 mb-2">
                No Garments Found
              </h3>
              <p className="text-zinc-600 text-xs uppercase font-mono max-w-xs mx-auto">
                No streetwear elements match your query. Try resetting your search parameters.
              </p>
              <button
                onClick={() => {
                  setSelectedCollection('all');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                className="mt-6 border border-zinc-800 px-6 py-2.5 text-[9px] font-mono tracking-widest uppercase hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
                <span>DISPLAYING {sortedProducts.length} GARMENTS</span>
                <span>FILTER ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 flex justify-center items-center h-[50vh]">
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">LOADING SHOP FILES...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
