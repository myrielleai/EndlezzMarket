'use client';

import React, { useState, useEffect, use } from 'react';
import { dbService } from '@/lib/supabase';
import { Product, Review } from '@/types';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Star, Mail, ArrowLeft, Truck, Landmark, ShieldAlert } from 'lucide-react';
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

  // Selector states
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('');

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
      const match = allProducts.find((p) => p.id === productId);

      if (match) {
        setProduct(match);
        setActiveImage(match.image_url);
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
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
          TRANSMITTING GARMENT DESIGN DATA...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 text-center">
        <h2 className="text-white text-lg font-bold uppercase tracking-wider mb-4">Garment Not Found</h2>
        <p className="text-zinc-500 text-xs mb-8 uppercase font-mono">The requested product does not exist in our catalog drops.</p>
        <Link href="/shop" className="border border-zinc-800 px-6 py-3 text-[10px] font-mono tracking-widest uppercase hover:bg-white hover:text-black transition-all">
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  const isSoldOut = product.stock <= 0;
  const currentStockForSelectedSize = product.size_stock[selectedSize] || 0;
  const isSizeSoldOut = currentStockForSelectedSize <= 0;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 select-none">
      
      {/* Back to shop navigation */}
      <div className="mb-8">
        <Link href="/shop" className="text-zinc-500 hover:text-white flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest transition-colors w-fit">
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO GARMENTS
        </Link>
      </div>

      {/* Main product configuration layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        
        {/* Left Side: Images (Grid Layout) */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-4">
          
          {/* Thumbnails list */}
          <div className="col-span-2 flex flex-col gap-3">
            <button
              onClick={() => setActiveImage(product.image_url)}
              className={`aspect-[3/4] border overflow-hidden bg-zinc-950/20 transition-all ${
                activeImage === product.image_url ? 'border-white' : 'border-zinc-900 hover:border-zinc-700'
              }`}
            >
              <img src={product.image_url} alt="Primary" className="object-cover w-full h-full" />
            </button>
            {product.image_hover_url && (
              <button
                onClick={() => setActiveImage(product.image_hover_url!)}
                className={`aspect-[3/4] border overflow-hidden bg-zinc-950/20 transition-all ${
                  activeImage === product.image_hover_url ? 'border-white' : 'border-zinc-900 hover:border-zinc-700'
                }`}
              >
                <img src={product.image_hover_url} alt="Secondary" className="object-cover w-full h-full" />
              </button>
            )}
          </div>

          {/* Big Active Image */}
          <div className="col-span-10 aspect-[3/4] bg-zinc-950 border border-zinc-900 overflow-hidden relative">
            {product.status && (
              <div className="absolute top-4 left-4 bg-white text-black text-[9px] font-mono uppercase px-2.5 py-1 tracking-widest font-black z-10">
                {product.status}
              </div>
            )}
            <img src={activeImage} alt={product.name} className="object-cover w-full h-full hover:scale-103 transition-transform duration-700 ease-out" />
          </div>

        </div>

        {/* Right Side: Product Details & Purchase controls */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Title and price */}
          <div className="border-b border-zinc-900 pb-6 space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
              {product.collection} COLLECTION
            </span>
            <h1 className="text-white text-2xl sm:text-3xl uppercase tracking-wider font-extrabold leading-tight">
              {product.name}
            </h1>
            <div className="text-lg font-mono text-white font-semibold pt-2">
              Php {product.price.toFixed(2)}
            </div>
          </div>

          {/* Product description */}
          <p className="text-zinc-400 text-xs sm:text-sm font-sans uppercase font-light leading-relaxed">
            {product.description}
          </p>

          {/* Sizing Selectors */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              <span>CHOOSE SIZING SYSTEM</span>
              <Link href="/#sizechart" className="text-white hover:underline">SIZE GUIDE</Link>
            </div>
            
            <div className="flex gap-3">
              {product.sizes.map((size) => {
                const stock = product.size_stock[size] || 0;
                const available = stock > 0;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      if (available) {
                        setSelectedSize(size);
                        setQuantity(1);
                      } else {
                        setSelectedSize(size); // Allow selecting sold-out size to join waitlist
                      }
                    }}
                    className={`font-mono text-xs w-10 h-10 flex items-center justify-center border transition-all cursor-pointer relative ${
                      selectedSize === size
                        ? 'bg-white text-black border-white font-black'
                        : available
                          ? 'border-zinc-850 text-zinc-400 hover:border-zinc-500 hover:text-white bg-zinc-950/20'
                          : 'border-zinc-900 text-zinc-700 bg-zinc-950/20 line-through'
                    }`}
                  >
                    {size}
                    {!available && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] text-red-500 font-bold bg-black px-0.5 whitespace-nowrap">
                        WAITLIST
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Purchase Actions (Quantity & Submit) */}
          <div className="space-y-4 pt-2">
            {!isSizeSoldOut && !isSoldOut ? (
              <div className="flex flex-col gap-4">
                {/* Quantity adjustments */}
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">QUANTITY:</span>
                  <div className="flex items-center border border-zinc-850 bg-zinc-950/40">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 text-zinc-500 hover:text-white font-mono text-sm"
                    >
                      -
                    </button>
                    <span className="px-4 font-mono text-xs text-white">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 text-zinc-500 hover:text-white font-mono text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-650 uppercase tracking-widest">
                    ({currentStockForSelectedSize} GARMENTS LEFT IN STOCK)
                  </span>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddBag}
                  disabled={!selectedSize}
                  className="w-full bg-white text-black py-4.5 text-xs font-mono tracking-widest uppercase font-bold hover:bg-zinc-250 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xl"
                >
                  <ShoppingBag className="w-4 h-4" /> ADD TO BAG
                </button>
              </div>
            ) : (
              /* Waitlist submission form if size or product is sold out */
              <div className="border border-zinc-900 p-6 bg-zinc-950/40 space-y-4">
                <h3 className="text-red-500 font-display text-xs uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> SIZE SOLD OUT - REGISTER FOR WAITLIST
                </h3>
                <p className="text-zinc-550 text-[10px] uppercase font-mono tracking-wider leading-relaxed">
                  Enter your email address to join the restock queue for size <span className="text-white font-bold">{selectedSize}</span>. Waitlisted shoppers will get prioritized auto-checkout allocations.
                </p>
                <form onSubmit={handleJoinWaitlist} className="flex gap-2">
                  <input
                    required
                    type="email"
                    placeholder="ENTER E-MAIL ADDRESS"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3 uppercase outline-none focus:border-zinc-500 flex-grow"
                  />
                  <button
                    type="submit"
                    disabled={waitlistLoading}
                    className="bg-white text-black font-mono text-[9px] tracking-widest px-4 py-3 uppercase font-bold hover:bg-zinc-250 transition-colors shrink-0 cursor-pointer"
                  >
                    {waitlistLoading ? 'QUEUEING...' : 'SECURE RESTOCK ENTRY'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Delivery Policy info boxes */}
          <div className="border-t border-zinc-900 pt-6 space-y-3 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-zinc-400" />
              <span>FREE SHIPPING ON DISPATCH OVER PHP 2000</span>
            </div>
            <div className="flex items-center gap-3">
              <Landmark className="w-4 h-4 text-zinc-400" />
              <span>20% DISCOUNT ENABLED FOR MYMAIL MAPUANS</span>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <section className="border-t border-zinc-900 pt-16 max-w-4xl" id="reviews">
        <h3 className="text-white text-lg uppercase tracking-wider font-extrabold mb-8">
          GARMENT REVIEWS ({reviews.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Write a review form */}
          <div className="md:col-span-5 border border-zinc-900 p-6 bg-zinc-950/30">
            <h4 className="font-display text-white text-xs uppercase tracking-widest mb-4">
              SUBMIT A GARMENT FEEDBACK
            </h4>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Name</label>
                <input
                  required
                  type="text"
                  placeholder="ENTER NAME"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3 uppercase outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3 uppercase outline-none focus:border-zinc-500 cursor-pointer"
                >
                  <option value={5}>★★★★★ (5 STARS)</option>
                  <option value={4}>★★★★☆ (4 STARS)</option>
                  <option value={3}>★★★☆☆ (3 STARS)</option>
                  <option value={2}>★★☆☆☆ (2 STARS)</option>
                  <option value={1}>★☆☆☆☆ (1 STAR)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono tracking-widest text-zinc-550 uppercase">Feedback Text</label>
                <textarea
                  required
                  rows={4}
                  placeholder="WRITE TEXT HERE"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="bg-black border border-zinc-850 text-white font-mono text-[9px] tracking-widest p-3 uppercase outline-none focus:border-zinc-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full bg-white text-black font-mono text-[9px] tracking-widest py-3 uppercase font-bold hover:bg-zinc-250 transition-colors cursor-pointer"
              >
                {reviewLoading ? 'SUBMITTING...' : 'SUBMIT TESTIMONIAL'}
              </button>
            </form>
          </div>

          {/* List of reviews */}
          <div className="md:col-span-7 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-zinc-600 uppercase font-mono text-[10px] tracking-widest py-12 border border-zinc-900 border-dashed text-center">
                No reviews yet. Be the first to share your fit review!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-zinc-900 pb-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-xs text-white font-bold uppercase">{rev.userName}</span>
                      <span className="text-yellow-500 text-[10px]">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-2 uppercase font-sans font-light leading-relaxed">
                      {rev.text}
                    </p>
                    <span className="text-[8px] font-mono text-zinc-650 uppercase tracking-widest mt-1 block">
                      Posted on {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
