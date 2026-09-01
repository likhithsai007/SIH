"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/AuthContext";
import { fetchApi } from "@/lib/api/client";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  dispatched: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
};

export default function ArtisanOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      const r = await fetchApi(`/orders/`);
      if (r.ok) {
        const d = await r.json();
        setOrders(Array.isArray(d) ? d : d.orders || []);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) { router.push("/login?role=artisan"); return; }
    fetchOrders();
  }, [user, authLoading, router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetchApi(`/orders/${orderId}/status?status=${newStatus}`, {
        method: "PUT",
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert("Failed to update order status");
      }
    } catch {
      alert("Error updating order status");
    }
  };

  if (loading) return <div className="py-20 text-center text-warm-gray">Loading orders...</div>;

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (Number(o.price || 0) * Number(o.quantity || 1)), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-navy">My Orders</h1>
          <p className="text-warm-gray text-sm mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} received</p>
        </div>
        {orders.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-warm-gray-light uppercase tracking-widest">Total Revenue (Confirmed / Shipped / Delivered)</p>
            <p className="font-serif text-3xl text-navy font-bold">₹{totalRevenue.toLocaleString()}</p>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <p className="text-warm-gray text-lg mb-2">No orders yet.</p>
          <p className="text-warm-gray-light text-sm">Orders will appear here when customers purchase your works.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-cream/30">
                {["Order ID", "Product", "Customer", "Qty", "Amount", "Status (Update)", "Action"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border-light last:border-0 hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-warm-gray-light font-mono">{o.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-navy">{o.product_title || o.product_id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-navy font-medium">{o.customer_name}</p>
                    {o.customer_email && <p className="text-xs text-warm-gray-light">{o.customer_email}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-warm-gray">{o.quantity}</td>
                  <td className="px-6 py-4 text-sm font-medium text-navy">₹{(o.price * o.quantity).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer focus:outline-none transition-all ${
                        statusColors[o.status] || "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {o.product_id && (
                      <a href={`/products/${o.product_id}`} className="text-xs text-navy hover:text-gold transition-colors underline">
                        Preview
                      </a>
                    )}
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
