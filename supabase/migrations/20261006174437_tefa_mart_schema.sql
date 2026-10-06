/*
# Tefa Mart — Database Schema (Single-tenant, no auth)

## Overview
Creates the full database schema for the Tefa Mart school minimarket app.
All data is shared (single-tenant) since the app does not have a sign-in screen.

## New Tables

1. **products** — Store catalog of items (makanan, minuman, atk, atribut).
   - id (text PK), name, image, price, original_price, unit, category, stock, is_active, created_at

2. **orders** — Student purchase orders.
   - id (text PK), code, total, status (diproses/siap/selesai), pickup_time, created_at

3. **order_items** — Line items for each order.
   - id (uuid PK), order_id (FK → orders), product_id (FK → products), qty

4. **app_state** — Single-row table holding balance and points (shared app state).
   - id (int PK, always 1), balance, points

5. **favorites** — Favorited products.
   - id (uuid PK), product_id (FK → products), created_at

6. **balance_transactions** — History of top-ups and purchases.
   - id (uuid PK), amount, type (topup/purchase), description, created_at

7. **notifications** — In-app notification messages.
   - id (uuid PK), title, body, is_read, created_at

## Security
- RLS enabled on every table.
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because this is a single-tenant app with no sign-in — data is intentionally shared.
*/

-- ─── Products ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  image text NOT NULL DEFAULT '/placeholder.svg',
  price integer NOT NULL DEFAULT 0,
  original_price integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',
  category text NOT NULL DEFAULT 'makanan',
  stock integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
TO anon, authenticated USING (true);

-- ─── Orders ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  code text NOT NULL,
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'diproses',
  pickup_time text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
TO anon, authenticated USING (true);

-- ─── Order Items ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
TO anon, authenticated USING (true);

-- ─── App State (balance + points) ──────────────────────────
CREATE TABLE IF NOT EXISTS app_state (
  id integer PRIMARY KEY DEFAULT 1,
  balance integer NOT NULL DEFAULT 45000,
  points integer NOT NULL DEFAULT 2500,
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_app_state" ON app_state;
CREATE POLICY "anon_select_app_state" ON app_state FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_app_state" ON app_state;
CREATE POLICY "anon_insert_app_state" ON app_state FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_app_state" ON app_state;
CREATE POLICY "anon_update_app_state" ON app_state FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_app_state" ON app_state;
CREATE POLICY "anon_delete_app_state" ON app_state FOR DELETE
TO anon, authenticated USING (true);

-- ─── Favorites ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_favorites" ON favorites;
CREATE POLICY "anon_select_favorites" ON favorites FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_favorites" ON favorites;
CREATE POLICY "anon_insert_favorites" ON favorites FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_favorites" ON favorites;
CREATE POLICY "anon_delete_favorites" ON favorites FOR DELETE
TO anon, authenticated USING (true);

-- ─── Balance Transactions ──────────────────────────────────
CREATE TABLE IF NOT EXISTS balance_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount integer NOT NULL,
  type text NOT NULL DEFAULT 'topup',
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE balance_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_balance_tx" ON balance_transactions;
CREATE POLICY "anon_select_balance_tx" ON balance_transactions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_balance_tx" ON balance_transactions;
CREATE POLICY "anon_insert_balance_tx" ON balance_transactions FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- ─── Notifications ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_notifications" ON notifications;
CREATE POLICY "anon_select_notifications" ON notifications FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_notifications" ON notifications;
CREATE POLICY "anon_insert_notifications" ON notifications FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_notifications" ON notifications;
CREATE POLICY "anon_update_notifications" ON notifications FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_notifications" ON notifications;
CREATE POLICY "anon_delete_notifications" ON notifications FOR DELETE
TO anon, authenticated USING (true);

-- ─── Seed Data ─────────────────────────────────────────────

-- Seed app_state (single row)
INSERT INTO app_state (id, balance, points)
VALUES (1, 45000, 2500)
ON CONFLICT (id) DO NOTHING;

-- Seed products
INSERT INTO products (id, name, image, price, original_price, unit, category, stock) VALUES
  ('air-mineral', 'Air Mineral 600ml', '/images/air-mineral.png', 3000, 4000, 'botol', 'minuman', 50),
  ('mie-cup', 'Mie Instan Cup Rasa Ayam', '/images/mie-cup.png', 5500, 7000, 'cup', 'makanan', 30),
  ('pulpen', 'Pulpen Gel 0.5mm (3 pcs)', '/images/pulpen.png', 7500, 9000, 'pak', 'atk', 25),
  ('roti', 'Roti Isi Cokelat Lumer', '/images/roti.png', 4500, 6000, 'pcs', 'makanan', 40),
  ('susu', 'Susu UHT Cokelat 200ml', '/images/susu.png', 5000, 6500, 'kotak', 'minuman', 35),
  ('buku-tulis', 'Buku Tulis 38 Lembar (5 pcs)', '/images/buku-tulis.png', 15000, 20000, 'pak', 'atk', 15),
  ('keripik', 'Keripik Kentang Original', '/images/keripik.png', 8000, 10000, 'bungkus', 'makanan', 20),
  ('dasi', 'Dasi + Badge OSIS SMA', '/images/dasi.png', 22000, 27500, 'set', 'atribut', 10)
ON CONFLICT (id) DO NOTHING;

-- Seed initial orders
INSERT INTO orders (id, code, total, status, pickup_time, created_at) VALUES
  ('o-3', 'TF-4821', 8500, 'siap', 'Hari ini, 09.45', now() - interval '2 hours'),
  ('o-2', 'TF-3907', 15000, 'selesai', 'Kemarin, 12.10', now() - interval '1 day'),
  ('o-1', 'TF-3554', 14000, 'selesai', 'Senin, 10.05', now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;

-- Seed order items
INSERT INTO order_items (order_id, product_id, qty) VALUES
  ('o-3', 'mie-cup', 1),
  ('o-3', 'air-mineral', 1),
  ('o-2', 'buku-tulis', 1),
  ('o-1', 'roti', 2),
  ('o-1', 'susu', 1)
ON CONFLICT DO NOTHING;

-- Seed notifications
INSERT INTO notifications (title, body, is_read, created_at) VALUES
  ('Pesanan Siap Diambil', 'Pesanan TF-4821 sudah siap diambil di kasir koperasi!', false, now() - interval '30 minutes'),
  ('Promo Istirahat', 'Paket Roti + Susu cuma 10rb, berlaku jam 09.30 - 10.00!', false, now() - interval '3 hours'),
  ('Saldo Bertambah', 'Top up saldo Rp 20.000 berhasil.', true, now() - interval '1 day')
ON CONFLICT DO NOTHING;
