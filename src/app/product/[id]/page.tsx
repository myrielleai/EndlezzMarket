'use client';

import React, { useState, useEffect, use } from 'react';
import { dbService } from '@/lib/supabase';
import { Product, Review } from '@/types';
import { useStore } from '@/context/StoreContext';
import ProductCard, { formatPeso } from '@/components/ProductCard';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetail({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const { addToCart, showNotification } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Selector states
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Waitlist form state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Load product & reviews data
  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      const allProducts = await dbService.getProducts();
      setAllProducts(allProducts);
      const match = allProducts.find((p) => p.id === productId);

      if (match) {
        setProduct(match);
        // Default select first available size
        const firstAvailable = match.sizes.find(s => match.size_stock[s] > 0);
        if (firstAvailable) setSelectedSize(firstAvailable);

        // Fetch reviews
        const prodReviews = await dbService.getReviews(productId);
        setReviews(prodReviews);
      }
      setLoading(false);
    }
    loadProductData();
  }, [productId]);

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    if (product && selectedSize) {
      const stock = product.size_stock[selectedSize] || 0;
      if (val > stock) {
        showNotification(`Only ${stock} items available in size ${selectedSize}.`);
        setQuantity(stock);
        return;
      }
    }
    setQuantity(val);
  };

  const handleAddBag = () => {
    if (!product) return;
    if (!selectedSize) {
      showNotification('Please choose a size.');
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !waitlistEmail || !selectedSize) return;

    setWaitlistLoading(true);
    try {
      await dbService.joinWaitlist(waitlistEmail, product.id, selectedSize);
      showNotification(`Added ${waitlistEmail} to the waitlist for size ${selectedSize}.`);
      setWaitlistEmail('');
    } catch (err) {
      console.error(err);
      showNotification('Failed to join waitlist.');
    } finally {
      setWaitlistLoading(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewName || !reviewText) return;

    setReviewLoading(true);
    try {
      const newReview = await dbService.addReview(product.id, reviewName, reviewRating, reviewText);
      setReviews((prev) => [newReview, ...prev]);
      showNotification('Review submitted. Thank you for your feedback!');
      setReviewName('');
      setReviewText('');
      setReviewRating(5);
    } catch (err) {
      console.error(err);
      showNotification('Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid lg:grid-cols-12 gap-6 px-4 sm:px-6 lg:px-10 py-6 animate-pulse">
        <div className="lg:col-span-7 aspect-[4/5] bg-paper-2" />
        <div className="lg:col-span-5 space-y-4 pt-4">
          <div className="h-12 bg-paper-2 w-3/4" />
          <div className="h-4 bg-paper-2 w-1/4" />
          <div className="h-24 bg-paper-2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-4 py-32 text-center">
        <h1 className="display text-6xl sm:text-8xl">Not found</h1>
        <p className="text-mute mt-4">This piece doesn&apos;t exist or has been archived.</p>
        <Link href="/shop" className="mt-8 inline-flex items-center gap-2 h-12 px-7 bg-ink text-paper text-[13px] font-bold uppercase tracking-wide hover:bg-signal transition-colors">
          Back to shop →
        </Link>
      </div>
    );
  }

  const isSoldOut = product.stock <= 0;
  const stockForSize = product.size_stock[selectedSize] || 0;
  const isSizeSoldOut = stockForSize <= 0;
  const images = [product.image_url, product.image_hover_url].filter(Boolean) as string[];
  const related = allProducts.filter((p) => p.id !== product.id && p.collection === product.collection).concat(
    allProducts.filter((p) => p.id !== product.id && p.collection !== product.collection),
  ).slice(0, 4);
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <nav className="px-4 sm:px-6 lg:px-10 py-4 label text-mute flex items-center gap-2" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>/
        <Link href={`/shop?collection=${product.collection}`} className="hover:text-ink">{product.collection}</Link>/
        <span className="text-ink truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-x-6 gap-y-8 px-4 sm:px-6 lg:px-10 pb-20">
        {/* Gallery: stacked on desktop, swipe on mobile */}
        <div className="lg:col-span-7">
          <div className="flex lg:grid lg:grid-cols-2 gap-2 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 lg:overflow-visible">
            {images.map((src, i) => (
              <div key={src} className="relative shrink-0 w-[85%] sm:w-[60%] lg:w-auto snap-start aspect-[4/5] bg-paper-2 overflow-hidden">
                {i === 0 && product.status && (
                  <span className={`absolute top-3 left-3 z-10 label !text-[10px] px-2 py-1 ${product.status === 'sale' ? 'bg-signal text-white' : 'bg-paper text-ink'}`}>
                    {product.status === 'popular' ? 'Best seller' : product.status}
                  </span>
                )}
                <img src={src} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)] space-y-7">
            <div>
              <p className="label text-mute">{product.collection} collection</p>
              <h1 className="display text-5xl sm:text-6xl xl:text-7xl mt-2">{product.name}</h1>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-mono text-xl">{formatPeso(product.price)}</p>
                {reviews.length > 0 && (
                  <a href="#reviews" className="font-mono text-xs link-u">
                    ★ {avg.toFixed(1)} · {reviews.length} review{reviews.length > 1 ? 's' : ''}
                  </a>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-semibold uppercase tracking-wide">
                  Size{selectedSize && <span className="text-mute font-normal">: {selectedSize}</span>}
                </span>
                <Link href="/#sizechart" className="label link-u">Size guide</Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => {
                  const ok = (product.size_stock[size] || 0) > 0;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      aria-pressed={selectedSize === size}
                      className={`relative h-12 font-mono text-sm border transition-colors ${
                        selectedSize === size
                          ? 'bg-ink text-paper border-ink'
                          : ok
                            ? 'border-line hover:border-ink'
                            : 'border-line text-mute/70'
                      }`}
                    >
                      <span className={ok ? '' : 'line-through'}>{size}</span>
                      {!ok && <span className="absolute bottom-0.5 inset-x-0 text-[8px] tracking-wider">NOTIFY</span>}
                    </button>
                  );
                })}
              </div>
              {!isSizeSoldOut && stockForSize <= 5 && (
                <p className="label text-signal mt-3">Only {stockForSize} left in {selectedSize}</p>
              )}
            </div>

            {!isSizeSoldOut && !isSoldOut ? (
              <div className="flex gap-2">
                <div className="flex items-center border border-line h-14">
                  <button onClick={() => handleQuantityChange(quantity - 1)} className="w-11 h-full hover:bg-paper-2" aria-label="Decrease quantity">−</button>
                  <span className="w-8 text-center font-mono text-sm tabular-nums">{quantity}</span>
                  <button onClick={() => handleQuantityChange(quantity + 1)} className="w-11 h-full hover:bg-paper-2" aria-label="Increase quantity">+</button>
                </div>
                <button
                  onClick={handleAddBag}
                  disabled={!selectedSize}
                  className="flex-1 h-14 bg-ink text-paper text-[13px] font-bold uppercase tracking-wide hover:bg-signal transition-colors flex items-center justify-center gap-2"
                >
                  Add to bag · {formatPeso(product.price * quantity)}
                </button>
              </div>
            ) : (
              <div className="border border-ink p-5 space-y-3">
                <p className="text-[13px] font-bold uppercase tracking-wide">{selectedSize || 'This size'} is sold out</p>
                <p className="text-sm text-mute">Leave your email and we&apos;ll tell you the moment it&apos;s back.</p>
                <form onSubmit={handleJoinWaitlist} className="flex gap-2">
                  <input
                    required
                    type="email"
                    placeholder="you@email.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="flex-1 min-w-0 h-12 px-3 bg-transparent border border-line focus:border-ink outline-none text-sm"
                  />
                  <button type="submit" disabled={waitlistLoading} className="h-12 px-5 bg-ink text-paper text-[13px] font-bold uppercase tracking-wide hover:bg-signal transition-colors">
                    {waitlistLoading ? '…' : 'Notify me'}
                  </button>
                </form>
              </div>
            )}

            <p className="text-ink-2 leading-relaxed">{product.description}</p>

            <div className="border-t border-line">
              {[
                { t: 'Fit', b: 'Boxy, cropped fit with a dropped shoulder. Hem sits near the belt line.' },
                { t: 'Shipping', b: 'Free shipping on orders over ₱2,000 in the Philippines. Ships in 2–4 business days.' },
              ].map((d) => (
                <details key={d.t} className="group border-b border-line">
                  <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-[13px] font-semibold uppercase tracking-wide">
                    {d.t}
                    <span className="font-mono text-lg leading-none transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-4 text-sm text-ink-2 leading-relaxed">{d.b}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-10 py-16 border-t border-line">
          <h2 className="display text-5xl sm:text-6xl mb-8">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 sm:gap-x-3 gap-y-8">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section id="reviews" className="px-4 sm:px-6 lg:px-10 py-16 border-t border-line grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <h2 className="display text-5xl sm:text-6xl">Reviews</h2>
          <p className="font-mono text-sm mt-3">
            {reviews.length ? <>★ {avg.toFixed(1)} <span className="text-mute">from {reviews.length}</span></> : <span className="text-mute">No reviews yet</span>}
          </p>

          <form onSubmit={submitReview} className="mt-8 space-y-3">
            <p className="text-[13px] font-semibold uppercase tracking-wide">Write a review</p>
            <input
              required
              type="text"
              placeholder="Your name"
              aria-label="Your name"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              className="w-full h-12 px-3 bg-transparent border border-line focus:border-ink outline-none text-sm"
            />
            <div className="flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setReviewRating(n)}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  aria-checked={reviewRating === n}
                  role="radio"
                  className={`text-2xl leading-none ${n <= reviewRating ? 'text-ink' : 'text-line'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              required
              rows={4}
              placeholder="How's the fit? The fabric?"
              aria-label="Review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 bg-transparent border border-line focus:border-ink outline-none text-sm resize-none"
            />
            <button type="submit" disabled={reviewLoading} className="w-full h-12 bg-ink text-paper text-[13px] font-bold uppercase tracking-wide hover:bg-signal transition-colors">
              {reviewLoading ? 'Posting…' : 'Post review'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-8">
          {reviews.length === 0 ? (
            <div className="border border-dashed border-line py-16 text-center text-mute">Be the first to review this piece.</div>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {reviews.map((rev) => (
                <li key={rev.id} className="py-6 grid sm:grid-cols-[180px_1fr] gap-3">
                  <div>
                    <p className="text-[13px] font-semibold uppercase">{rev.userName}</p>
                    <p className="label text-mute mt-1">{new Date(rev.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-sm tracking-widest" aria-label={`${rev.rating} out of 5`}>
                      {'★'.repeat(rev.rating)}<span className="text-line">{'★'.repeat(5 - rev.rating)}</span>
                    </p>
                    <p className="mt-2 text-lg leading-snug">{rev.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
