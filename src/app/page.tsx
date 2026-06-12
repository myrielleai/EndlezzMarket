'use client';

import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import BrandStory from '@/components/BrandStory';
import Countdown from '@/components/Countdown';
import { Product } from '@/types';
import { dbService } from '@/lib/supabase';
import { Star, ArrowUpRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    dbService.getProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  const filterOptions = [
    { label: 'ALL', filter: 'all' },
    { label: 'LATEST', filter: 'latest' },
    { label: 'ANGEL', filter: 'angel' },
    { label: 'GRID', filter: 'grid' },
    { label: 'MINIMALIST', filter: 'minimalist' },
  ];

  // Filtering products
  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'latest') return p.status === 'new';
    return p.collection === selectedFilter;
  });

  const featuredCollections = [
    {
      title: 'Grid Collection',
      desc: 'A sleek and modern clothing line inspired by structure and symmetry. Featuring clean lines, geometric patterns, and a contemporary aesthetic.',
      badge: '2025 GRID',
      img: '/img/f-box-1.jpg',
      link: '/shop?collection=grid',
    },
    {
      title: 'Minimalist Collection',
      desc: 'Timeless, simple, and effortlessly stylish. The Minimalist Collection embraces clean silhouettes, neutral tones, and versatile designs that elevate everyday wear.',
      badge: '2025 MINIMALIST',
      img: '/img/f-box-3.jpg',
      link: '/shop?collection=minimalist',
    },
    {
      title: 'Angel Collection',
      desc: 'Soft, graceful, and ethereal—the Angel Collection brings a touch of elegance to your wardrobe with delicate linings, flowy drapes, and dreamy dark tones.',
      badge: '2025 ANGEL',
      img: '/img/f-box-2.jpg',
      link: '/shop?collection=angel',
    },
  ];

  return (
    <div className="bg-black text-white w-full">
      {/* 1. Cinematic Hero Slider */}
      <HeroSection />

      {/* 2. Collections Overview Grid */}
      <section className="py-24 bg-zinc-950/20 border-t border-zinc-900 px-6 sm:px-12 select-none" id="overview">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-[0.3em] mb-3 block">
              CATALOG OVERVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl uppercase tracking-wider font-extrabold text-white">
              THE COLLECTIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCollections.map((col, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between border border-zinc-900 bg-zinc-950/20 p-8 hover:border-zinc-800 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="aspect-[4/3] bg-zinc-900 mb-6 overflow-hidden relative">
                    <img
                      src={col.img}
                      alt={col.title}
                      className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white text-black font-mono text-[9px] uppercase px-2.5 py-1 tracking-widest font-black">
                      {col.badge}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
                    {col.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed font-sans uppercase font-light">
                    {col.desc}
                  </p>
                </div>

                <Link
                  href={col.link}
                  className="mt-8 text-xs font-mono tracking-widest uppercase text-white hover:text-zinc-400 flex items-center gap-1.5 transition-colors border-t border-zinc-900 pt-4"
                >
                  DISCOVER COLLECTION <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Drop Countdown Timer */}
      <Countdown />

      {/* 4. Latest Products (Showcase with Filter tab) */}
      <section className="py-24 px-6 sm:px-12 border-b border-zinc-900 select-none">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div>
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-[0.3em]">SHOP RELEASES</span>
              <h2 className="text-3xl uppercase tracking-wider font-extrabold text-white mt-1">
                LATEST GARMENTS
              </h2>
            </div>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {filterOptions.map((opt) => (
                <button
                  key={opt.filter}
                  onClick={() => setSelectedFilter(opt.filter)}
                  className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 border transition-all cursor-pointer ${
                    selectedFilter === opt.filter
                      ? 'bg-white text-black border-white font-bold'
                      : 'border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product cards list */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex flex-col gap-4 animate-pulse">
                  <div className="aspect-[3/4] bg-zinc-900 w-full" />
                  <div className="h-4 bg-zinc-900 w-2/3" />
                  <div className="h-3 bg-zinc-900 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="inline-block bg-transparent text-white font-mono text-[10px] tracking-widest uppercase px-8 py-4 border border-zinc-800 hover:border-white transition-all font-bold"
            >
              BROWSE ALL GARMENTS
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Brand Storytelling Grid (Athletes and Transformations) */}
      <BrandStory />

      {/* 6. Lookbook Banner Teaser Section */}
      <section className="relative w-full h-[60vh] bg-zinc-950 overflow-hidden flex items-center justify-start px-6 sm:px-12 md:px-24 select-none border-y border-zinc-900">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src="/img/lookbok.jpg"
          alt="Lookbook 2025"
          className="absolute inset-0 object-cover w-full h-full filter grayscale"
        />
        <div className="relative z-20 max-w-xl">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 block">
            AESTHETIC FOLIO
          </span>
          <h2 className="text-white text-3xl sm:text-5xl uppercase tracking-wider font-extrabold mb-4 leading-tight">
            2025 STREETLOOK
            <br />
            LOOKBOOK
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-sans uppercase font-light leading-relaxed mb-8">
            Step into a world where geometry, simplicity, and grace redefine modern street armor. Discover boxy cuts, dropped sleeves, and heavy knit comfort.
          </p>
          <Link
            href="/lookbook"
            className="inline-flex items-center gap-2 bg-white text-black font-mono text-[10px] tracking-widest uppercase px-8 py-4 font-bold hover:bg-zinc-250 transition-colors"
          >
            EXPLORE THE LOOKS <BookOpen className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 7. Sizable Mapua Student Discount Promo Grid */}
      <section className="py-20 px-6 sm:px-12 bg-black select-none border-b border-zinc-900" id="sizechart">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-[0.2em] mb-2 block">SIZING SYSTEM</span>
            <h2 className="text-white text-2xl sm:text-3xl uppercase tracking-wider font-extrabold mb-6">
              FIND YOUR STRUCTURE
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-sans uppercase leading-relaxed font-light mb-8">
              All Endlezz polos are cut with a customized boxy streetwear fit—meaning they feature dropped shoulder bounds and fall naturally near the belt waistline.
              Compare coordinates below to match your aesthetic:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px] text-zinc-400 uppercase border border-zinc-900">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-950/40 text-white font-bold">
                    <th className="p-4">Size</th>
                    <th className="p-4">Chest Width (in)</th>
                    <th className="p-4">Shoulder (in)</th>
                    <th className="p-4">Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-900">
                    <td className="p-4 text-white font-black">S</td>
                    <td className="p-4">22.0</td>
                    <td className="p-4">20.5</td>
                    <td className="p-4">21.5</td>
                  </tr>
                  <tr className="border-b border-zinc-900">
                    <td className="p-4 text-white font-black">M</td>
                    <td className="p-4">23.0</td>
                    <td className="p-4">21.5</td>
                    <td className="p-4">22.5</td>
                  </tr>
                  <tr className="border-b border-zinc-900">
                    <td className="p-4 text-white font-black">L</td>
                    <td className="p-4">24.0</td>
                    <td className="p-4">22.5</td>
                    <td className="p-4">23.5</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-white font-black">XL</td>
                    <td className="p-4">25.0</td>
                    <td className="p-4">23.5</td>
                    <td className="p-4">24.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-zinc-900 bg-zinc-950/10 p-6 sm:p-12 relative overflow-hidden flex flex-col justify-center shadow-2xl">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-zinc-900 rounded-full blur-3xl opacity-10" />
            
            <h3 className="text-white text-lg uppercase tracking-wider font-extrabold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-spin-slow" /> MAPUAN DISCOUNT POLICY
            </h3>
            
            <p className="text-zinc-450 text-xs font-sans uppercase leading-relaxed font-light mb-6">
              We provide an automatic 20% discount on all purchases for students of Mapúa University. To activate:
            </p>

            <ul className="space-y-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <li className="flex items-start gap-3">
                <span className="text-white font-bold">[1]</span>
                <span>Register with your active `@mymail.mapua.edu.ph` address.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white font-bold">[2]</span>
                <span>Enter validation code `MAPUA20` at order confirmation steps.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white font-bold">[3]</span>
                <span>Upload student ID scan during order validation emails.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
