'use client';

import React, { useState } from 'react';
import { LOOKBOOK_ITEMS } from '@/data/cms';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

export default function Lookbook() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeItem = LOOKBOOK_ITEMS.find((item) => item.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 select-none">
      
      {/* Header */}
      <div className="border-b border-zinc-900 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">AESTHETIC FOLIO</span>
          <h1 className="text-3xl sm:text-5xl uppercase tracking-wider font-extrabold mt-1 text-white">
            THE LOOKBOOK
          </h1>
        </div>
        <p className="text-zinc-650 text-xs font-mono uppercase tracking-widest max-w-sm">
          A visual archive of structural alignment, silhouettes, and silent streetwear resilience.
        </p>
      </div>

      {/* Lookbook Symmetrical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {LOOKBOOK_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            layoutId={`lookbook-${item.id}`}
            className="group relative border border-zinc-950 hover:border-zinc-900 bg-zinc-950/20 aspect-[4/5] overflow-hidden cursor-pointer"
          >
            {/* Image */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-103"
            />

            {/* Backdrop Blur Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-20">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-mono text-white tracking-[0.2em] uppercase bg-black/50 px-2.5 py-1 border border-zinc-800">
                  {item.collection} Collection
                </span>
                <ZoomIn className="w-5 h-5 text-white p-0.5" />
              </div>

              <div>
                <h3 className="text-white text-base font-extrabold uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-[10px] font-mono uppercase tracking-widest mt-1 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Interactive Zoom Modal */}
      <AnimatePresence>
        {selectedId && activeItem && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-[990] bg-black/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              layoutId={`lookbook-${selectedId}`}
              className="fixed inset-0 z-[995] m-auto w-[90%] max-w-4xl h-fit max-h-[85vh] bg-zinc-950 border border-zinc-900 overflow-hidden flex flex-col md:grid md:grid-cols-12"
            >
              {/* Image Pane */}
              <div className="md:col-span-7 aspect-[4/5] md:aspect-auto bg-zinc-950 relative overflow-hidden flex items-center justify-center">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Text Description Pane */}
              <div className="md:col-span-5 p-8 flex flex-col justify-between bg-zinc-950 text-white relative">
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 hover:rotate-90 transition-transform duration-300"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-6 pt-6">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.25em] block mb-1">
                      {activeItem.collection} Collection
                    </span>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                      {activeItem.title}
                    </h2>
                  </div>
                  
                  <p className="text-zinc-400 text-xs font-sans uppercase font-light leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>

                <div className="border-t border-zinc-900 pt-6 mt-8">
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>DESIGN SPEC 2025</span>
                    <span>STUDIO SHOT</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
