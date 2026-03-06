import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/products/:id
// 商品詳細をサプライヤー情報・在庫情報とともに取得する
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  // 数値でなければ400を返す
  if (isNaN(productId)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

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
        s.name AS supplier_name,
        i.stock_quantity
      FROM products p
      LEFT JOIN suppliers s ON s.id = p.supplier_id
      LEFT JOIN inventories i ON i.product_id = p.id
      WHERE p.id = $1
      `,
      [productId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/products/:id エラー:", error);
    return NextResponse.json(
      { error: "商品詳細の取得に失敗しました" },
      { status: 500 }
    );
  }
}
