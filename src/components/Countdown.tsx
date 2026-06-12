'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';
import { ShieldCheck, Mail } from 'lucide-react';

const Countdown: React.FC = () => {
  const { showNotification } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate target date: 7 days from current time for demonstration
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(18, 0, 0, 0); // Drop happens at 6:00 PM

    const updateTimer = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Join waitlist for generic next launch (product ID 'next-drop')
      await dbService.joinWaitlist(email, 'next-drop', 'ALL');
      showNotification('Added to private drop waitlist. Early access granted.');
      setEmail('');
    } catch (err) {
      console.error(err);
      showNotification('Failed to join waitlist.');
    } finally {
      setLoading(false);
    }
  };

  const padZero = (n: number) => n.toString().padStart(2, '0');

  const timerItems = [
    { label: 'Days', value: padZero(timeLeft.days) },
    { label: 'Hours', value: padZero(timeLeft.hours) },
    { label: 'Mins', value: padZero(timeLeft.minutes) },
    { label: 'Secs', value: padZero(timeLeft.seconds) },
  ];

  return (
    <section className="bg-zinc-950 border-y border-zinc-900 py-16 px-6 sm:px-12 md:py-24">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 justify-between">
        
        {/* Left Side: Text and Timer */}
        <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-[10px] font-mono font-black text-red-500 uppercase tracking-[0.3em] mb-4 block">
            LIMITED EDITION DROP
          </span>
          <h2 className="text-white text-3xl sm:text-4xl uppercase tracking-wider font-extrabold mb-8">
            ANGEL RE-ARMAMENT
          </h2>
          
          {/* Countdown Clock Grid */}
          <div className="flex gap-4 sm:gap-6">
            {timerItems.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black border border-zinc-900 flex items-center justify-center font-display font-black text-2xl sm:text-3xl text-white tracking-widest shadow-2xl">
                  {item.value}
                </div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 mt-2 block">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Waitlist capture Form */}
        <div className="w-full md:w-[380px] shrink-0 border border-zinc-900 p-6 sm:p-8 bg-zinc-950/50 backdrop-blur-sm shadow-2xl">
          <h3 className="font-display text-white text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-zinc-400" /> REQUEST PRIVATE PASS
          </h3>
          <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider mb-6 leading-relaxed">
            Enter your credentials to secure early access codes and skip the checkout queue. Waitlist caps at 1000 mapuans.
          </p>

          <form onSubmit={handleJoinWaitlist} className="space-y-3">
            <input
              required
              type="email"
              placeholder="ENTER EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border border-zinc-850 text-white font-mono text-[10px] tracking-widest p-4.5 w-full uppercase outline-none focus:border-zinc-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-mono text-[10px] tracking-widest py-4.5 uppercase font-bold hover:bg-zinc-250 transition-colors cursor-pointer"
            >
              {loading ? 'TRANSMITTING...' : 'SECURE EARLY ENTRY'}
            </button>
          </form>

          <div className="flex items-center gap-2 text-zinc-650 text-[9px] font-mono uppercase mt-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted validation queue</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Countdown;
