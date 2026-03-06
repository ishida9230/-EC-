import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// POST /api/orders
// 注文確定処理：orders作成 → order_items作成 → 在庫減算
// 認証なしのため customer_id=1 固定
export async function POST(req: NextRequest) {
  const body = await req.json();
  const customerId = body.customer_id || 1;

  const client = await pool.connect();

  try {
    // トランザクション開始（在庫減算の整合性を保つため）
    await client.query("BEGIN");

    // カート内容を取得
    const cartResult = await client.query(
      `
      SELECT
        ci.id AS cart_item_id,
        ci.product_id,
        ci.quantity,
        p.price,
        p.supplier_id
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN products p ON p.id = ci.product_id
      WHERE c.customer_id = $1
      `,
      [customerId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "カートが空です" }, { status: 400 });
    }

    // ordersレコード作成
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, status) VALUES ($1, 'ordered') RETURNING id`,
      [customerId]
    );
    const orderId = orderResult.rows[0].id;

    // order_items作成 & 在庫減算（仕様書のSQL例に準拠）
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, supplier_id, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.supplier_id, item.price, item.quantity]
      );

      await client.query(
        `UPDATE inventories
         SET stock_quantity = stock_quantity - $1, updated_at = NOW()
         WHERE product_id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // cart_itemsを削除後、cartsも削除する
    await client.query(
      `DELETE FROM cart_items WHERE cart_id IN (
         SELECT id FROM carts WHERE customer_id = $1
       )`,
      [customerId]
    );
    await client.query(
      `DELETE FROM carts WHERE customer_id = $1`,
      [customerId]
    );

    await client.query("COMMIT");

    return NextResponse.json({ order_id: orderId, message: "注文が確定しました" }, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("POST /api/orders エラー:", error);
    return NextResponse.json({ error: "注文処理に失敗しました" }, { status: 500 });
  } finally {
    client.release();
  }
}

// GET /api/orders
// 注文履歴一覧（T6で使用）
export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get("customer_id") || "1";

  try {
    const result = await pool.query(
      `
      SELECT
        o.id,
        o.status,
        o.created_at,
        SUM(oi.price * oi.quantity) AS total_price
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.customer_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `,
      [customerId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/orders エラー:", error);
    return NextResponse.json({ error: "注文履歴の取得に失敗しました" }, { status: 500 });
  }
}
