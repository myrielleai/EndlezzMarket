'use client';

import React, { useState } from 'react';
import { BLOG_POSTS } from '@/data/cms';
import { BlogPost } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, X, BookOpen } from 'lucide-react';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const activePost = BLOG_POSTS.find((post) => post.slug === activeSlug);

  const filteredPosts = BLOG_POSTS.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 select-none">
      
      {/* Header */}
      <div className="border-b border-zinc-900 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">EDITORIAL WRITINGS</span>
          <h1 className="text-3xl sm:text-5xl uppercase tracking-wider font-extrabold mt-1 text-white">
            THE EDITORIALS
          </h1>
        </div>
        
        {/* Search blogs */}
        <input
          type="text"
          placeholder="SEARCH ARTICLES..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-zinc-950 border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3.5 w-full md:w-80 uppercase outline-none focus:border-zinc-500"
        />
      </div>

      {/* Blogs list */}
      {filteredPosts.length === 0 ? (
        <div className="border border-zinc-900 bg-zinc-950/20 py-24 text-center">
          <h3 className="font-display uppercase tracking-widest text-sm text-zinc-500 mb-2">
            No Articles Found
          </h3>
          <p className="text-zinc-650 text-xs font-mono">No editorial logs match your search parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="border border-zinc-900 bg-zinc-950/20 flex flex-col justify-between hover:border-zinc-800 transition-colors shadow-lg"
            >
              <div>
                {/* Image */}
                <div className="aspect-[16/10] bg-zinc-900 overflow-hidden relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-103"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-md px-2.5 py-1 border border-zinc-900 text-[8px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-zinc-500" /> {post.readTime}
                  </div>
                </div>

                {/* Content info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-mono uppercase">
                    <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-white text-base font-bold uppercase tracking-wider line-clamp-2 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-zinc-500 text-xs font-sans font-light uppercase leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveSlug(post.slug)}
                  className="w-full border border-zinc-850 py-3 text-[9px] font-mono tracking-widest uppercase text-white hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                >
                  READ ARTICLE <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Full Screen Article Reader Overlay */}
      <AnimatePresence>
        {activeSlug && activePost && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSlug(null)}
              className="fixed inset-0 z-[990] bg-black/95 backdrop-blur-md"
            />

            {/* Content pane */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[995] m-auto w-[90%] max-w-3xl h-[85vh] bg-zinc-950 border border-zinc-900 overflow-y-auto"
            >
              {/* Image banner */}
              <div className="w-full h-80 bg-zinc-900 relative">
                <img
                  src={activePost.imageUrl}
                  alt={activePost.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/60" />
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveSlug(null)}
                  className="absolute top-6 right-6 bg-black/70 border border-zinc-800 text-white p-2 hover:rotate-90 transition-transform duration-300"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-8 right-8">
                  <div className="flex items-center gap-4 text-zinc-400 text-[10px] font-mono uppercase tracking-widest mb-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {activePost.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activePost.readTime}</span>
                  </div>
                  <h2 className="text-white text-lg sm:text-2xl font-extrabold uppercase tracking-wider leading-tight">
                    {activePost.title}
                  </h2>
                </div>
              </div>

              {/* Story Content body */}
              <div className="p-8 sm:p-12 space-y-6">
                <div className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans uppercase font-light space-y-4 whitespace-pre-line">
                  {activePost.content}
                </div>
                
                <div className="border-t border-zinc-900 pt-8 flex items-center justify-between text-[10px] font-mono text-zinc-550 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> ENDLEZZ EDITORIAL CAPTURE</span>
                  <span>DISCIPLINE INSPIRED</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
