import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/orders/:id
// 注文詳細を注文明細・商品情報とともに取得する
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orderId = parseInt(id, 10);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }

  try {
    // 注文ヘッダー取得
    const orderResult = await pool.query(
      `SELECT o.id, o.status, o.created_at, c.name AS customer_name
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       WHERE o.id = $1`,
      [orderId]
    );
    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: "注文が見つかりません" }, { status: 404 });
    }

    // 注文明細取得
    const itemsResult = await pool.query(
      `SELECT p.name AS product_name, p.material, p.process_type,
              oi.price, oi.quantity, oi.price * oi.quantity AS subtotal
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    return NextResponse.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("GET /api/orders/:id エラー:", error);
    return NextResponse.json({ error: "注文詳細の取得に失敗しました" }, { status: 500 });
  }
}
