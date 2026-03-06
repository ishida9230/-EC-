import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/supplier/orders/:id
// サプライヤー向け注文詳細（顧客情報・商品明細）
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
    const orderResult = await pool.query(
      `SELECT o.id, o.status, o.created_at,
              c.name AS customer_name, c.email AS customer_email
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       WHERE o.id = $1`,
      [orderId]
    );
    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: "注文が見つかりません" }, { status: 404 });
    }

    const itemsResult = await pool.query(
      `SELECT p.name AS product_name, p.material, p.process_type,
              oi.price, oi.quantity, oi.price * oi.quantity AS subtotal
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1 AND oi.supplier_id = $2`,
      [orderId, 1]
    );

    return NextResponse.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("GET /api/supplier/orders/:id エラー:", error);
    return NextResponse.json({ error: "注文詳細の取得に失敗しました" }, { status: 500 });
  }
}
