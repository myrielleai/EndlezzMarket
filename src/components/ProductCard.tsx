'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const formatPeso = (n: number) =>
  `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const BADGE: Record<string, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-paper text-ink' },
  sale: { label: 'Sale', cls: 'bg-signal text-white' },
  popular: { label: 'Best seller', cls: 'bg-ink text-paper' },
  'sold-out': { label: 'Sold out', cls: 'bg-paper text-mute' },
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, showNotification } = useStore();
  const isSoldOut = product.stock <= 0;
  const badge = isSoldOut ? BADGE['sold-out'] : product.status ? BADGE[product.status] : null;

  const quickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    if ((product.size_stock[size] || 0) <= 0) {
      showNotification(`${product.name} in ${size} is sold out`);
      return;
    }
    addToCart(product, size, 1);
  };

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-paper-2"
        aria-label={product.name}
      >
        {badge && (
          <span className={`absolute top-2 left-2 z-10 label !text-[10px] px-2 py-1 ${badge.cls}`}>
            {badge.label}
          </span>
        )}

        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            product.image_hover_url ? 'group-hover:opacity-0' : 'group-hover:scale-[1.03]'
          } ${isSoldOut ? 'grayscale opacity-70' : ''}`}
        />
        {product.image_hover_url && (
          <img
            src={product.image_hover_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-[1.03] group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        )}

        {/* Quick add (desktop hover) */}
        {!isSoldOut && (
          <div className="hidden md:block absolute inset-x-2 bottom-2 z-10 translate-y-[calc(100%+8px)] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="bg-paper/95 backdrop-blur-sm p-2">
              <p className="label !text-[10px] text-mute mb-1.5">Quick add</p>
              <div className="grid grid-cols-4 gap-1">
                {product.sizes.map((size) => {
                  const ok = (product.size_stock[size] || 0) > 0;
                  return (
                    <button
                      key={size}
                      onClick={(e) => quickAdd(e, size)}
                      disabled={!ok}
                      className={`h-8 font-mono text-xs border transition-colors ${
                        ok
                          ? 'border-ink/20 hover:bg-ink hover:text-paper hover:border-ink'
                          : 'border-transparent text-mute/60 line-through cursor-not-allowed'
                      }`}
                      aria-label={ok ? `Add size ${size}` : `Size ${size} sold out`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Link>

      <Link href={`/product/${product.id}`} className="pt-2.5 pb-1 flex flex-col sm:flex-row sm:items-start justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <h3 className="text-[13px] sm:text-sm font-semibold uppercase tracking-tight leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="label !text-[10px] text-mute mt-0.5">{product.collection}</p>
        </div>
        <span className={`font-mono text-xs sm:text-[13px] shrink-0 ${isSoldOut ? 'text-mute line-through' : ''}`}>
          {formatPeso(product.price)}
        </span>
      </Link>
    </article>
  );
};

export default ProductCard;
