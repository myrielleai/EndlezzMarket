'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const SLIDES = [
  {
    id: 1,
    src: '/img/slider-1.jpg',
    mobile: '/img/min/grid2.jpg',
    title: ['Stay', 'Endlezz'],
    cta: { label: 'Shop now', href: '/shop' },
    pos: 'md:object-[50%_35%]',
  },
  {
    id: 2,
    src: '/img/min/ang3.jpg',
    mobile: '/img/min/ang3.jpg',
    title: ['Piped', 'Linings'],
    cta: { label: 'Shop Angel', href: '/shop?collection=angel' },
    pos: 'md:object-[50%_30%]',
  },
  {
    id: 3,
    src: '/img/slider-2.jpg',
    mobile: '/img/min/min3.jpg',
    title: ['The', 'Rack'],
    cta: { label: 'Shop all colours', href: '/shop' },
    pos: 'md:object-center',
  },
];

const DURATION = 7000;

const HeroSection: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % SLIDES.length), DURATION);
    return () => clearTimeout(t);
  }, [idx, paused]);

  const slide = SLIDES[idx];

  return (
    <section
      className="relative w-full h-[calc(100svh-var(--header-h))] min-h-[520px] max-h-[980px] overflow-hidden bg-paper-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence initial={false}>
        <motion.picture
          key={slide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9 }, scale: { duration: 7, ease: 'linear' } }}
          className="absolute inset-0"
        >
          <source media="(max-width: 767px)" srcSet={slide.mobile} />
          <img src={slide.src} alt="" className={`w-full h-full object-cover object-top ${slide.pos}`} />
        </motion.picture>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent pointer-events-none" />

      <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-10 pb-6 sm:pb-10 text-white">
        <AnimatePresence mode="wait">
          <motion.div key={slide.id} initial="hide" animate="show" exit="hide" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
            <h1 className="display text-[22vw] sm:text-[17vw] lg:text-[13.5vw] leading-[0.8]">
              {slide.title.map((w) => (
                <span key={w} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    variants={{ hide: { y: '100%' }, show: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <Link
            href={slide.cta.href}
            className="inline-flex items-center justify-center gap-3 bg-paper text-ink h-12 px-7 text-[13px] font-bold uppercase tracking-wide hover:bg-signal hover:text-white transition-colors self-start"
          >
            {slide.cta.label} <span aria-hidden>→</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tabular-nums">
              {String(idx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
            <div className="flex gap-1.5">
              {SLIDES.map((s, i) => (
                <button key={s.id} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`} className="relative h-[3px] w-10 sm:w-14 bg-white/35 overflow-hidden">
                  {i === idx && (
                    <motion.span
                      key={`${s.id}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-white"
                      initial={{ width: paused ? '100%' : '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: paused ? 0 : DURATION / 1000, ease: 'linear' }}
                    />
                  )}
                  {i < idx && <span className="absolute inset-0 bg-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
