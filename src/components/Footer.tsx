'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';
import { Share2 } from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useStore();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await dbService.subscribeNewsletter(email);
      showNotification('Subscribed to Endlezz Newsletter!');
      setEmail('');
    } catch (err) {
      console.error(err);
      showNotification('Subscription failed.');
    } finally {
      setLoading(false);
    }
  };

  const footerLinks = [
    {
      title: 'About Endlezz',
      items: [
        { label: 'About', href: '/#about' },
        { label: 'Community', href: '/#community' },
        { label: 'Jobs', href: '/#comingsoon' },
        { label: 'Shipping', href: '/#shipping' },
        { label: 'Contact Us', href: '/#contact' },
      ],
    },
    {
      title: 'Customer Care',
      items: [
        { label: 'Fashion Advice', href: '/#comingsoon' },
        { label: 'Return & Exchange Policy', href: '/#comingsoon' },
        { label: 'Privacy Policy', href: '/#comingsoon' },
        { label: 'Shipping & Delivery', href: '/#comingsoon' },
        { label: 'Contact Us', href: '/#contact' },
      ],
    },
    {
      title: 'Our Services',
      items: [
        { label: 'Free Shipping', href: '/#comingsoon' },
        { label: 'Free Returns', href: '/#comingsoon' },
        { label: 'Franchise Opportunities', href: '/#comingsoon' },
        { label: 'Terms & Conditions', href: '/#comingsoon' },
        { label: 'Customer Support', href: '/#comingsoon' },
      ],
    },
    {
      title: 'Information',
      items: [
        { label: 'Payment Methods', href: '/#comingsoon' },
        { label: 'Shipping Times & Costs', href: '/#comingsoon' },
        { label: 'Product Returns & Exchanges', href: '/#comingsoon' },
        { label: 'Available Shipping Methods', href: '/#comingsoon' },
        { label: 'Product Quality Assurance', href: '/#comingsoon' },
      ],
    },
  ];

  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-8 select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Newsletter form */}
        <div className="border-b border-zinc-900 pb-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display font-semibold uppercase tracking-[0.2em] text-white text-sm sm:text-base mb-4">
              JOIN THE ENDLEZZ DROP CULTURE
            </h3>
            <p className="text-zinc-500 text-xs tracking-wide uppercase mb-6 font-mono leading-relaxed">
              Subscribe to receive early notification on drops, private lookbooks, and exclusive mapuan discounts.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                required
                type="email"
                placeholder="ENTER E-MAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-950 border border-zinc-850 text-white font-mono text-[10px] tracking-widest p-4 uppercase outline-none focus:border-zinc-500 flex-grow"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black font-mono text-[10px] tracking-widest px-6 py-4 uppercase font-bold hover:bg-zinc-250 transition-colors shrink-0 cursor-pointer"
              >
                {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE TO NEWSLETTER'}
              </button>
            </form>
          </div>
        </div>

        {/* Link grids */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-12">
          {footerLinks.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.25em]">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.items.map((item, iIdx) => (
                  <li key={iIdx}>
                    <Link
                      href={item.href}
                      className="text-zinc-500 hover:text-white transition-colors duration-250 text-[10px] uppercase font-mono tracking-wider"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social connections */}
        <div className="border-t border-zinc-900 pt-8 mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/endlezz.market/"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-white flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>instagram</span>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61557565618015"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-white flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest transition-colors"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>facebook</span>
            </a>
            <a
              href="https://www.tiktok.com/@endlezz.market"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-white flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>tiktok</span>
            </a>
          </div>

          <div className="text-center md:text-right text-[10px] font-mono text-zinc-500 leading-relaxed">
            COPYRIGHT © {new Date().getFullYear()} | ENDLEZZ MARKET
            <br />
            ALDEA | DEL CORRO | DE LEON | JERUSALEM | SY
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
