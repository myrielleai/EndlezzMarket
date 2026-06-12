'use client';

import React from 'react';
import { ATHLETE_FEATURES, TRANSFORMATION_STORIES } from '@/data/cms';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Heart } from 'lucide-react';

const BrandStory: React.FC = () => {
  return (
    <section className="bg-black py-20 px-6 sm:px-12 select-none" id="about">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Behind The Brand Core Identity */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 block">
            BEHIND THE BRAND
          </span>
          <h2 className="text-white text-4xl sm:text-5xl uppercase tracking-widest font-extrabold mb-6">
            DISCIPLINE • SILENCE • RESILIENCE
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans tracking-wide uppercase leading-relaxed font-light">
            Endlezz is not a fashion brand; it is a mindset draft. We engineer structured, minimal silhouettes for those who build their strength in silence, embrace the grinding consistency of discipline, and carry the mental armor of absolute resilience.
          </p>
        </div>

        {/* 2. Athlete Feature Grid */}
        <div className="border-t border-zinc-900 pt-16 mb-24">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-[0.2em]">ATHLETES & DRIVERS</span>
              <h3 className="text-white text-xl sm:text-2xl uppercase tracking-wider font-extrabold mt-1">
                FEATURED GRINDERS
              </h3>
            </div>
            <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mt-2 md:mt-0">
              MEET THE INDIVIDUALS WEARING OUR STORY
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {ATHLETE_FEATURES.map((athlete) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-12 border border-zinc-900 bg-zinc-950/20 shadow-2xl"
              >
                {/* Image */}
                <div className="md:col-span-5 aspect-[4/5] bg-zinc-950 relative overflow-hidden">
                  <img
                    src={athlete.imageUrl}
                    alt={athlete.name}
                    className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3 py-1 border border-zinc-900 text-[8px] font-mono uppercase tracking-widest text-zinc-400">
                    {athlete.discipline}
                  </div>
                </div>

                {/* Info Text */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-white text-base font-bold uppercase tracking-wider">
                      {athlete.name}
                    </h4>
                    <div className="text-zinc-500 font-mono text-[10px] uppercase leading-relaxed italic border-l border-zinc-800 pl-3">
                      &ldquo;{athlete.quote}&rdquo;
                    </div>
                    <p className="text-zinc-600 text-xs leading-relaxed font-sans font-light uppercase">
                      {athlete.story}
                    </p>
                  </div>
                  <div className="border-t border-zinc-900/60 pt-4 mt-6 flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>CO-ENGINEERED FIT</span>
                    <span>ACTIVE AMBASSADOR</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Transformation Stories (Social Proof) */}
        <div className="border-t border-zinc-900 pt-16 mb-24" id="community">
          <div className="text-center mb-12">
            <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-[0.25em]">COMMUNITY JOURNEY</span>
            <h3 className="text-white text-2xl uppercase tracking-wider font-extrabold mt-1">
              TRANSFORMATION DIARIES
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRANSFORMATION_STORIES.map((story) => (
              <div
                key={story.id}
                className="border border-zinc-900 bg-zinc-950/40 p-8 flex flex-col justify-between gap-6 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Quote className="w-5 h-5 text-zinc-700" />
                    <div className="text-yellow-500 text-xs">
                      {'★'.repeat(story.rating)}
                    </div>
                  </div>
                  <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
                    {story.title}
                  </h4>
                  <p className="text-zinc-500 text-xs font-sans font-light uppercase leading-relaxed">
                    {story.content}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-900 pt-4 text-[9px] font-mono text-zinc-550 uppercase tracking-widest">
                  <span>Author: {story.author}</span>
                  <span className="flex items-center gap-1.5"><Heart className="w-3 h-3 text-red-950 fill-red-950" /> VERIFIED GRINDER</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Instagram / TikTok Brutalist Layout */}
        <div className="border-t border-zinc-900 pt-16" id="social">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div>
              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-[0.2em]">INSTAGRAM & TIKTOK</span>
              <h3 className="text-white text-xl sm:text-2xl uppercase tracking-wider font-extrabold mt-1">
                LIFESTYLE FEED
              </h3>
            </div>
            <a
              href="https://www.instagram.com/endlezz.market/"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-zinc-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-colors border border-zinc-800 px-4 py-2 hover:bg-zinc-900/40 mt-4 sm:mt-0"
            >
              <Sparkles className="w-3.5 h-3.5" /> CONNECT WITH THE MOVEMENT
            </a>
          </div>

          {/* Symmetrical Brutalist Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/img/other/img2.JPG', tag: '@endlezz.market', label: 'GRID LOOK' },
              { src: '/img/other/img3.JPG', tag: '@sofia.a', label: 'ANGEL MOVEMENT' },
              { src: '/img/other/img7.jpeg', tag: '@karl.j', label: 'RAW GRIND' },
              { src: '/img/other/img4.JPG', tag: '@endlezz.fits', label: 'STREET STYLE' }
            ].map((feed, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden bg-zinc-950 border border-zinc-900"
              >
                <img
                  src={feed.src}
                  alt={feed.label}
                  className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                {/* Feed Info Overlays */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-20">
                  <span className="text-[9px] font-mono text-white tracking-widest uppercase">
                    {feed.label}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-white font-black tracking-wider">
                      {feed.tag}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
                      Click to view post
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default BrandStory;
