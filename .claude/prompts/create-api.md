# Prompt: Create API Endpoint

<!-- このファイルの役割：
     APIを新規作成するときの標準テンプレート。
     セキュリティ・バリデーション・エラーハンドリングを
     毎回指定しなくてもClaudeが考慮してくれるようになる。 -->

Create a REST API endpoint for this project.

## Project Context

- File location: `src/app/api/[route]/route.ts`
- DB: PostgreSQL (use `pg` package, connection via environment variables)
- No authentication (out of scope)

## Include

- Input validation (check required fields)
- Error handling (try/catch, return appropriate HTTP status)
- Avoid N+1 queries (use JOIN where needed)
- TypeScript types for request/response

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/ec_db
```

## API to Create

[ここに作成したいAPIの詳細を記述する]

Example:
- Method: GET
- Path: /api/products
- Description: 商品一覧を在庫情報とともに取得
- Response: { id, name, price, material, process_type, stock_quantity }[]
