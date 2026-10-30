'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import CampaignVideo from '@/components/CampaignVideo';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { dbService } from '@/lib/supabase';
import { ArrowUpRight } from 'lucide-react';

const SectionHead: React.FC<{ eyebrow: string; title: string; right?: React.ReactNode }> = ({ eyebrow, title, right }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
    <div>
      <p className="label text-mute mb-2">{eyebrow}</p>
      <h2 className="display text-5xl sm:text-7xl">{title}</h2>
    </div>
    {right}
  </div>
);

const COLLECTIONS = [
  { key: 'grid', title: 'Grid', img: '/img/min/grid1.jpg', desc: 'Structure, symmetry, geometric seams.' },
  { key: 'minimalist', title: 'Minimalist', img: '/img/min/min1.jpg', desc: 'Neutral tones. Nothing extra.' },
  { key: 'angel', title: 'Angel', img: '/img/min/ang2.jpg', desc: 'Contrast piping, soft drape.' },
];

const SIZES = [
  ['S', '22.0', '20.5', '21.5'],
  ['M', '23.0', '21.5', '22.5'],
  ['L', '24.0', '22.5', '23.5'],
  ['XL', '25.0', '23.5', '24.5'],
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbService.getProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    products.forEach((p) => (c[p.collection] = (c[p.collection] || 0) + 1));
    return c;
  }, [products]);

  const shown = products.filter((p) => filter === 'all' || p.collection === filter).slice(0, 4);


  return (
    <div className="w-full">
      <HeroSection />

      {/* New arrivals */}
      <section className="px-4 sm:px-6 lg:px-10 pt-14 sm:pt-20 pb-16" aria-labelledby="new-in">
        <SectionHead
          eyebrow="Shop"
          title="New in"
          right={
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2" role="tablist">
              {['all', 'grid', 'minimalist', 'angel'].map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`text-[13px] font-semibold uppercase tracking-wide link-u ${
                    filter === f ? 'bg-[length:100%_1px]' : 'text-mute hover:text-ink'
                  }`}
                >
                  {f}
                  <sup className="font-mono text-[10px] ml-0.5">{counts[f] ?? 0}</sup>
                </button>
              ))}
            </div>
          }
        />
        <h2 id="new-in" className="sr-only">New arrivals</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 sm:gap-x-3 gap-y-8 sm:gap-y-10">
          {loading
            ? Array.from({ length: 4 }).map((_, n) => (
                <div key={n} className="animate-pulse">
                  <div className="aspect-[4/5] bg-paper-2" />
                  <div className="h-3 bg-paper-2 mt-3 w-3/4" />
                  <div className="h-3 bg-paper-2 mt-2 w-1/3" />
                </div>
              ))
            : shown.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 h-12 px-8 border border-ink text-[13px] font-bold uppercase tracking-wide hover:bg-ink hover:text-paper transition-colors"
          >
            Shop all {counts.all ? `(${counts.all})` : ''} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Collections triptych */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line" aria-label="Collections">
        {COLLECTIONS.map((c, i) => (
          <Link
            key={c.key}
            href={`/shop?collection=${c.key}`}
            className="group relative aspect-[4/5] md:aspect-[3/4.4] overflow-hidden bg-paper-2"
          >
            <img
              src={c.img}
              alt={`${c.title} collection`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 font-mono text-xs text-ink">0{i + 1}</span>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white flex items-end justify-between gap-4">
              <div>
                <h3 className="display text-6xl sm:text-7xl">{c.title}</h3>
                <p className="label mt-2 opacity-90">
                  {c.desc} · {counts[c.key] ?? 0} pieces
                </p>
              </div>
              <span className="w-11 h-11 shrink-0 bg-paper text-ink flex items-center justify-center group-hover:bg-signal group-hover:text-white transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* About / manifesto */}
      <section id="about" className="px-4 sm:px-6 lg:px-10 py-20 sm:py-28 grid lg:grid-cols-12 gap-10 border-b border-line">
        <p className="label text-mute lg:col-span-3">Behind the brand</p>
        <div className="lg:col-span-9">
          <p className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-balance">
            Boxy, cropped shirts for people who build in silence. Dropped shoulders, heavy cotton, a hem that sits at the belt.          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 label">
            <span>01 — Discipline</span>
            <span>02 — Silence</span>
            <span>03 — Resilience</span>
          </div>
        </div>
      </section>

      {/* Editorial split: campaign film + lookbook */}
      <section className="grid md:grid-cols-[auto_1fr] md:h-[min(88vh,860px)] border-t border-line">
        <CampaignVideo className="aspect-[4/5] md:aspect-[4/5] md:h-full" />
        <div className="flex flex-col gap-8 p-4 sm:p-8 md:pb-0 lg:pt-12 lg:pl-12 lg:pr-10 md:min-h-0">
          <div>
            <p className="label text-mute mb-4">Lookbook</p>
            <h2 className="display text-[18vw] md:text-[6.5vw] xl:text-[6.75rem] leading-[0.85] md:whitespace-nowrap">Street Look</h2>
            <div className="mt-5 flex flex-col xl:flex-row xl:items-end justify-between gap-5">
              <p className="max-w-sm text-ink-2 leading-relaxed">
                Boxy cuts and dropped sleeves, styled with wide denim. Every colourway, shot in one white room.
              </p>
              <Link
                href="/lookbook"
                className="inline-flex items-center gap-3 h-12 px-7 bg-ink text-paper text-[13px] font-bold uppercase tracking-wide hover:bg-signal transition-colors self-start xl:self-auto shrink-0"
              >
                View the lookbook <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 md:flex-1 md:min-h-0">
            {['/img/min/ang1.jpg', '/img/min/min3.jpg', '/img/min/grid3.jpg'].map((src) => (
              <Link
                key={src}
                href="/lookbook"
                className="group aspect-[3/4] md:aspect-auto md:h-full bg-paper-2 overflow-hidden"
                aria-label="Open the lookbook"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Size guide */}
      <section id="sizechart" className="px-4 sm:px-6 lg:px-10 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 border-b border-line">
        <div>
          <p className="label text-mute mb-2">Fit</p>
          <h2 className="display text-5xl sm:text-7xl mb-4">Size guide</h2>
          <p className="text-ink-2 max-w-md mb-8">
            Cut boxy with a dropped shoulder; the hem lands near the belt. Between sizes? Take your usual size for the
            intended fit, size up for extra room.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead>
                <tr className="border-b-2 border-ink label">
                  <th className="py-3 pr-4 font-medium">Size</th>
                  <th className="py-3 pr-4 font-medium">Chest</th>
                  <th className="py-3 pr-4 font-medium">Shoulder</th>
                  <th className="py-3 font-medium">Length</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((r) => (
                  <tr key={r[0]} className="border-b border-line hover:bg-paper-2 transition-colors">
                    <td className="py-3 pr-4 font-bold">{r[0]}</td>
                    <td className="py-3 pr-4 tabular-nums">{r[1]}&quot;</td>
                    <td className="py-3 pr-4 tabular-nums">{r[2]}&quot;</td>
                    <td className="py-3 tabular-nums">{r[3]}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-full bg-paper-2 overflow-hidden">
          <img src="/img/min/min2.jpg" alt="Minimalist cropped polo, boxy fit" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top" />
        </div>
      </section>

      {/* Social strip */}
      <section className="pt-16 sm:pt-20">
        <div className="px-4 sm:px-6 lg:px-10 flex items-end justify-between mb-6">
          <div>
            <p className="label text-mute mb-2">Tag us</p>
            <h2 className="display text-5xl sm:text-7xl">@endlezz.market</h2>
          </div>
          <a
            href="https://www.instagram.com/endlezz.market/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex label link-u items-center gap-1"
          >
            Follow <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6">
          {['/img/other/img2.JPG', '/img/other/img3.JPG', '/img/other/img5.jpeg', '/img/other/img4.JPG', '/img/other/img8.jpeg', '/img/other/img6.jpeg'].map(
            (src) => (
              <a
                key={src}
                href="https://www.instagram.com/endlezz.market/"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden bg-paper-2"
                aria-label="Endlezz on Instagram"
              >
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-signal/0 group-hover:bg-signal/20 transition-colors" />
              </a>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
