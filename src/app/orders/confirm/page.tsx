"use client";
// T5: 注文確定画面 /orders/confirm
// カート内容を表示して注文確定ボタンを押すと POST /api/orders を呼ぶ

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CartItem = {
  cart_item_id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function OrderConfirmPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart?customer_id=1")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); });
  }, []);

  const handleOrder = async () => {
    setOrdering(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: 1 }),
    });

    if (res.ok) {
      router.push("/orders");
    } else {
      const data = await res.json();
      alert(data.error || "注文に失敗しました");
      setOrdering(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div className="p-8">読み込み中...</div>;

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">注文確認</h1>

      {items.length === 0 ? (
        <div>
          <p className="text-gray-500 mb-4">カートが空です</p>
          <Link href="/products" className="text-blue-600 hover:underline">商品一覧へ</Link>
        </div>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-3 text-left">商品名</th>
                <th className="border border-gray-300 p-3 text-right">単価</th>
                <th className="border border-gray-300 p-3 text-center">数量</th>
                <th className="border border-gray-300 p-3 text-right">小計</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.cart_item_id}>
                  <td className="border border-gray-300 p-3">{item.name}</td>
                  <td className="border border-gray-300 p-3 text-right">¥{item.price.toLocaleString()}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 p-3 text-right">¥{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right text-xl font-bold mb-6">
            合計: ¥{total.toLocaleString()}
          </div>

          <div className="flex gap-4">
            <Link href="/cart" className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50">
              カートに戻る
            </Link>
            <button
              onClick={handleOrder}
              disabled={ordering}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {ordering ? "処理中..." : "注文を確定する"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
