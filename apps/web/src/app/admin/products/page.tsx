"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api/client";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisanMap, setArtisanMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    Promise.all([fetchApi("/products/"), fetchApi("/artisans/")])
      .then(async ([pRes, aRes]) => {
        const pData = pRes.ok ? await pRes.json() : { products: [] };
        const aData = aRes.ok ? await aRes.json() : [];

        const prods = pData.products || [];
        const artisansList = Array.isArray(aData) ? aData : [];

        const map: Record<string, string> = {};
        artisansList.forEach((a: any) => {
          if (a.id) map[a.id.toLowerCase()] = a.name;
          if (a.email) map[a.email.toLowerCase()] = a.name;
          if (a.name) map[a.name.toLowerCase()] = a.name;
        });

        setArtisanMap(map);
        setProducts(prods);
      })
      .catch(() => {
        setProducts([]);
        setArtisanMap({});
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  const filteredProducts = filterCategory === "all" 
    ? products 
    : products.filter((p) => p.category === filterCategory);

  if (loading) {
    return <div className="py-20 text-center text-warm-gray">Loading products catalog...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-navy">All Platform Products</h1>
          <p className="text-warm-gray text-sm mt-1">
            Inspector View: Browse all listed works across all artisans. Click any work to inspect detailed specifications &amp; artisan.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-warm-gray uppercase tracking-widest block">Total Works</span>
          <span className="font-serif text-2xl text-navy font-bold">{products.length}</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filterCategory === "all" ? "bg-navy text-white" : "bg-cream text-warm-gray hover:text-navy"
          }`}
        >
          All Categories ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterCategory === cat ? "bg-navy text-white" : "bg-cream text-warm-gray hover:text-navy"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center text-warm-gray">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Product Image */}
                {p.images ? (
                  <div 
                    className="aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${p.images.split(',')[0]})` }} 
                  />
                ) : (
                  <div className="aspect-square bg-stone-200 flex items-center justify-center text-warm-gray text-xs">
                    No Image Preview
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-cream text-navy">
                      {p.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                      p.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-navy mb-1 group-hover:text-gold transition-colors line-clamp-1">
                    {p.title}
                  </h3>

                  <p className="text-xs text-warm-gray mb-3 line-clamp-2">
                    {p.description || "No description provided."}
                  </p>

                  <p className="text-lg font-serif font-bold text-navy">
                    ₹{p.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-cream/40 border-t border-border-light flex items-center justify-between text-xs">
                <span className="text-warm-gray truncate">
                  Artisan: <strong className="text-navy">{artisanMap[p.artisan_id?.toLowerCase()] || p.artisan_id}</strong>
                </span>
                <span className="text-navy font-medium underline group-hover:text-gold transition-colors shrink-0">
                  Inspect Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
