'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Product } from '@/types';
import { dbService } from '@/lib/supabase';
import Link from 'next/link';
import { formatPeso } from '@/components/ProductCard';

const SUGGESTIONS = ['Grid', 'Minimalist', 'Angel', 'Black', 'Blue', 'Polo'];

const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const [all, setAll] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      dbService.getProducts().then(setAll);
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsSearchOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setIsSearchOpen]);

  const q = query.trim().toLowerCase();
  const results = q ? all.filter((p) => p.name.toLowerCase().includes(q) || p.collection.includes(q)).slice(0, 8) : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-ink z-[9980]"
          />
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 inset-x-0 z-[9990] bg-paper max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-label="Search"
          >
            <div className="px-4 sm:px-6 lg:px-10 pt-6 pb-10">
              <div className="flex items-center gap-4 border-b-2 border-ink pb-3">
                <Search className="w-6 h-6 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="display text-5xl sm:text-7xl bg-transparent outline-none w-full placeholder:text-ink/20"
                />
                <button onClick={() => setIsSearchOpen(false)} className="p-2 -mr-2" aria-label="Close search">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!q && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="label text-mute mr-2">Popular</span>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="h-9 px-4 border border-line hover:border-ink text-[13px] font-semibold uppercase tracking-wide transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {q && results.length === 0 && <p className="mt-8 text-mute">No results for “{query}”.</p>}

              {results.length > 0 && (
                <>
                  <p className="label text-mute mt-6 mb-4">{results.length} results</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {results.map((p) => (
                      <Link key={p.id} href={`/product/${p.id}`} onClick={() => setIsSearchOpen(false)} className="group">
                        <div className="aspect-[4/5] bg-paper-2 overflow-hidden">
                          <img src={p.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <p className="text-xs font-semibold uppercase mt-2 leading-snug line-clamp-2">{p.name}</p>
                        <p className="font-mono text-xs text-mute mt-0.5">{formatPeso(p.price)}</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
