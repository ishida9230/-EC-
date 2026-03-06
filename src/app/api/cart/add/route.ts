import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// POST /api/cart/add
// カートに商品を追加する（既存の場合は数量を加算）
// 認証なしのため customer_id=1 固定
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { product_id, quantity = 1 } = body;

  if (!product_id) {
    return NextResponse.json({ error: "product_id は必須です" }, { status: 400 });
  }

  const customerId = 1; // 認証スコープ外のため固定

  try {
    // customer_id に対応するカートを取得（なければ作成）
    let cartResult = await pool.query(
      `SELECT id FROM carts WHERE customer_id = $1 LIMIT 1`,
      [customerId]
    );

    let cartId: number;
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        `INSERT INTO carts (customer_id) VALUES ($1) RETURNING id`,
        [customerId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // 同じ商品がカートに既にあれば数量を加算、なければ追加
    const existing = await pool.query(
      `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cartId, product_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2`,
        [quantity, existing.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [cartId, product_id, quantity]
      );
    }

    return NextResponse.json({ message: "カートに追加しました" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/cart/add エラー:", error);
    return NextResponse.json(
      { error: "カートへの追加に失敗しました" },
      { status: 500 }
    );
  }
}
