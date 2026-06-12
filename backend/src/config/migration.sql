-- SAFRAN Menu Database Schema
-- Run this in Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'mangal',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'SAFRAN',
  description TEXT DEFAULT 'Milliy Taomlar Restorani',
  phone TEXT DEFAULT '+998901234567',
  telegram TEXT DEFAULT 'safran_restaurant',
  address TEXT DEFAULT 'Toshkent sh., Amir Temur ko''chasi, 100',
  logo TEXT DEFAULT '/logo.svg',
  favicon TEXT DEFAULT '/favicon.svg',
  social JSONB DEFAULT '{"instagram": "", "telegram": "https://t.me/safran_restaurant"}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public access policies
CREATE POLICY "Public can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

-- Admin access (using service_role key on backend)
CREATE POLICY "Service role can manage products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage settings"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
