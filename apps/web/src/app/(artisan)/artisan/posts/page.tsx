"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/AuthContext";
import { fetchApi } from "@/lib/api/client";

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-600",
  sold: "bg-amber-100 text-amber-700",
};

export default function ArtisanPostsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) { router.push("/login?role=artisan"); return; }
    fetchApi(`/artisans/${user.id}/products`)
      .then((r) => r.ok ? r.json() : { products: [] })
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (loading) return <div className="py-20 text-center text-warm-gray">Loading posts...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-navy">My Posts</h1>
          <p className="text-warm-gray text-sm mt-1">{products.length} work{products.length !== 1 ? "s" : ""} listed</p>
        </div>
        <Link
          href="/artisan/products/new"
          className="px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors"
        >
          + List New Work
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <p className="text-warm-gray text-lg mb-4">You haven't listed any works yet.</p>
          <Link href="/artisan/products/new" className="text-navy font-medium hover:text-gold transition-colors">
            List your first work →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                {["Work", "Category", "Price", "Qty", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium tracking-widest text-warm-gray-light uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border-light last:border-0 hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-navy">{p.title}</p>
                    <p className="text-xs text-warm-gray-light">{p.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-warm-gray">{p.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-navy">₹{p.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-warm-gray">{p.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[p.status] || "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/products/${p.id}`} className="text-xs text-navy hover:text-gold transition-colors underline">
                      Preview
                    </Link>
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
