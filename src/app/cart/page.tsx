"use client";
// T4: カート画面 /cart
// カート内容表示・数量変更・削除・注文確定ボタン

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  cart_item_id: number;
  product_id: number;
  name: string;
  material: string;
  process_type: string;
  price: number;
  quantity: number;
  stock_quantity: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // カート取得
  const fetchCart = async () => {
    const res = await fetch("/api/cart?customer_id=1");
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 商品削除
  const handleDelete = async (cartItemId: number) => {
    await fetch(`/api/cart/item/${cartItemId}`, { method: "DELETE" });
    fetchCart();
  };

  // 数量変更
  const handleQuantityChange = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    await fetch(`/api/cart/item/${cartItemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div className="p-8">読み込み中...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">カート</h1>

      {items.length === 0 ? (
        <div>
          <p className="text-gray-500 mb-4">カートに商品がありません</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            商品一覧へ
          </Link>
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
                <th className="border border-gray-300 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.cart_item_id}>
                  <td className="border border-gray-300 p-3">{item.name}</td>
                  <td className="border border-gray-300 p-3 text-right">
                    ¥{item.price.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        ＋
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-3 text-right">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <button
                      onClick={() => handleDelete(item.cart_item_id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right text-xl font-bold mb-6">
            合計: ¥{total.toLocaleString()}
          </div>

          {/* 注文確定ボタン（T5で機能実装） */}
          <Link
            href="/orders/confirm"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            注文確定へ
          </Link>
        </>
      )}
    </div>
  );
}
