import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// PATCH /api/supplier/products/:id — 商品編集
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, description, material, process_type, price } = body;

  if (!name || !price) {
    return NextResponse.json({ error: "商品名と価格は必須です" }, { status: 400 });
  }

  try {
    await pool.query(
      `UPDATE products
       SET name=$1, description=$2, material=$3, process_type=$4, price=$5
       WHERE id=$6 AND supplier_id=$7`,
      [name, description || null, material || null, process_type || null, price, id, 1]
    );
    return NextResponse.json({ message: "商品を更新しました" });
  } catch (error) {
    console.error("PATCH /api/supplier/products/:id エラー:", error);
    return NextResponse.json({ error: "商品の更新に失敗しました" }, { status: 500 });
  }
}

// DELETE /api/supplier/products/:id — 商品削除
// inventoriesも合わせて削除する
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM inventories WHERE product_id = $1`, [id]);
    await client.query(`DELETE FROM products WHERE id = $1 AND supplier_id = $2`, [id, 1]);
    await client.query("COMMIT");
    return NextResponse.json({ message: "商品を削除しました" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("DELETE /api/supplier/products/:id エラー:", error);
    return NextResponse.json({ error: "商品の削除に失敗しました" }, { status: 500 });
  } finally {
    client.release();
  }
}
