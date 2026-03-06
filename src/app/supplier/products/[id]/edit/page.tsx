"use client";
// T12: サプライヤー商品編集画面 /supplier/products/:id/edit

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  material: string;
  process_type: string;
  price: number;
  stock_quantity: number;
};

export default function SupplierProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", material: "", process_type: "", price: "",
  });

  useEffect(() => {
    fetch(`/api/supplier/products?supplier_id=1`)
      .then((r) => r.json())
      .then((products: Product[]) => {
        const product = products.find((p) => p.id === Number(params.id));
        if (product) {
          setForm({
            name: product.name,
            description: product.description || "",
            material: product.material || "",
            process_type: product.process_type || "",
            price: String(product.price),
          });
        }
        setLoading(false);
      });
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/supplier/products/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseInt(form.price) }),
    });
    if (res.ok) {
      router.push("/supplier/products");
    } else {
      alert("更新に失敗しました");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("この商品を削除しますか？")) return;
    setDeleting(true);
    const res = await fetch(`/api/supplier/products/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/supplier/products");
    } else {
      alert("削除に失敗しました");
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-8">読み込み中...</div>;

  return (
    <div className="p-8 max-w-lg">
      <Link href="/supplier/products" className="text-blue-600 hover:underline text-sm">
        ← 商品一覧に戻る
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">商品編集</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">商品名 <span className="text-red-500">*</span></label>
          <input type="text" name="name" value={form.name} onChange={handleChange}
            required className="w-full border border-gray-300 rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">説明</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows={3} className="w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">材料</label>
            <input type="text" name="material" value={form.material} onChange={handleChange}
              placeholder="例: アルミ, SUS" className="w-full border border-gray-300 rounded p-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">加工方法</label>
            <input type="text" name="process_type" value={form.process_type} onChange={handleChange}
              placeholder="例: CNC, 板金" className="w-full border border-gray-300 rounded p-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">価格（円） <span className="text-red-500">*</span></label>
          <input type="number" name="price" value={form.price} onChange={handleChange}
            required min={1} className="w-full border border-gray-300 rounded p-2" />
        </div>

        <div className="flex gap-4 mt-2">
          <button type="submit" disabled={saving}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? "保存中..." : "保存する"}
          </button>
          <button type="button" onClick={handleDelete} disabled={deleting}
            className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50">
            {deleting ? "削除中..." : "削除"}
          </button>
        </div>
      </form>
    </div>
  );
}
