# Claude Instructions

<!-- このファイルの役割：
     ClaudeがプロジェクトのAIアシスタントとして動く際に
     最優先で読む仕様書。ここに書いたルールは常に守られる。
     「毎回同じ説明をしなくていい」状態を作るためのファイル。 -->

You are working on a **学習用ミニECシステム（建築・製造業調達）** built with Next.js + PostgreSQL.

## Absolute Rules

<!-- ルールを明記する理由：
     Claudeはルールを明示しないと「便利な機能」を勝手に追加しがち。
     学習用プロジェクトではスコープ外の実装は混乱を招くため禁止する。 -->

1. **スコープ外は実装しない**: 認証・決済・配送・割引・キャンセル・在庫予約・レビュー
2. **MVPを維持**: 最小構成で動くコードを書く。過剰なabstractionは不要
3. **日本語コメント**: コード内のコメントは日本語で書く（学習目的のため）
4. **型安全**: TypeScriptの型を省略しない

## Tech Stack

<!-- スタックを明記する理由：
     ClaudeがPrisma・tRPC等の「便利なライブラリ」を
     勝手に提案・使用するのを防ぐため -->

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL（`pg`パッケージで直接クエリ）
- **ORM**: 使用しない（生SQLで学習する）

## File Structure

<!-- 構造を明記する理由：
     ファイルをどこに作るべきかClaudeが迷わないようにするため -->

```
src/
  app/
    page.tsx                    # トップページ
    products/
      page.tsx                  # 商品一覧
      [id]/page.tsx             # 商品詳細
    cart/
      page.tsx                  # カート
    orders/
      page.tsx                  # 注文履歴
    supplier/
      products/
        page.tsx                # サプライヤー商品一覧
        new/page.tsx            # 商品登録
      orders/
        page.tsx                # 注文一覧
    api/
      products/
        route.ts
        [id]/route.ts
      cart/
        add/route.ts
        route.ts
      orders/
        route.ts
      supplier/
        products/route.ts
        orders/route.ts
  lib/
    db.ts                       # PostgreSQL接続
```

## DB Design

<!-- DB設計を明記する理由：
     ClaudeがAPIやUIを生成する際に正確なカラム名を使うため。
     typoや存在しないカラムを参照するコードの生成を防ぐ -->

詳細は `.claude/memory/project.md` を参照。

Key points:
- `products`テーブルには`material`と`process_type`カラムがある（製造業要素）
- 在庫は`inventories`テーブルで別管理（product_idで紐付け）
- 注文ステータスは`pending` / `ordered`の2値のみ

## Coding Style

<!-- コーディングスタイルを明記する理由：
     Claudeが生成するコードのスタイルを統一するため。
     レビュー・学習の際に読みやすいコードを保つ -->

- シンプルで読みやすいコードを優先
- エラーハンドリングはtry/catchで、適切なHTTPステータスを返す
- SQLはプレースホルダー（$1, $2...）を使いSQLインジェクションを防ぐ
- N+1クエリを避けてJOINで一括取得する
