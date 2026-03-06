import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/supplier/orders
// サプライヤーが受けた注文一覧を取得する
// 認証なしのため supplier_id=1 固定
export async function GET(req: NextRequest) {
  const supplierId = req.nextUrl.searchParams.get("supplier_id") || "1";

  try {
    const result = await pool.query(
      `
      SELECT
        o.id AS order_id,
        o.status,
        o.created_at,
        c.name AS customer_name,
        p.name AS product_name,
        oi.price,
        oi.quantity,
        oi.price * oi.quantity AS subtotal
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN customers c ON c.id = o.customer_id
      JOIN products p ON p.id = oi.product_id
      WHERE oi.supplier_id = $1
      ORDER BY o.created_at DESC
      `,
      [supplierId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/supplier/orders エラー:", error);
    return NextResponse.json({ error: "注文一覧の取得に失敗しました" }, { status: 500 });
  }
}
