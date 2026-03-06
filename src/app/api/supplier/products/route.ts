import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/supplier/products
// サプライヤーの商品一覧を在庫情報とともに取得する
// 認証なしのため supplier_id=1 固定
export async function GET(req: NextRequest) {
  const supplierId = req.nextUrl.searchParams.get("supplier_id") || "1";

  try {
    const result = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.material,
        p.process_type,
        p.price,
        i.stock_quantity
      FROM products p
      LEFT JOIN inventories i ON i.product_id = p.id
      WHERE p.supplier_id = $1
      ORDER BY p.id ASC
      `,
      [supplierId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/supplier/products エラー:", error);
    return NextResponse.json({ error: "商品一覧の取得に失敗しました" }, { status: 500 });
  }
}

// POST /api/supplier/products
// 商品を新規登録し、在庫も同時に作成する
// 認証なしのため supplier_id=1 固定
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, material, process_type, price, stock_quantity } = body;
  const supplierId = body.supplier_id || 1;

  // 必須項目チェック
  if (!name || !price) {
    return NextResponse.json({ error: "商品名と価格は必須です" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // productsに登録
    const productResult = await client.query(
      `INSERT INTO products (supplier_id, name, description, material, process_type, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [supplierId, name, description || null, material || null, process_type || null, price]
    );
    const productId = productResult.rows[0].id;

    // inventoriesに初期在庫を登録
    await client.query(
      `INSERT INTO inventories (product_id, stock_quantity) VALUES ($1, $2)`,
      [productId, stock_quantity || 0]
    );

    await client.query("COMMIT");

    return NextResponse.json({ product_id: productId, message: "商品を登録しました" }, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("POST /api/supplier/products エラー:", error);
    return NextResponse.json({ error: "商品登録に失敗しました" }, { status: 500 });
  } finally {
    client.release();
  }
}
