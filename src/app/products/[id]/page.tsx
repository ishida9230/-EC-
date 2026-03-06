// T3: 商品詳細画面 /products/:id
import Link from "next/link";
import { notFound } from "next/navigation";

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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products/${id}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
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

      {/* カートに追加ボタン（T4で機能実装） */}
      <Link
        href={`/cart?add=${product.id}`}
        className={`inline-block px-6 py-3 rounded text-white ${
          product.stock_quantity === 0
            ? "bg-gray-400 pointer-events-none"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {product.stock_quantity === 0 ? "在庫なし" : "カートに追加"}
      </Link>
    </div>
  );
}
