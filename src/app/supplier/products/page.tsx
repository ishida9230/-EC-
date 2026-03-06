// T8: サプライヤー商品一覧画面 /supplier/products
// DBを直接参照してsupplier_id=1の商品一覧を表示する
import Link from "next/link";
import pool from "@/lib/db";

type Product = {
  id: number;
  name: string;
  material: string;
  process_type: string;
  price: number;
  stock_quantity: number;
};

async function getSupplierProducts(): Promise<Product[]> {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.material,
      p.process_type,
      p.price,
      i.stock_quantity
    FROM products p
    LEFT JOIN inventories i ON i.product_id = p.id
    WHERE p.supplier_id = $1
    ORDER BY p.id ASC
    `,
    [1]
  );
  return result.rows;
}

export default async function SupplierProductsPage() {
  const products = await getSupplierProducts();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">商品一覧（サプライヤー）</h1>
        <Link
          href="/supplier/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + 商品登録
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">登録商品がありません</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left">ID</th>
              <th className="border border-gray-300 p-3 text-left">商品名</th>
              <th className="border border-gray-300 p-3 text-left">材料</th>
              <th className="border border-gray-300 p-3 text-left">加工方法</th>
              <th className="border border-gray-300 p-3 text-right">価格</th>
              <th className="border border-gray-300 p-3 text-right">在庫</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3 text-gray-400">{product.id}</td>
                <td className="border border-gray-300 p-3">{product.name}</td>
                <td className="border border-gray-300 p-3">{product.material || "—"}</td>
                <td className="border border-gray-300 p-3">{product.process_type || "—"}</td>
                <td className="border border-gray-300 p-3 text-right">¥{product.price.toLocaleString()}</td>
                <td className="border border-gray-300 p-3 text-right">
                  <span className={product.stock_quantity === 0 ? "text-red-500" : "text-green-600"}>
                    {product.stock_quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
