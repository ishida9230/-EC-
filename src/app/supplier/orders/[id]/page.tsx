// T11: サプライヤー注文詳細画面 /supplier/orders/:id
import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";

type OrderItem = {
  product_name: string;
  material: string;
  process_type: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
};

async function getOrder(id: string): Promise<Order | null> {
  const orderId = parseInt(id, 10);
  if (isNaN(orderId)) return null;

  const orderResult = await pool.query(
    `SELECT o.id, o.status, o.created_at,
            c.name AS customer_name, c.email AS customer_email
     FROM orders o
     JOIN customers c ON c.id = o.customer_id
     WHERE o.id = $1`,
    [orderId]
  );
  if (orderResult.rows.length === 0) return null;

  const itemsResult = await pool.query(
    `SELECT p.name AS product_name, p.material, p.process_type,
            oi.price, oi.quantity, oi.price * oi.quantity AS subtotal
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1 AND oi.supplier_id = $2`,
    [orderId, 1]
  );

  return { ...orderResult.rows[0], items: itemsResult.rows };
}

export default async function SupplierOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const total = order.items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/supplier/orders" className="text-blue-600 hover:underline text-sm">
        ← 注文一覧に戻る
      </Link>

      <div className="flex items-center gap-4 mt-4 mb-4">
        <h1 className="text-2xl font-bold">注文詳細 #{order.id}</h1>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
          {order.status === "ordered" ? "注文完了" : order.status}
        </span>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200 text-sm">
        <p><span className="font-medium">注文日時:</span> {new Date(order.created_at).toLocaleString("ja-JP")}</p>
        <p><span className="font-medium">顧客名:</span> {order.customer_name}</p>
        <p><span className="font-medium">メール:</span> {order.customer_email}</p>
      </div>

      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-3 text-left">商品名</th>
            <th className="border border-gray-300 p-3 text-left">材料</th>
            <th className="border border-gray-300 p-3 text-left">加工方法</th>
            <th className="border border-gray-300 p-3 text-right">単価</th>
            <th className="border border-gray-300 p-3 text-center">数量</th>
            <th className="border border-gray-300 p-3 text-right">小計</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td className="border border-gray-300 p-3">{item.product_name}</td>
              <td className="border border-gray-300 p-3">{item.material || "—"}</td>
              <td className="border border-gray-300 p-3">{item.process_type || "—"}</td>
              <td className="border border-gray-300 p-3 text-right">¥{item.price.toLocaleString()}</td>
              <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
              <td className="border border-gray-300 p-3 text-right">¥{Number(item.subtotal).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-xl font-bold">
        合計: ¥{total.toLocaleString()}
      </div>
    </div>
  );
}
