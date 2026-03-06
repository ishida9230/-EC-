// T9: サプライヤー注文一覧画面 /supplier/orders
// DBを直接参照してsupplier_id=1が受けた注文一覧を表示する
import pool from "@/lib/db";

type OrderRow = {
  order_id: number;
  status: string;
  created_at: string;
  customer_name: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

async function getSupplierOrders(): Promise<OrderRow[]> {
  const result = await pool.query(
    `
    SELECT
      o.id AS order_id,
      o.status,
      o.created_at,
      c.name AS customer_name,
      p.name AS product_name,
      oi.price,
      oi.quantity,
      oi.price * oi.quantity AS subtotal
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN customers c ON c.id = o.customer_id
    JOIN products p ON p.id = oi.product_id
    WHERE oi.supplier_id = $1
    ORDER BY o.created_at DESC
    `,
    [1]
  );
  return result.rows;
}

export default async function SupplierOrdersPage() {
  const orders = await getSupplierOrders();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">注文一覧（サプライヤー）</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">注文はまだありません</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left">注文ID</th>
              <th className="border border-gray-300 p-3 text-left">注文日時</th>
              <th className="border border-gray-300 p-3 text-left">顧客名</th>
              <th className="border border-gray-300 p-3 text-left">商品名</th>
              <th className="border border-gray-300 p-3 text-right">単価</th>
              <th className="border border-gray-300 p-3 text-center">数量</th>
              <th className="border border-gray-300 p-3 text-right">小計</th>
              <th className="border border-gray-300 p-3 text-center">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3 text-gray-400">#{row.order_id}</td>
                <td className="border border-gray-300 p-3 text-sm">
                  {new Date(row.created_at).toLocaleString("ja-JP")}
                </td>
                <td className="border border-gray-300 p-3">{row.customer_name}</td>
                <td className="border border-gray-300 p-3">{row.product_name}</td>
                <td className="border border-gray-300 p-3 text-right">¥{row.price.toLocaleString()}</td>
                <td className="border border-gray-300 p-3 text-center">{row.quantity}</td>
                <td className="border border-gray-300 p-3 text-right">¥{Number(row.subtotal).toLocaleString()}</td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                    {row.status === "ordered" ? "注文完了" : row.status}
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
