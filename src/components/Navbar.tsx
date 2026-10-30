'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Search, ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ANNOUNCEMENTS = [
  'Free shipping on orders over ₱2,000 — PH wide',
  'Orders ship in 2–4 business days',
];

const COLLECTIONS = [
  { label: 'Grid', href: '/shop?collection=grid', img: '/img/min/grid1.jpg', note: 'Structure & symmetry' },
  { label: 'Minimalist', href: '/shop?collection=minimalist', img: '/img/min/min1.jpg', note: 'Clean silhouettes' },
  { label: 'Angel', href: '/shop?collection=angel', img: '/img/min/ang2.jpg', note: 'Piped linings' },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, isMobileMenuOpen, setIsMobileMenuOpen, setIsSearchOpen } = useStore();
  const [megaOpen, setMegaOpen] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
  }, [pathname]);

  const primary = [
    { label: 'Shop all', href: '/shop' },
    { label: 'Lookbook', href: '/lookbook' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[80]" onMouseLeave={() => setMegaOpen(false)}>
        {/* Announcement bar */}
        <div className="h-8 bg-ink text-paper flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="label !text-[10px] sm:!text-[11px] px-4 text-center truncate"
            >
              {ANNOUNCEMENTS[msgIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Main bar */}
        <div className="h-16 bg-paper/95 backdrop-blur-md border-b border-line relative">
          <div className="h-full px-4 sm:px-6 lg:px-10 grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Left */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden -ml-2 p-2"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold uppercase tracking-wide">
                <button
                  onMouseEnter={() => setMegaOpen(true)}
                  onClick={() => setMegaOpen((o) => !o)}
                  className={`link-u py-1 uppercase ${megaOpen ? 'bg-[length:100%_1px]' : ''}`}
                  aria-expanded={megaOpen}
                >
                  Collections
                </button>
                {primary.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onMouseEnter={() => setMegaOpen(false)}
                    aria-current={pathname === l.href ? 'page' : undefined}
                    className="link-u py-1"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Logo */}
            <Link href="/" className="justify-self-center" aria-label="Endlezz home">
              <img src="/img/logo.png" alt="Endlezz" className="h-6 sm:h-7 w-auto mix-blend-multiply" />
            </Link>

            {/* Right */}
            <div className="flex items-center justify-end gap-1 sm:gap-5 text-[13px] font-semibold uppercase tracking-wide">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 sm:p-0 flex items-center gap-2 link-u uppercase" aria-label="Search">
                <Search className="w-[18px] h-[18px] sm:hidden" />
                <span className="hidden sm:inline">Search</span>
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 sm:p-0 flex items-center gap-1.5 uppercase"
                aria-label={`Bag, ${cartCount} items`}
              >
                <ShoppingBag className="w-[18px] h-[18px] sm:hidden" />
                <span className="hidden sm:inline link-u">Bag</span>
                <span
                  className={`font-mono text-[11px] min-w-5 h-5 px-1 inline-flex items-center justify-center ${
                    cartCount > 0 ? 'bg-signal text-white' : 'bg-ink/10 text-ink'
                  }`}
                >
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mega menu */}
          <AnimatePresence>
            {megaOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:block absolute top-full left-0 w-full bg-paper border-b border-line"
              >
                <div className="px-10 py-8 grid grid-cols-[220px_1fr] gap-10">
                  <div className="flex flex-col gap-3">
                    <span className="label text-mute">Shop by</span>
                    <Link href="/shop" className="display text-4xl hover:text-signal transition-colors">All pieces</Link>
                    {COLLECTIONS.map((c) => (
                      <Link key={c.label} href={c.href} className="display text-4xl hover:text-signal transition-colors">
                        {c.label}
                      </Link>
                    ))}
                    <Link href="/#sizechart" className="label mt-4 link-u self-start">Size guide</Link>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {COLLECTIONS.map((c) => (
                      <Link key={c.label} href={c.href} className="group relative aspect-[4/3] overflow-hidden bg-paper-2">
                        <img
                          src={c.img}
                          alt=""
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between bg-gradient-to-t from-ink/60 to-transparent text-white">
                          <div>
                            <p className="display text-2xl">{c.label}</p>
                            <p className="label !text-[10px] opacity-80">{c.note}</p>
                          </div>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink z-[90]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              className="fixed top-0 left-0 h-full w-[88%] max-w-[380px] bg-paper z-[100] flex flex-col"
            >
              <div className="h-16 px-4 flex items-center justify-between border-b border-line">
                <img src="/img/logo.png" alt="Endlezz" className="h-6 mix-blend-multiply" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2" aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col">
                {[{ label: 'Shop all', href: '/shop' }, ...COLLECTIONS, { label: 'Lookbook', href: '/lookbook' }].map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="display text-5xl py-2 border-b border-line flex items-center justify-between"
                  >
                    {l.label}
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                ))}
                <div className="mt-6 flex flex-col gap-3 label">
                  <Link href="/#sizechart" onClick={() => setIsMobileMenuOpen(false)}>Size guide</Link>
                </div>
              </nav>
              <div className="px-4 py-4 border-t border-line label text-mute">Discipline · Silence · Resilience</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
