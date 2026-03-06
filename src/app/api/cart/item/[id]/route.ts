import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// PATCH /api/cart/item/:id — 数量変更
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { quantity } = await req.json();

  if (!quantity || quantity < 1) {
    return NextResponse.json({ error: "数量は1以上を指定してください" }, { status: 400 });
  }

  try {
    await pool.query(
      `UPDATE cart_items SET quantity = $1 WHERE id = $2`,
      [quantity, id]
    );
    return NextResponse.json({ message: "数量を更新しました" });
  } catch (error) {
    console.error("PATCH /api/cart/item/:id エラー:", error);
    return NextResponse.json({ error: "数量の更新に失敗しました" }, { status: 500 });
  }
}

// DELETE /api/cart/item/:id — カートから削除
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await pool.query(`DELETE FROM cart_items WHERE id = $1`, [id]);
    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    console.error("DELETE /api/cart/item/:id エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
