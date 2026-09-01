"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/client";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  dispatched: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
};

export default function AdminArtisanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [artisan, setArtisan] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"works" | "orders">("works");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artisanRes, productsRes, ordersRes] = await Promise.all([
          fetchApi(`/artisans/${id}`),
          fetchApi(`/artisans/${id}/products`),
          fetchApi(`/orders/`),
        ]);

        let loadedArtisan: any = null;
        if (artisanRes.ok) {
          loadedArtisan = await artisanRes.json();
          setArtisan(loadedArtisan);
        }

        let loadedProducts: any[] = [];
        if (productsRes.ok) {
          const pData = await productsRes.json();
          loadedProducts = pData.products || [];
          setProducts(loadedProducts);
        }

        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          const allOrders = Array.isArray(oData) ? oData : oData.orders || [];
          
          const productIds = new Set(loadedProducts.map((p) => p.id));
          const productTitles = new Set(loadedProducts.map((p) => p.title?.toLowerCase().trim()).filter(Boolean));
          const artisanIdentifiers = new Set([
            id.toLowerCase().trim(),
            loadedArtisan?.id?.toLowerCase().trim(),
            loadedArtisan?.email?.toLowerCase().trim(),
            loadedArtisan?.name?.toLowerCase().trim(),
          ].filter(Boolean));

          const filteredOrders = allOrders.filter((o: any) => {
            const aid = o.artisan_id?.toLowerCase().trim();
            const ptitle = o.product_title?.toLowerCase().trim();
            return (
              (aid && artisanIdentifiers.has(aid)) ||
              (o.product_id && productIds.has(o.product_id)) ||
              (ptitle && productTitles.has(ptitle))
            );
          });

          setOrders(filteredOrders);
        }
      } catch (err) {
        console.error("Failed to load artisan admin detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-warm-gray">Loading artisan detail profile...</div>;
  }

  if (!artisan) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-serif text-2xl text-navy mb-4">Artisan Not Found</h2>
        <Link href="/admin/artisans" className="text-gold underline">Return to Directory</Link>
      </div>
    );
  }

  const confirmedOrders = orders.filter((o) => o.status !== "pending");

  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + (Number(o.price) * Number(o.quantity)), 0);
  const totalCustomersCount = new Set(confirmedOrders.map((o) => o.customer_email || o.customer_name)).size;
  const totalItemsSold = confirmedOrders.reduce((sum, o) => sum + Number(o.quantity), 0);

  // Per-product sales breakdown map (only counting confirmed/sold orders)
  const productSalesMap: Record<string, { soldQty: number; revenue: number }> = {};
  products.forEach((p) => {
    productSalesMap[p.id] = { soldQty: 0, revenue: 0 };
  });
  confirmedOrders.forEach((o) => {
    const pId = o.product_id;
    if (pId && productSalesMap[pId]) {
      const qty = Number(o.quantity) || 1;
      productSalesMap[pId].soldQty += qty;
      productSalesMap[pId].revenue += Number(o.price || 0) * qty;
    }
  });

  return (
    <div className="space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-xs text-warm-gray mb-2">
            <Link href="/admin/artisans" className="hover:text-navy">Artisans Directory</Link>
            <span className="mx-2">/</span>
            <span className="text-navy">{artisan.name}</span>
          </nav>
          <h1 className="font-serif text-3xl text-navy">{artisan.name}</h1>
          <p className="text-warm-gray text-sm mt-1 font-mono">ID: {artisan.id} · {artisan.email}</p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <h2 className="font-serif text-xl text-navy mb-4 border-b border-border-light pb-3">Artisan Sales &amp; Revenue Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div>
            <span className="text-warm-gray-light text-xs uppercase tracking-wider block mb-1">Craft Category</span>
            <span className="px-3 py-1 bg-gold-muted text-navy rounded-full text-xs font-semibold">
              {artisan.craft_category || "Artisan"}
            </span>
          </div>
          <div>
            <span className="text-warm-gray-light text-xs uppercase tracking-wider block mb-1">Location</span>
            <p className="text-navy font-medium">{artisan.location || "Not specified"}</p>
          </div>
          <div>
            <span className="text-warm-gray-light text-xs uppercase tracking-wider block mb-1">Total Units Sold</span>
            <p className="text-navy font-bold text-base">{totalItemsSold} items sold ({totalCustomersCount} buyers)</p>
          </div>
          <div>
            <span className="text-warm-gray-light text-xs uppercase tracking-wider block mb-1">Total Revenue Generated</span>
            <p className="font-serif text-2xl text-navy font-bold">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {artisan.languages && artisan.languages.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border-light text-sm">
            <span className="text-warm-gray-light text-xs uppercase tracking-wider block mb-1">Languages Spoken</span>
            <div className="flex gap-2">
              {artisan.languages.map((l: string) => (
                <span key={l} className="px-2.5 py-0.5 bg-cream text-navy rounded text-xs">
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border flex gap-8">
        <button
          onClick={() => setActiveTab("works")}
          className={`pb-3 font-serif text-lg transition-colors border-b-2 ${
            activeTab === "works" ? "border-navy text-navy font-bold" : "border-transparent text-warm-gray hover:text-navy"
          }`}
        >
          Portfolio Works ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 font-serif text-lg transition-colors border-b-2 ${
            activeTab === "orders" ? "border-navy text-navy font-bold" : "border-transparent text-warm-gray hover:text-navy"
          }`}
        >
          Order &amp; Sales History ({orders.length})
        </button>
      </div>

      {/* Tab 1: Works / Listed Products */}
      {activeTab === "works" && (
        <div>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-10 text-center text-warm-gray">
              No works listed by this artisan yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => {
                const sales = productSalesMap[p.id] || { soldQty: 0, revenue: 0 };
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {p.images ? (
                        <div 
                          className="aspect-video bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
                          style={{ backgroundImage: `url(${p.images.split(',')[0]})` }}
                        />
                      ) : (
                        <div className="aspect-video bg-stone-200 flex items-center justify-center text-warm-gray text-xs">
                          No Image
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cream text-navy">{p.category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                            p.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg text-navy mb-1 group-hover:text-gold transition-colors">{p.title}</h3>
                        <p className="text-sm font-bold text-navy font-mono">₹{p.price.toLocaleString()}</p>
                        
                        <div className="mt-3 pt-3 border-t border-border-light text-xs flex justify-between">
                          <span className="text-warm-gray font-medium">{sales.soldQty} items sold</span>
                          <span className="text-navy font-bold">Revenue: ₹{sales.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 border-t border-border-light flex justify-between items-center text-xs bg-cream/30">
                      <span className="text-warm-gray">{p.quantity} in stock</span>
                      <span className="text-navy font-medium underline group-hover:text-gold transition-colors">
                        Inspect Details &amp; Price →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Order History */}
      {activeTab === "orders" && (
        <div className="space-y-8">
          {/* Per-Product Sales Table */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-serif text-xl text-navy mb-1">Item-Wise Sales &amp; Revenue Breakdown</h3>
            <p className="text-xs text-warm-gray mb-6">Quantity of items sold out and total revenue calculated per work</p>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light bg-cream/30">
                  <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Work Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Unit Price</th>
                  <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">In Stock</th>
                  <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Units Sold Out</th>
                  <th className="text-right px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Calculated Revenue</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const sales = productSalesMap[p.id] || { soldQty: 0, revenue: 0 };
                  return (
                    <tr key={p.id} className="border-b border-border-light last:border-0 hover:bg-cream/40 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-navy">
                        <Link href={`/products/${p.id}`} className="hover:text-gold underline">
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-warm-gray">₹{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-warm-gray">{p.quantity}</td>
                      <td className="px-6 py-4 text-sm font-bold text-navy">{sales.soldQty} sold</td>
                      <td className="px-6 py-4 text-sm font-bold text-navy text-right">₹{sales.revenue.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Customer Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-10 text-center text-warm-gray">
              No orders found for this artisan.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border-light">
                <h3 className="font-serif text-xl text-navy">Customer Orders Stream</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light bg-cream/30">
                    <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Order ID</th>
                    <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Product</th>
                    <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Customer</th>
                    <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Qty</th>
                    <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border-light last:border-0 hover:bg-cream/40 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-warm-gray">{o.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-navy">{o.product_title || o.product_id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-navy font-medium">{o.customer_name}</p>
                        {o.customer_email && <p className="text-xs text-warm-gray-light">{o.customer_email}</p>}
                      </td>
                      <td className="px-6 py-4 text-sm text-warm-gray">{o.quantity}</td>
                      <td className="px-6 py-4 text-sm font-bold text-navy">₹{(o.price * o.quantity).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[o.status] || "bg-gray-100 text-gray-700"}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
