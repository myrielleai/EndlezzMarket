'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Product } from '@/types';
import { dbService } from '@/lib/supabase';
import Link from 'next/link';

const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch products once on open
  useEffect(() => {
    if (isSearchOpen) {
      dbService.getProducts().then(setAllProducts);
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isSearchOpen]);

  // Filter products on query change
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.collection.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
  }, [query, allProducts]);

  // Handle Escape key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9990] bg-black/90 backdrop-blur-md flex flex-col justify-start pt-32 px-6 sm:px-12 md:px-24"
        >
          <div className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-4 w-full">
              <Search className="w-6 h-6 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="SEARCH FOR STREETWEAR..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent border-none text-white text-lg sm:text-2xl font-display uppercase tracking-widest outline-none w-full placeholder-zinc-600"
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-zinc-400 hover:text-white p-2 hover:rotate-90 transition-transform duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full max-w-4xl mx-auto mt-8 flex-grow overflow-y-auto">
            {query.trim() !== '' && results.length === 0 ? (
              <div className="text-zinc-500 uppercase tracking-wider text-sm">
                No matching garments found.
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-zinc-900 pb-4"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-16 h-16 relative bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white group-hover:text-zinc-400 transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                          {product.collection} collection
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-300 font-mono">
                        Php {product.price.toFixed(2)}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            
            {query.trim() === '' && (
              <div className="text-xs tracking-widest text-zinc-500 uppercase">
                Try searching: &quot;Grid&quot;, &quot;Minimalist&quot;, &quot;Polo&quot;, &quot;Angel&quot;
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
