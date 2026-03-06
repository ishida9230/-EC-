# Project Memory: 建築ECシステム（学習用ミニEC）

<!-- このファイルの役割：
     Claudeにプロジェクトの設計・ルール・知識を覚えさせる。
     これがないとClaudeは毎回コードを一から推測するため、
     設計の一貫性が崩れる。ここに書いた内容はコード生成の前提知識になる。 -->

## プロジェクト概要

製造業調達ECの基本構造を理解するための学習用ミニECシステム。
EC基本構造・在庫管理・マーケットプレイス・製造業モデルを学ぶことが目的。

## 技術スタック

- **Frontend / API**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **DB**: PostgreSQL
- **API方式**: Next.js API Routes (src/app/api/)

## DBスキーマ（8テーブル）

<!-- テーブル構造を記載する理由：
     ClaudeがSQL・API・型定義を生成する際に
     正確なカラム名・型・リレーションを参照するため -->

```
customers     : id, name, email, created_at
suppliers     : id, name, email, created_at
products      : id, supplier_id, name, description, material, process_type, price, created_at
inventories   : id, product_id, stock_quantity, updated_at
carts         : id, customer_id, created_at
cart_items    : id, cart_id, product_id, quantity
orders        : id, customer_id, status(pending/ordered), created_at
order_items   : id, order_id, product_id, supplier_id, price, quantity
```

## APIエンドポイント一覧

<!-- API一覧を記載する理由：
     新しいAPIを追加する際に重複・命名ブレを防ぐため -->

| Method | Path                           | 説明                     |
|--------|--------------------------------|--------------------------|
| GET    | /api/products                  | 商品一覧                  |
| GET    | /api/products/:id               | 商品詳細                  |
| POST   | /api/cart/add                  | カートに商品追加           |
| GET    | /api/cart                      | カート取得                |
| PATCH  | /api/cart/item/:id             | カート商品数量更新         |
| DELETE | /api/cart/item/:id             | カート商品削除             |
| POST   | /api/orders                    | 注文確定（在庫減算含む）    |
| GET    | /api/orders                    | 注文履歴                  |
| GET    | /api/orders/:id                | 注文詳細（未実装）          |
| POST   | /api/supplier/products         | サプライヤー商品登録        |
| GET    | /api/supplier/products          | サプライヤー商品一覧        |
| PATCH  | /api/supplier/products/:id     | サプライヤー商品編集（未実装）|
| DELETE | /api/supplier/products/:id     | サプライヤー商品削除（未実装）|
| GET    | /api/supplier/orders            | サプライヤー注文一覧        |
| GET    | /api/supplier/orders/:id        | サプライヤー注文詳細（未実装）|
| PATCH  | /api/supplier/products/:id/stock| 在庫更新（未実装）         |

## 画面構成

<!-- 画面一覧を記載する理由：
     ページファイルの配置・リンク先のパスをClaudeが把握するため -->

**Customer（顧客）**
- /products           → 商品一覧
- /products/:id       → 商品詳細
- /cart               → カート
- /orders             → 注文履歴
- /orders/:id         → 注文詳細（未実装）

**Supplier（サプライヤー）**
- /supplier/products        → 商品一覧
- /supplier/products/new    → 商品登録
- /supplier/products/:id/edit → 商品編集（未実装）
- /supplier/products/:id/stock → 在庫管理（未実装）
- /supplier/orders           → 注文一覧
- /supplier/orders/:id      → 注文詳細（未実装）

## 重要な設計ルール

<!-- ルールを記載する理由：
     Claudeが複数ファイルにまたがるコードを生成する際に
     アーキテクチャの一貫性を保つため -->

- 在庫減算は注文確定時（POST /api/orders）に行う
  ```sql
  UPDATE inventories SET stock_quantity = stock_quantity - ? WHERE product_id = ?;
  ```
- クエリはN+1を避けてJOINで取得する
- **Server ComponentはDBを直接参照する**（自己fetchは無限ループになるため禁止）
  - ✅ `import pool from "@/lib/db"` してSQLを直接実行
  - ❌ `fetch("http://localhost:3002/api/...")` をServer Component内で呼ぶ
- スコープ外（認証・決済・配送・割引・キャンセル・在庫予約・レビュー）は実装しない
- Seed用商品例：アルミブラケット(500円/CNC)、ステンレスカバー(800円/板金)

## 実装チケット進捗（ユーザーフローベース）

<!-- 進捗を記載する理由：
     どこまで実装済みかをClaudeが把握し、重複実装を防ぐため。
     ユーザーフローベースで整理することで、実装の優先順位と全体像を明確にする。 -->

### 基盤・共通
- [x] T1: DBスキーマ作成（sql/schema.sql, sql/seed.sql, src/lib/db.ts）

### 顧客（Customer）フロー
**目的：商品を探して購入する**

- [x] T2: 商品一覧画面（GET /api/products, /products）
  - 顧客が商品を探す・閲覧する
- [x] T3: 商品詳細画面（GET /api/products/:id, /products/:id）
  - 商品の詳細情報を確認する
- [x] T4: カート画面（GET /api/cart, POST /api/cart/add, PATCH/DELETE /api/cart/item/:id, /cart）
  - カートに商品を追加・編集・削除する
- [x] T5: 注文処理（POST /api/orders, /orders/confirm）
  - カートの内容を注文として確定する（在庫減算含む）
- [x] T6: 注文履歴（GET /api/orders, /orders）
  - 過去の注文一覧を確認する
- [x] T10: 注文詳細画面（GET /api/orders/:id, /orders/:id）
  - 特定の注文の詳細情報を確認する（注文ID、商品一覧、数量、価格、ステータスなど）

### サプライヤー（Supplier）フロー
**目的：商品を登録・管理し、注文を確認する**

- [x] T7: サプライヤー商品登録（POST /api/supplier/products, /supplier/products/new）
  - 新規商品を登録する（商品名、説明、材料、加工方法、価格、初期在庫数）
- [x] T8: サプライヤー商品一覧（GET /api/supplier/products, /supplier/products）
  - 登録した商品一覧を確認する
- [x] T9: サプライヤー注文一覧（GET /api/supplier/orders, /supplier/orders）
  - 自分が登録した商品に対する注文一覧を確認する
- [x] T11: サプライヤー注文詳細（GET /api/supplier/orders/:id, /supplier/orders/:id）
  - 特定の注文の詳細を確認する（顧客情報、商品詳細、数量など）
- [x] T12: 商品編集・削除（PATCH /api/supplier/products/:id, DELETE /api/supplier/products/:id, /supplier/products/:id/edit）
  - 登録した商品の情報を編集・削除する
- [x] T13: 在庫管理（PATCH /api/supplier/products/:id/stock, /supplier/products/:id/stock）
  - 商品の在庫数を更新する（増減操作）

## 実装ルール（ワークフロー）

<!-- このルールを記載する理由：
     Claudeが勝手に次のチケットへ進まないようにするため -->

- 1チケット実装完了ごとに必ずSTOPしてユーザーの動作確認を待つ
- 確認OKの連絡を受けてから次のチケットへ進む
- commit → push → main merge → 新ブランチ作成 の順番を守る
