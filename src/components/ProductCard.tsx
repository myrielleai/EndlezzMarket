'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, showNotification } = useStore();
  const [hovered, setHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-white text-black';
      case 'sale': return 'bg-zinc-800 text-white border border-zinc-700';
      case 'popular': return 'bg-zinc-900 text-zinc-300';
      case 'sold-out': return 'bg-red-950 text-red-400 border border-red-900';
      default: return 'bg-zinc-900 text-white';
    }
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sizeStock = product.size_stock[size] || 0;
    if (sizeStock <= 0) {
      showNotification(`${product.name} size ${size} is out of stock. Join waitlist!`);
      return;
    }

    addToCart(product, size, 1);
  };

  const isSoldOut = product.stock <= 0;

  return (
    <motion.div
      layoutId={`card-${product.id}`}
      className="group relative flex flex-col h-full bg-zinc-950/30 border border-zinc-950 hover:border-zinc-900 transition-all duration-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 1. Image Area */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-zinc-950 select-none">
        {/* Status Badge */}
        {product.status && (
          <div className={`absolute top-3 left-3 z-20 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold ${getStatusColor(product.status)}`}>
            {product.status}
          </div>
        )}
        
        {/* Main image */}
        <img
          src={product.image_url}
          alt={product.name}
          className={`object-cover w-full h-full transition-transform duration-700 ease-out ${
            hovered && product.image_hover_url ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
          }`}
        />

        {/* Hover image */}
        {product.image_hover_url && (
          <img
            src={product.image_hover_url}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 object-cover w-full h-full transition-all duration-700 ease-out ${
              hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
            }`}
          />
        )}

        {/* Quick add size overlay drawer */}
        <div className={`absolute bottom-0 left-0 w-full z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-black/90 border-t border-zinc-900 backdrop-blur-md py-4 px-4`}>
          <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest text-center mb-2 flex items-center justify-center gap-1.5">
            <ShoppingBag className="w-3 h-3" /> QUICK ADD TO BAG
          </div>
          
          {isSoldOut ? (
            <div className="text-center font-mono text-[10px] text-red-500 tracking-wider uppercase">
              GARMENT SOLD OUT
            </div>
          ) : (
            <div className="flex justify-center gap-2">
              {product.sizes.map((size) => {
                const stock = product.size_stock[size] || 0;
                const available = stock > 0;
                return (
                  <button
                    key={size}
                    onClick={(e) => handleSizeClick(e, size)}
                    disabled={!available}
                    className={`font-mono text-xs w-8 h-8 flex items-center justify-center border transition-all cursor-pointer relative ${
                      available
                        ? 'border-zinc-800 text-zinc-400 hover:bg-white hover:text-black hover:border-white'
                        : 'border-zinc-950 text-zinc-700 cursor-not-allowed line-through'
                    }`}
                    title={available ? `Add size ${size}` : `Size ${size} out of stock`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Link>

      {/* 2. Text Content Area */}
      <div className="py-4 px-1 flex flex-col justify-between flex-grow">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-zinc-500 mb-1 block">
            {product.collection} COLLECTION
          </span>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white hover:text-zinc-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-zinc-900/60 pt-2">
          <span className="font-mono text-xs text-zinc-300">
            Php {product.price.toFixed(2)}
          </span>
          {isSoldOut && (
            <span className="text-[9px] font-mono text-red-500 uppercase tracking-widest">
              WAITLIST OPEN
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
