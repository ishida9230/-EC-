"use client";
// T13: 在庫管理画面 /supplier/products/:id/stock

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  stock_quantity: number;
};

export default function StockManagePage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [stockInput, setStockInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/supplier/products?supplier_id=1`)
      .then((r) => r.json())
      .then((products: Product[]) => {
        const found = products.find((p) => p.id === Number(params.id));
        if (found) {
          setProduct(found);
          setStockInput(String(found.stock_quantity));
        }
      });
  }, [params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/supplier/products/${params.id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_quantity: parseInt(stockInput) }),
    });
    if (res.ok) {
      router.push("/supplier/products");
    } else {
      alert("在庫の更新に失敗しました");
      setSaving(false);
    }
  };

  if (!product) return <div className="p-8">読み込み中...</div>;

  return (
    <div className="p-8 max-w-sm">
      <Link href="/supplier/products" className="text-blue-600 hover:underline text-sm">
        ← 商品一覧に戻る
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-2">在庫管理</h1>
      <p className="text-gray-600 mb-6">{product.name}</p>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            現在の在庫数: <span className={product.stock_quantity === 0 ? "text-red-500" : "text-green-600"}>
              {product.stock_quantity}
            </span>
          </label>
          <label className="block text-sm font-medium mb-1">新しい在庫数</label>
          <input
            type="number"
            value={stockInput}
            onChange={(e) => setStockInput(e.target.value)}
            min={0}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <button type="submit" disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? "更新中..." : "在庫を更新する"}
        </button>
      </form>
    </div>
  );
}
