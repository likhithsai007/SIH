"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/AuthContext";
import { fetchApi } from "@/lib/api/client";

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-800 border-green-200",
  draft: "bg-amber-100 text-amber-800 border-amber-200",
  sold: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function ArtisanProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    if (!user?.id) return;
    try {
      const res = await fetchApi(`/artisans/${user.id}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      router.push("/login?role=artisan");
      return;
    }
    loadProducts();
  }, [user, authLoading, router]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this work?")) return;
    setDeletingId(id);
    try {
      const res = await fetchApi(`/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete work");
      }
    } catch {
      alert("Error deleting work");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || authLoading) {
    return <div className="py-20 text-center text-warm-gray">Loading portfolio...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-navy">Portfolio Gallery</h1>
          <p className="text-warm-gray text-sm mt-1">
            All your listed works displayed side-by-side with full descriptions and pricing.
          </p>
        </div>
        <Link
          href="/artisan/products/new"
          className="px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors flex items-center gap-2 shadow-sm"
        >
          <span>+</span> List New Work
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border p-8">
          <svg className="w-16 h-16 text-warm-gray-light mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="font-serif text-xl text-navy mb-2">No Works Listed Yet</h3>
          <p className="text-warm-gray text-sm mb-6 max-w-md mx-auto">
            Start showcasing your craftsmanship by creating your first product listing.
          </p>
          <Link href="/artisan/products/new" className="px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors">
            List Your First Work
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col hover:border-navy/30 transition-all shadow-sm hover:shadow-md"
            >
              {/* Image Preview */}
              <div className="relative aspect-video bg-stone-100 overflow-hidden">
                {p.images ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images.split(",")[0]}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 text-warm-gray-light">
                    <svg className="w-10 h-10 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">No image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${statusColors[p.status] || "bg-gray-100 text-gray-700"}`}>
                    {p.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-warm-gray-light uppercase tracking-wider">
                      {p.category}
                    </span>
                    <span className="text-xs text-warm-gray font-medium">
                      Stock: {p.quantity}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-navy mb-2 line-clamp-1">{p.title}</h3>

                  <p className="text-2xl font-serif text-navy mb-3">
                    ₹{p.price?.toLocaleString()} <span className="text-xs font-sans text-warm-gray-light">{p.currency}</span>
                  </p>

                  {/* Full Description */}
                  {p.description && (
                    <p className="text-sm text-warm-gray line-clamp-3 mb-4 leading-relaxed bg-cream/50 p-3 rounded-lg border border-border/50">
                      {p.description}
                    </p>
                  )}

                  {/* Material Info */}
                  {p.materials && (
                    <p className="text-xs text-warm-gray mb-4">
                      <strong className="font-medium text-navy">Materials:</strong> {p.materials}
                    </p>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-border-light flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${p.id}`}
                    className="px-3 py-1.5 border border-border text-navy hover:bg-cream text-xs font-medium rounded-lg transition-colors"
                  >
                    Preview
                  </Link>

                  <div className="flex gap-2">
                    <Link
                      href={`/artisan/products/new?id=${p.id}`}
                      className="px-3 py-1.5 bg-navy text-white text-xs font-medium rounded-lg hover:bg-navy-light transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      disabled={deletingId === p.id}
                      className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === p.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
