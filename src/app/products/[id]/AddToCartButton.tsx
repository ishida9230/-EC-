"use client";
// カートに追加ボタン + 数量入力
// Server ComponentであるProductDetailPageから分離したClient Component

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  productId: number;
  stockQuantity: number;
};

export default function AddToCartButton({ productId, stockQuantity }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (stockQuantity === 0) {
    return (
      <span className="inline-block px-6 py-3 rounded text-white bg-gray-400">
        在庫なし
      </span>
    );
  }

  const handleAddToCart = async () => {
    setLoading(true);
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    if (res.ok) {
      router.push("/cart");
    } else {
      alert("カートへの追加に失敗しました");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* 数量入力 */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">数量:</label>
        <input
          type="number"
          min={1}
          max={stockQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 border border-gray-300 rounded p-2 text-center"
        />
      </div>

      {/* カートに追加ボタン */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="px-6 py-3 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "追加中..." : "カートに追加"}
      </button>
    </div>
  );
}
