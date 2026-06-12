'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    type: 'video',
    src: '/img/vid2.mov',
    fallbackSrc: '/img/slider-1.jpg',
    title: 'STAY',
    accent: 'ENDLEZZ',
    subtitle: 'THE UNIFORM OF SILENT DISCIPLINE',
  },
  {
    id: 2,
    type: 'image',
    src: '/img/slider-2.jpg',
    title: 'FASHION',
    accent: 'STORIES',
    subtitle: 'WEAR YOUR PHYSICAL TRANSFORMATION',
  },
  {
    id: 3,
    type: 'image',
    src: '/img/slider-3.jpg',
    title: 'RAW',
    accent: 'RESILIENCE',
    subtitle: 'ENGINEERED TO REMAIN STRUCTURED',
  },
];

const HeroSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
    }, 8000); // Fades every 8 seconds
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentIdx];

  const handleScrollDown = () => {
    const target = document.getElementById('overview');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[calc(100vh-104px)] bg-black overflow-hidden flex items-center justify-center select-none">
      {/* Background loop filters */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70 z-10" />
      <div className="absolute inset-0 bg-noise z-10" />

      {/* Slider Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {slide.type === 'video' ? (
            <video
              src={slide.src}
              poster={slide.fallbackSrc}
              autoPlay
              muted
              loop
              playsInline
              className="object-cover w-full h-full scale-[1.03]"
            />
          ) : (
            <img
              src={slide.src}
              alt={slide.title}
              className="object-cover w-full h-full scale-[1.03] animate-pulse-slow"
              style={{ animationDuration: '20s' }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Text Content Grid */}
      <div className="relative z-20 text-center max-w-5xl px-6 flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="flex flex-col items-center"
          >
            {/* Subtitle Mono Label */}
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
              }}
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-400 mb-6 bg-black/40 px-3 py-1 backdrop-blur-sm border border-zinc-900/60"
            >
              {slide.subtitle}
            </motion.span>

            {/* Main Title Heading */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-white text-5xl sm:text-7xl md:text-9xl font-extrabold uppercase tracking-tight leading-none mb-2"
            >
              {slide.title}
            </motion.h1>

            {/* Accent Highlighted Word */}
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-zinc-400 font-sans italic tracking-widest text-4xl sm:text-6xl md:text-8xl font-black uppercase"
            >
              {slide.accent}
            </motion.h2>

            {/* CTA Shop Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } },
              }}
              className="flex items-center gap-4 mt-10"
            >
              <button
                onClick={handleScrollDown}
                className="bg-white text-black font-mono text-[10px] tracking-widest uppercase px-8 py-4 font-bold border border-white hover:bg-transparent hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-2xl"
              >
                EXPLORE COLLECTION
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIdx(idx)}
            className={`h-1.5 transition-all duration-305 ${
              idx === currentIdx ? 'w-8 bg-white' : 'w-2 bg-zinc-800 hover:bg-zinc-650'
            }`}
          />
        ))}
      </div>

      {/* Down indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-6 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors duration-300"
      >
        <span className="text-[9px] font-mono tracking-widest vertical-text uppercase">SCROLL</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>

      {/* CSS layout style for vertical scroll word */}
      <style jsx global>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
