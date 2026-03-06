-- ミニECシステム DBスキーマ
-- T1: テーブル作成

-- 顧客テーブル
-- ECサイトの購入者を管理する
CREATE TABLE IF NOT EXISTS customers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- サプライヤー（出品者）テーブル
-- 商品を登録・販売する業者を管理する
CREATE TABLE IF NOT EXISTS suppliers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 商品テーブル
-- 製造業要素（material, process_type）を含む
CREATE TABLE IF NOT EXISTS products (
  id           SERIAL PRIMARY KEY,
  supplier_id  INTEGER NOT NULL REFERENCES suppliers(id),
  name         VARCHAR(255) NOT NULL,
  description  TEXT,
  material     VARCHAR(100),   -- 素材（例：アルミ, SUS）
  process_type VARCHAR(100),   -- 加工方法（例：CNC, 板金）
  price        INTEGER NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- 在庫テーブル
-- 商品ごとの在庫数を管理する（注文確定時に減算）
CREATE TABLE IF NOT EXISTS inventories (
  id             SERIAL PRIMARY KEY,
  product_id     INTEGER NOT NULL UNIQUE REFERENCES products(id),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- カートテーブル
-- 顧客ごとのカートセッションを管理する
CREATE TABLE IF NOT EXISTS carts (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- カート明細テーブル
-- カートに入っている商品と数量を管理する
CREATE TABLE IF NOT EXISTS cart_items (
  id         SERIAL PRIMARY KEY,
  cart_id    INTEGER NOT NULL REFERENCES carts(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity   INTEGER NOT NULL DEFAULT 1
);

-- 注文テーブル
-- 顧客の注文を管理する（status: pending→ordered）
CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status      VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | ordered
  created_at  TIMESTAMP DEFAULT NOW()
);

-- 注文明細テーブル
-- 注文に含まれる商品・数量・価格を管理する
-- supplier_idも持つことでマーケットプレイス構造を表現する
CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
  price       INTEGER NOT NULL,  -- 注文時の価格を記録（価格変動への対応）
  quantity    INTEGER NOT NULL
);
