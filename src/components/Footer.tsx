'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useStore();

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await dbService.subscribeNewsletter(email);
      showNotification('Subscribed. See you at the next drop.');
      setEmail('');
    } catch {
      showNotification('Subscription failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const cols = [
    {
      title: 'Shop',
      items: [
        { label: 'All pieces', href: '/shop' },
        { label: 'Grid', href: '/shop?collection=grid' },
        { label: 'Minimalist', href: '/shop?collection=minimalist' },
        { label: 'Angel', href: '/shop?collection=angel' },
      ],
    },
    {
      title: 'Help',
      items: [
        { label: 'Size guide', href: '/#sizechart' },
        { label: 'Contact (DM us)', href: 'https://www.instagram.com/endlezz.market/' },
      ],
    },
    {
      title: 'Endlezz',
      items: [
        { label: 'About', href: '/#about' },
        { label: 'Lookbook', href: '/lookbook' },
      ],
    },
    {
      title: 'Follow',
      items: [
        { label: 'Instagram', href: 'https://www.instagram.com/endlezz.market/' },
        { label: 'TikTok', href: 'https://www.tiktok.com/@endlezz.market' },
        { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61557565618015' },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-ink text-paper mt-auto">
      {/* Newsletter */}
      <div className="px-4 sm:px-6 lg:px-10 pt-16 sm:pt-20 pb-14 grid lg:grid-cols-2 gap-10 border-b border-paper/15">
        <div>
          <h3 className="display text-5xl sm:text-7xl">Join the list</h3>
          <p className="text-paper/70 mt-4 max-w-md">
            Drop dates 24 hours early, restocks, and the occasional lookbook. No spam.
          </p>
        </div>
        <form onSubmit={subscribe} className="self-end">
          <label htmlFor="footer-email" className="label text-paper/60 block mb-3">Email address</label>
          <div className="flex border-b-2 border-paper focus-within:border-signal transition-colors">
            <input
              id="footer-email"
              required
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent h-14 text-xl sm:text-2xl outline-none placeholder:text-paper/30 min-w-0"
            />
            <button type="submit" disabled={loading} className="text-[13px] font-bold uppercase tracking-wide px-2 hover:text-signal transition-colors">
              {loading ? '…' : 'Subscribe →'}
            </button>
          </div>
        </form>
      </div>

      {/* Links */}
      <div className="px-4 sm:px-6 lg:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="label text-paper/50 mb-4">{c.title}</h4>
            <ul className="space-y-2.5">
              {c.items.map((i) => (
                <li key={i.label}>
                  {i.href.startsWith('http') || i.href.startsWith('mailto') ? (
                    <a href={i.href} target={i.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-sm link-u">
                      {i.label}
                    </a>
                  ) : (
                    <Link href={i.href} className="text-sm link-u">{i.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Wordmark */}
      <div className="px-2 sm:px-4 overflow-hidden" aria-hidden>
        <div className="display text-[33vw] leading-[0.78] tracking-[-0.02em] text-center select-none">ENDLEZZ</div>
      </div>

      <div className="px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row justify-between gap-3 label text-paper/50 border-t border-paper/15">
        <span>Concept store — designed &amp; built by Myrielle Jerusalem</span>
        <span>© {new Date().getFullYear()} Endlezz · Not a live shop, nothing is for sale</span>
      </div>
    </footer>
  );
};

export default Footer;
