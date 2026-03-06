import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/cart
// customer_id=1 固定（認証なしのため）でカート内容を取得する
export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get("customer_id") || "1";

  try {
    const result = await pool.query(
      `
      SELECT
        ci.id AS cart_item_id,
        ci.quantity,
        p.id AS product_id,
        p.name,
        p.material,
        p.process_type,
        p.price,
        i.stock_quantity
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN products p ON p.id = ci.product_id
      LEFT JOIN inventories i ON i.product_id = p.id
      WHERE c.customer_id = $1
      ORDER BY ci.id ASC
      `,
      [customerId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/cart エラー:", error);
    return NextResponse.json(
      { error: "カートの取得に失敗しました" },
      { status: 500 }
    );
  }
}
