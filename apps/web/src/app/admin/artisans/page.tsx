"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api/client";

export default function AdminArtisansPage() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchApi("/artisans/"), fetchApi("/products/"), fetchApi("/orders/")])
      .then(async ([aRes, pRes, oRes]) => {
        const aData = aRes.ok ? await aRes.json() : [];
        const pData = pRes.ok ? await pRes.json() : [];
        const oData = oRes.ok ? await oRes.json() : [];
        
        let loadedArtisans = Array.isArray(aData) ? aData : [];
        const loadedProducts = Array.isArray(pData) ? pData : pData.products || [];
        const loadedOrders = Array.isArray(oData) ? oData : oData.orders || [];

        // Fallback: Infer artisans from products table if API returns zero artisans
        if (loadedArtisans.length === 0 && loadedProducts.length > 0) {
          const uniqueArtisanIds = Array.from(
            new Set(loadedProducts.map((p: any) => p.artisan_id).filter(Boolean))
          );
          loadedArtisans = uniqueArtisanIds.map((artId: any) => ({
            id: artId,
            name: artId.startsWith("ART") ? `Artisan ${artId}` : artId,
            email: `${String(artId).toLowerCase()}@aesthete.in`,
            craft_category: "Handicrafts",
            location: "India",
            business_type: "Individual Artisan",
            total_revenue: 0,
          }));
        }

        setArtisans(loadedArtisans);
        setProducts(loadedProducts);
        setOrders(loadedOrders);
      })
      .catch(() => {
        setArtisans([]);
        setProducts([]);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-warm-gray">Loading artisans directory...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-navy">Artisans Directory</h1>
          <p className="text-warm-gray text-sm mt-1">
            Inspector View: Monitor registered master artisans, total revenues generated, listed works, and sales.
          </p>
        </div>
      </div>

      {artisans.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center text-warm-gray">
          No registered artisans found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-cream/30">
                <th className="text-left px-6 py-3.5 text-xs font-medium tracking-widest text-warm-gray-light uppercase">
                  Artisan Name
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-medium tracking-widest text-warm-gray-light uppercase">
                  Email / ID
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-medium tracking-widest text-warm-gray-light uppercase">
                  Craft Category
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-medium tracking-widest text-warm-gray-light uppercase">
                  Location
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-medium tracking-widest text-warm-gray-light uppercase">
                  Total Revenue
                </th>
                <th className="text-right px-6 py-3.5 text-xs font-medium tracking-widest text-warm-gray-light uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {artisans.map((a) => {
                const artisanIdentifiers = new Set([
                  a.id?.toLowerCase().trim(),
                  a.email?.toLowerCase().trim(),
                  a.name?.toLowerCase().trim(),
                ].filter(Boolean));

                const artisanProds = products.filter((p) => {
                  const aid = p.artisan_id?.toLowerCase().trim();
                  return aid && artisanIdentifiers.has(aid);
                });

                const productIds = new Set(artisanProds.map((p) => p.id));
                const productTitles = new Set(artisanProds.map((p) => p.title?.toLowerCase().trim()).filter(Boolean));

                const artisanOrders = orders.filter((o) => {
                  const aid = o.artisan_id?.toLowerCase().trim();
                  const ptitle = o.product_title?.toLowerCase().trim();
                  return (
                    (aid && artisanIdentifiers.has(aid)) ||
                    (o.product_id && productIds.has(o.product_id)) ||
                    (ptitle && productTitles.has(ptitle))
                  );
                });

                const artisanRevenue = a.total_revenue > 0 ? a.total_revenue : artisanOrders.reduce(
                  (sum, o) => sum + Number(o.price || 0) * Number(o.quantity || 1),
                  0
                );

                const itemsSold = artisanOrders.reduce(
                  (sum, o) => sum + Number(o.quantity || 1),
                  0
                );

                return (
                  <tr key={a.id} className="border-b border-border-light last:border-0 hover:bg-cream/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold-muted rounded-full flex items-center justify-center font-serif text-navy font-bold">
                          {a.name ? a.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy">{a.name}</p>
                          <p className="text-xs text-warm-gray-light font-mono">{a.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-gray">
                      {a.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gold-muted text-navy rounded-full text-xs font-medium">
                        {a.craft_category || "Artisan"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-gray">
                      {a.location || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-serif text-base font-bold text-navy">₹{artisanRevenue.toLocaleString()}</p>
                      <p className="text-xs text-warm-gray font-medium">{itemsSold} items sold</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/artisans/${a.id}`}
                        className="px-3.5 py-1.5 bg-navy text-white text-xs font-medium rounded-lg hover:bg-navy-light transition-colors inline-block shadow-sm"
                      >
                        View Profile &amp; History →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
