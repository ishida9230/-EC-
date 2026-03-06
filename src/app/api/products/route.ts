import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/products
// 商品一覧を在庫情報とともに取得する
// N+1を避けるためproductsとinventoriesをJOINして一括取得
export async function GET() {
  try {
    const result = await pool.query(`
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
      ORDER BY p.id ASC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/products エラー:", error);
    return NextResponse.json(
      { error: "商品一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
