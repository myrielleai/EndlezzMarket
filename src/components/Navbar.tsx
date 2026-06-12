'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    cartCount,
    setIsCartOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsSearchOpen,
    user
  } = useStore();

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    {
      title: 'BEHIND THE BRAND',
      subLinks: [
        { label: 'ABOUT', href: '/#about' },
        { label: 'CONTACT US', href: '/#contact' },
      ],
    },
    {
      title: 'FEATURED',
      subLinks: [
        { label: 'LOOKBOOK', href: '/lookbook' },
        { label: 'BLOG', href: '/blog' },
      ],
    },
    {
      title: 'SHOP',
      subLinks: [
        { label: 'COLLECTIONS', href: '/shop' },
        { label: 'SIZE CHART', href: '/#sizechart' },
      ],
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[80] select-none bg-black border-b border-zinc-900">
        {/* Rolling Banner Ticker */}
        <div className="bg-white text-black py-2 overflow-hidden text-[9px] sm:text-xs font-mono uppercase tracking-[0.2em] font-semibold border-b border-zinc-800">
          <div className="animate-marquee-scroll whitespace-nowrap">
            <span className="mx-12">FREE SHIPPING ON ORDERS OVER P2000 IN THE PHILIPPINES</span>
            <span className="mx-12">|</span>
            <span className="mx-12">20% MAPUAN DISCOUNT</span>
            <span className="mx-12">|</span>
            <span className="mx-12">10% OFF ON 2024 COLLECTION</span>
            <span className="mx-12">|</span>
            <span className="mx-12">5% OFF CODE: BLANCAFLOR</span>
            <span className="mx-12">|</span>
            <span className="mx-12">FREE SHIPPING ON ORDERS OVER P2000 IN THE PHILIPPINES</span>
            <span className="mx-12">|</span>
            <span className="mx-12">20% MAPUAN DISCOUNT</span>
            <span className="mx-12">|</span>
            <span className="mx-12">10% OFF ON 2024 COLLECTION</span>
            <span className="mx-12">|</span>
            <span className="mx-12">5% OFF CODE: BLANCAFLOR</span>
          </div>
        </div>

        {/* Main Nav Area */}
        <div className="px-6 md:px-12 py-5 flex items-center justify-between bg-black/80 backdrop-blur-md">
          {/* Hamburger trigger for Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-zinc-400 hover:text-white p-2"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-zinc-400">
            {navLinks.map((item, idx) => (
              <div key={idx} className="relative group py-2">
                <button className="flex items-center gap-1 hover:text-white transition-colors duration-300 uppercase">
                  {item.title} <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-zinc-950 border border-zinc-850 p-4 min-w-[200px] shadow-xl">
                  <div className="flex flex-col gap-3">
                    {item.subLinks.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sub.href}
                        className="hover:text-white transition-colors duration-200 text-[10px]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {/* Direct Admin link if user is admin */}
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-white hover:text-red-500 font-bold border border-red-900 px-2 py-1 transition-all">
                DASHBOARD
              </Link>
            )}
          </nav>

          {/* Centered Logo Branding */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/img/logo.png"
                alt="Endlezz Market Logo"
                className="h-8 w-auto filter invert brightness-200 group-hover:rotate-6 transition-transform duration-500"
              />
              <span className="font-display font-bold tracking-[0.3em] text-white text-base sm:text-lg select-none group-hover:opacity-80 transition-opacity">
                ENDLEZZ
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/profile"
              className="p-2 hover:text-white transition-colors"
            >
              <User className={`w-5 h-5 ${user ? 'text-white border-b-2 border-b-zinc-400 pb-0.5' : ''}`} />
            </Link>
            <button
              onClick={handleCartClick}
              className="p-2 hover:text-white transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-mono font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg border border-black scale-95">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black z-[90]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-zinc-950 border-r border-zinc-900 z-[100] px-6 py-12 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-2">
                    <img src="/img/logo.png" alt="Logo" className="h-6 filter invert" />
                    <span className="font-display font-bold tracking-widest text-sm text-white">ENDLEZZ</span>
                  </div>
                  <button onClick={toggleMobileMenu} className="text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-6 font-mono text-sm tracking-widest">
                  {navLinks.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <span className="text-[10px] text-zinc-650 uppercase font-black tracking-[0.2em]">
                        {item.title}
                      </span>
                      <div className="flex flex-col gap-2 pl-2">
                        {item.subLinks.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            onClick={toggleMobileMenu}
                            className="text-zinc-300 hover:text-white transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={toggleMobileMenu}
                      className="text-red-500 font-bold border border-red-900 px-3 py-2 text-center transition-all bg-red-950/20"
                    >
                      ADMIN PANEL
                    </Link>
                  )}
                </nav>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 border-t border-zinc-900 pt-4">
                © {new Date().getFullYear()} ENDLEZZ MARKET
                <br />
                DISCIPLINE • SILENCE • RESILIENCE
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
