// T2: 商品一覧画面 /products
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  material: string;
  process_type: string;
  price: number;
  stock_quantity: number;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">商品一覧</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">商品がありません</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left">商品名</th>
              <th className="border border-gray-300 p-3 text-left">材料</th>
              <th className="border border-gray-300 p-3 text-left">加工方法</th>
              <th className="border border-gray-300 p-3 text-right">価格</th>
              <th className="border border-gray-300 p-3 text-right">在庫</th>
              <th className="border border-gray-300 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">{product.name}</td>
                <td className="border border-gray-300 p-3">{product.material}</td>
                <td className="border border-gray-300 p-3">{product.process_type}</td>
                <td className="border border-gray-300 p-3 text-right">
                  ¥{product.price.toLocaleString()}
                </td>
                <td className="border border-gray-300 p-3 text-right">
                  <span className={product.stock_quantity === 0 ? "text-red-500" : "text-green-600"}>
                    {product.stock_quantity}
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
