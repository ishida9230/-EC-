"use client";
// T7: サプライヤー商品登録画面 /supplier/products/new

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SupplierProductNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    material: "",
    process_type: "",
    price: "",
    stock_quantity: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/supplier/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseInt(form.price),
        stock_quantity: parseInt(form.stock_quantity) || 0,
      }),
    });

    if (res.ok) {
      router.push("/supplier/products");
    } else {
      const data = await res.json();
      alert(data.error || "登録に失敗しました");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg">
      <Link href="/supplier/products" className="text-blue-600 hover:underline text-sm">
        ← 商品一覧に戻る
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">商品登録</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">商品名 <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">説明</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">材料</label>
            <input
              type="text"
              name="material"
              value={form.material}
              onChange={handleChange}
              placeholder="例: アルミ, SUS"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">加工方法</label>
            <input
              type="text"
              name="process_type"
              value={form.process_type}
              onChange={handleChange}
              placeholder="例: CNC, 板金"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">価格（円） <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min={1}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">初期在庫数</label>
            <input
              type="number"
              name="stock_quantity"
              value={form.stock_quantity}
              onChange={handleChange}
              min={0}
              placeholder="0"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "登録中..." : "登録する"}
        </button>
      </form>
    </div>
  );
}
