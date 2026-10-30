'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { dbService } from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Search, X } from 'lucide-react';

const COLLECTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Grid', value: 'grid' },
  { label: 'Minimalist', value: 'minimalist' },
  { label: 'Angel', value: 'angel' },
];

const SORTS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Best sellers', value: 'popular' },
  { label: 'Price, low–high', value: 'price-asc' },
  { label: 'Price, high–low', value: 'price-desc' },
  { label: 'A–Z', value: 'name-asc' },
];

const HERO: Record<string, { title: string; img: string; blurb: string }> = {
  all: { title: 'Shop all', img: '/img/slider-3.jpg', blurb: 'Every colourway, every collection.' },
  grid: { title: 'Grid', img: '/img/min/grid3.jpg', blurb: 'Structure and symmetry. Geometric seams, clean lines.' },
  minimalist: { title: 'Minimalist', img: '/img/min/min2.jpg', blurb: 'Neutral tones and versatile shapes for everyday wear.' },
  angel: { title: 'Angel', img: '/img/min/ang1.jpg', blurb: 'Contrast piping and a softer drape.' },
};

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const collection = searchParams.get('collection') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [query, setQuery] = useState('');
  const [inStock, setInStock] = useState(false);
  const [cols, setCols] = useState<3 | 4>(4);

  useEffect(() => {
    dbService.getProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  const setCollection = (c: string) => {
    router.replace(c === 'all' ? '/shop' : `/shop?collection=${c}`, { scroll: false });
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    products.forEach((p) => (c[p.collection] = (c[p.collection] || 0) + 1));
    return c;
  }, [products]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        (collection === 'all' || p.collection === collection) &&
        (!inStock || p.stock > 0) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'popular': return (b.status === 'popular' ? 1 : 0) - (a.status === 'popular' ? 1 : 0);
        default: return (b.status === 'new' ? 1 : 0) - (a.status === 'new' ? 1 : 0);
      }
    });
  }, [products, collection, inStock, query, sortBy]);

  const hero = HERO[collection] || HERO.all;

  return (
    <div className="w-full">
      {/* Collection header */}
      <section className="relative h-[42vh] min-h-[300px] overflow-hidden bg-paper-2">
        <img key={hero.img} src={hero.img} alt="" className="absolute inset-0 w-full h-full object-cover object-[50%_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 lg:px-10 pb-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <h1 className="display text-[20vw] sm:text-[12vw] lg:text-[9rem] leading-[0.8]">{hero.title}</h1>
          <p className="max-w-xs text-sm sm:text-right opacity-90">{hero.blurb}</p>
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-[var(--header-h)] z-30 bg-paper/95 backdrop-blur-md border-b border-line">
        <div className="px-4 sm:px-6 lg:px-10 py-3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-5 overflow-x-auto -mx-1 px-1">
            {COLLECTIONS.map((c) => (
              <button
                key={c.value}
                onClick={() => setCollection(c.value)}
                className={`text-[13px] font-semibold uppercase tracking-wide whitespace-nowrap link-u ${
                  collection === c.value ? 'bg-[length:100%_1px]' : 'text-mute hover:text-ink'
                }`}
              >
                {c.label}
                <sup className="font-mono text-[10px] ml-0.5">{counts[c.value] ?? 0}</sup>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-mute" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search products"
                className="w-full sm:w-44 h-9 pl-6 bg-transparent border-b border-line focus:border-ink outline-none text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-[var(--color-signal)] w-4 h-4" />
              In stock
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort"
              className="h-9 bg-transparent text-[13px] font-semibold uppercase tracking-wide outline-none cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <div className="hidden lg:flex items-center gap-1" aria-label="Grid density">
              {[3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setCols(n as 3 | 4)}
                  className={`w-7 h-7 font-mono text-xs ${cols === n ? 'bg-ink text-paper' : 'text-mute hover:text-ink'}`}
                  aria-pressed={cols === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="px-4 sm:px-6 lg:px-10 pt-6 pb-20">
        <p className="label text-mute mb-5">{loading ? 'Loading…' : `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`}</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10">
            {Array.from({ length: 8 }).map((_, n) => (
              <div key={n} className="animate-pulse">
                <div className="aspect-[4/5] bg-paper-2" />
                <div className="h-3 bg-paper-2 mt-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="display text-5xl sm:text-6xl">Nothing here</p>
            <p className="text-mute mt-3">No pieces match those filters.</p>
            <button
              onClick={() => {
                setCollection('all');
                setQuery('');
                setInStock(false);
              }}
              className="mt-6 inline-flex items-center gap-2 h-11 px-6 border border-ink text-[13px] font-bold uppercase tracking-wide hover:bg-ink hover:text-paper transition-colors"
            >
              <X className="w-4 h-4" /> Clear filters
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-2 md:grid-cols-3 ${cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-x-2 sm:gap-x-3 gap-y-8 sm:gap-y-10`}>
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="h-[60vh] flex items-center justify-center label text-mute">Loading…</div>}>
      <ShopContent />
    </Suspense>
  );
}
