// T6: 注文履歴画面 /orders
// DBを直接参照してcustomer_id=1の注文履歴を表示する
import Link from "next/link";
import pool from "@/lib/db";

type Order = {
  id: number;
  status: string;
  created_at: string;
  total_price: number;
};

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

async function getOrders(): Promise<Order[]> {
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
    [1]
  );
  return result.rows;
}

async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const result = await pool.query(
    `
    SELECT
      p.name,
      oi.price,
      oi.quantity
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
    `,
    [orderId]
  );
  return result.rows;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  // 各注文の明細をまとめて取得
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => ({
      ...order,
      items: await getOrderItems(order.id),
    }))
  );

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">注文履歴</h1>

      {ordersWithItems.length === 0 ? (
        <div>
          <p className="text-gray-500 mb-4">注文履歴がありません</p>
          <Link href="/products" className="text-blue-600 hover:underline">商品一覧へ</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {ordersWithItems.map((order) => (
            <div key={order.id} className="border border-gray-300 rounded p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <Link href={`/orders/${order.id}`} className="font-bold text-blue-600 hover:underline">
                    注文 #{order.id}
                  </Link>
                  <span className="ml-3 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString("ja-JP")}
                  </span>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                  {order.status === "ordered" ? "注文完了" : order.status}
                </span>
              </div>

              <table className="w-full border-collapse border border-gray-200 mb-3">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 p-2 text-left text-sm">商品名</th>
                    <th className="border border-gray-200 p-2 text-right text-sm">単価</th>
                    <th className="border border-gray-200 p-2 text-center text-sm">数量</th>
                    <th className="border border-gray-200 p-2 text-right text-sm">小計</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td className="border border-gray-200 p-2 text-sm">{item.name}</td>
                      <td className="border border-gray-200 p-2 text-right text-sm">¥{item.price.toLocaleString()}</td>
                      <td className="border border-gray-200 p-2 text-center text-sm">{item.quantity}</td>
                      <td className="border border-gray-200 p-2 text-right text-sm">¥{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right font-bold">
                合計: ¥{Number(order.total_price).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
