"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/AuthContext";
import { fetchApi } from "@/lib/api/client";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
};

export default function CustomerOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?role=customer");
      return;
    }
    fetchApi("/orders/")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setOrders(Array.isArray(d) ? d : d.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return <div className="py-20 text-center text-warm-gray">Loading your orders...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl text-navy">My Orders</h1>
          <p className="text-warm-gray text-sm mt-1">
            Track and trace all your artisan purchases and order statuses.
          </p>
        </div>
        <Link
          href="/explore"
          className="px-4 py-2 border border-border rounded-lg text-sm text-navy hover:bg-cream transition-colors"
        >
          Explore Gallery →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-xl p-8">
          <svg className="w-16 h-16 text-warm-gray-light mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="font-serif text-xl text-navy mb-2">No Orders Placed Yet</h3>
          <p className="text-warm-gray text-sm mb-6 max-w-md mx-auto">
            Discover handcrafted works from independent master artisans.
          </p>
          <Link href="/explore" className="px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-cream/30">
                {["Order ID", "Product", "Artisan", "Qty", "Total Price", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-6 py-3.5 text-xs font-medium tracking-widest text-warm-gray-light uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border-light last:border-0 hover:bg-cream/40 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-warm-gray">{o.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-navy">{o.product_title || o.product_id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-warm-gray">
                    <span className="font-medium text-navy">{o.artisan_id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-warm-gray">{o.quantity}</td>
                  <td className="px-6 py-4 text-sm font-medium text-navy">
                    ₹{(o.price * o.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase border ${statusColors[o.status] || "bg-gray-100 text-gray-700"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-warm-gray">
                    {new Date(o.created_at || Date.now()).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
