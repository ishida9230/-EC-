// T3: 商品詳細画面 /products/:id
// Server ComponentからはDBを直接参照する（自己fetchは不要）
import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import AddToCartButton from "./AddToCartButton";

type Product = {
  id: number;
  name: string;
  description: string;
  material: string;
  process_type: string;
  price: number;
  supplier_name: string;
  stock_quantity: number;
};

async function getProduct(id: string): Promise<Product | null> {
  const productId = parseInt(id, 10);
  if (isNaN(productId)) return null;

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
  return result.rows[0] || null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="p-8 max-w-xl">
      <Link href="/products" className="text-blue-600 hover:underline text-sm">
        ← 商品一覧に戻る
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">{product.name}</h1>

      <table className="w-full border-collapse border border-gray-300 mb-6">
        <tbody>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-100 text-left w-32">説明</th>
            <td className="border border-gray-300 p-3">{product.description || "—"}</td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-100 text-left">材料</th>
            <td className="border border-gray-300 p-3">{product.material}</td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-100 text-left">加工方法</th>
            <td className="border border-gray-300 p-3">{product.process_type}</td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-100 text-left">価格</th>
            <td className="border border-gray-300 p-3">¥{product.price.toLocaleString()}</td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-100 text-left">在庫</th>
            <td className="border border-gray-300 p-3">
              <span className={product.stock_quantity === 0 ? "text-red-500" : "text-green-600"}>
                {product.stock_quantity}
              </span>
            </td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-100 text-left">サプライヤー</th>
            <td className="border border-gray-300 p-3">{product.supplier_name}</td>
          </tr>
        </tbody>
      </table>

      <AddToCartButton productId={product.id} stockQuantity={product.stock_quantity} />
    </div>
  );
}
