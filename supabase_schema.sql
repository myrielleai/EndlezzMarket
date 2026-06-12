-- SQL schema configuration script for EndlezzMarket Supabase Database setup
-- Run this in the Supabase SQL editor console

-- 1. Create Profiles Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  shipping_address JSONB DEFAULT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('new', 'sale', 'popular', 'sold-out')),
  collection TEXT NOT NULL CHECK (collection IN ('grid', 'minimalist', 'angel')),
  image_url TEXT NOT NULL,
  image_hover_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  size_stock JSONB NOT NULL DEFAULT '{}'
);

-- 3. Create Reviews Table
CREATE TABLE public.reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Orders Table
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'delivered')),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Waitlist Table
CREATE TABLE public.waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Newsletter Subscriptions Table
CREATE TABLE public.newsletter (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Configure RLS Policies
-- Products: Read for everyone, Write for admin only
CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to products" ON public.products
  FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.profiles WHERE role = 'admin'));

-- Profiles: Read and update own profile
CREATE POLICY "Allow users to select their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Reviews: Read for everyone, Write for authenticated users (or anyone)
CREATE POLICY "Allow public read access to reviews" ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY "Allow anyone to insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Orders: Read own orders, Write own orders
CREATE POLICY "Allow users to view their own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Allow users to place orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Waitlist & Newsletter: Insert for everyone
CREATE POLICY "Allow public subscription insertions" ON public.newsletter
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public waitlist insertions" ON public.waitlist
  FOR INSERT WITH CHECK (true);
