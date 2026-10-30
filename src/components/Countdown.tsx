'use client';

import React, { useEffect, useState } from 'react';
import { dbService } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';

const Countdown: React.FC = () => {
  const { showNotification } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 7);
    target.setHours(18, 0, 0, 0);
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await dbService.joinWaitlist(email, 'next-drop', 'ALL');
      showNotification("You're on the list. Early access link coming before the drop.");
      setEmail('');
    } catch {
      showNotification("Couldn't add you. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const pad = (n?: number) => (n === undefined ? '--' : String(n).padStart(2, '0'));
  const cells = [
    { v: pad(left?.d), l: 'Days' },
    { v: pad(left?.h), l: 'Hrs' },
    { v: pad(left?.m), l: 'Min' },
    { v: pad(left?.s), l: 'Sec' },
  ];

  return (
    <section className="bg-ink text-paper px-4 sm:px-6 lg:px-10 py-16 sm:py-24" aria-labelledby="next-drop">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 label">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-signal animate-pulse" /> Next drop · Fri 18:00 PHT
        </span>
        <span className="text-paper/60">Angel re-issue · limited run</span>
      </div>

      <h2 id="next-drop" className="sr-only">Next drop countdown</h2>
      <div className="grid grid-cols-4 border-t border-paper/20">
        {cells.map((c, i) => (
          <div key={c.l} className={`pt-4 ${i > 0 ? 'border-l border-paper/20 pl-3 sm:pl-6' : ''}`}>
            <div className="display text-[17vw] lg:text-[12rem] leading-[0.85] tabular-nums">{c.v}</div>
            <div className="label text-paper/60 mt-2">{c.l}</div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-12 grid sm:grid-cols-[1fr_auto] gap-2 max-w-2xl">
        <label htmlFor="drop-email" className="sr-only">Email</label>
        <input
          id="drop-email"
          required
          type="email"
          placeholder="Email for early access"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 bg-transparent border border-paper/30 focus:border-paper px-4 text-sm outline-none placeholder:text-paper/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-12 px-7 bg-paper text-ink text-[13px] font-bold uppercase tracking-wide hover:bg-signal hover:text-white transition-colors disabled:opacity-60"
        >
          {loading ? 'Adding…' : 'Notify me'}
        </button>
      </form>
    </section>
  );
};

export default Countdown;
