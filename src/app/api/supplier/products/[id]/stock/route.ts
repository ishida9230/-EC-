import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// PATCH /api/supplier/products/:id/stock — 在庫数を更新する
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { stock_quantity } = await req.json();

  if (stock_quantity === undefined || stock_quantity < 0) {
    return NextResponse.json({ error: "在庫数は0以上を指定してください" }, { status: 400 });
  }

  try {
    await pool.query(
      `UPDATE inventories SET stock_quantity = $1, updated_at = NOW() WHERE product_id = $2`,
      [stock_quantity, id]
    );
    return NextResponse.json({ message: "在庫を更新しました" });
  } catch (error) {
    console.error("PATCH /api/supplier/products/:id/stock エラー:", error);
    return NextResponse.json({ error: "在庫の更新に失敗しました" }, { status: 500 });
  }
}
