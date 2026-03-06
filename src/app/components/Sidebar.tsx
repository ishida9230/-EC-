"use client";
// サイドバーコンポーネント
// /supplier/* → サプライヤーサイドバー
// それ以外     → 顧客サイドバー

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const customerNav: NavItem[] = [
  { label: "商品一覧", href: "/products" },
  { label: "カート", href: "/cart" },
  { label: "注文履歴", href: "/orders" },
];

const supplierNav: NavItem[] = [
  { label: "商品一覧", href: "/supplier/products" },
  { label: "商品登録", href: "/supplier/products/new" },
  { label: "注文一覧", href: "/supplier/orders" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isSupplier = pathname.startsWith("/supplier");

  const nav = isSupplier ? supplierNav : customerNav;
  const role = isSupplier ? "サプライヤー" : "顧客";
  const switchHref = isSupplier ? "/products" : "/supplier/products";
  const switchLabel = isSupplier ? "顧客画面へ" : "サプライヤー画面へ";

  return (
    <aside className="w-52 min-h-screen bg-gray-800 text-white flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-700">
        <p className="text-xs text-gray-400 mb-1">建築ECシステム</p>
        <p className="font-bold text-sm">{role}メニュー</p>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-1">
          {nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded text-sm transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ロール切り替えリンク */}
      <div className="p-4 border-t border-gray-700">
        <Link
          href={switchHref}
          className="block text-center text-xs text-gray-400 hover:text-white transition-colors"
        >
          {switchLabel} →
        </Link>
      </div>
    </aside>
  );
}
