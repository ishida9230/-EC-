# Prompt: Implement Feature

<!-- このファイルの役割：
     機能を実装するときに毎回同じ指示を書かなくて済むようにするテンプレート。
     Claudeに「このプロジェクトのルールで実装して」と一言で伝えられる。 -->

Implement a feature following this project's architecture.

## Project Context

- Next.js 14 App Router + TypeScript
- PostgreSQL with raw SQL (no ORM)
- Tailwind CSS for styling

## Architecture Pattern

```
src/app/[page]/page.tsx       ← UI（Server Component or Client Component）
src/app/api/[route]/route.ts  ← API Route Handler
```

## Requirements

- Use TypeScript with proper types
- Avoid N+1 queries (use JOIN)
- No authentication required (out of scope)
- Keep components simple and readable (this is a learning project)
- Follow existing table/column names exactly as defined in memory/project.md

## Feature to Implement

[ここに実装したい機能を記述する]

Example:
- Ticket: T2
- Page: /products
- API: GET /api/products
- Display: 商品名, 価格, 材料, 加工方法, 在庫数
