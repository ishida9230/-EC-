-- Seedデータ
-- ローカル開発・学習用の初期データ

-- サプライヤー
INSERT INTO suppliers (name, email) VALUES
  ('山田製作所', 'yamada@example.com'),
  ('鈴木金属工業', 'suzuki@example.com')
ON CONFLICT DO NOTHING;

-- 商品（仕様書のSeedデータ例に準拠）
INSERT INTO products (supplier_id, name, description, material, process_type, price) VALUES
  (1, 'アルミブラケット', 'CNC加工による高精度アルミブラケット', 'アルミ', 'CNC',  500),
  (1, 'ステンレスカバー', '板金加工によるステンレス製カバー',       'SUS',   '板金', 800),
  (2, 'スチールプレート', '汎用スチール製フラットプレート',           'スチール', '切断', 300),
  (2, 'アルミパイプ',     '押出加工によるアルミ丸パイプ',             'アルミ', '押出', 650)
ON CONFLICT DO NOTHING;

-- 在庫（各商品の初期在庫）
INSERT INTO inventories (product_id, stock_quantity) VALUES
  (1, 50),
  (2, 30),
  (3, 100),
  (4, 20)
ON CONFLICT DO NOTHING;

-- 顧客
INSERT INTO customers (name, email) VALUES
  ('田中 太郎', 'tanaka@example.com'),
  ('佐藤 花子', 'sato@example.com')
ON CONFLICT DO NOTHING;
