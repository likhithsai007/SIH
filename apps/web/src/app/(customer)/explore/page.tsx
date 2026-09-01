"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/ui";
import type { Product } from "@/types";

import { fetchApi } from "@/lib/api/client";
import { useSearchParams } from "next/navigation";

const categoryColors: Record<string, string> = {
  Ceramics: "bg-stone-300",
  Textiles: "bg-amber-200",
  Woodworking: "bg-amber-600",
  Metalwork: "bg-zinc-500",
  Handicrafts: "bg-rose-200",
};

function ExploreContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Works"]);
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Works"
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "All Works")
          params.set("category", selectedCategory);
        if (search) params.set("search", search);

        const res = await fetchApi(`/products/marketplace?${params}`);
        if (res.ok) {
          const data = await res.json();
          let currentProducts: Product[] = [];
          if (data.products) {
            currentProducts = data.products;
          } else if (Array.isArray(data)) {
            currentProducts = data;
          }
          setProducts(currentProducts);
        }

        if (categories.length === 1) {
          const allRes = await fetchApi(`/products/marketplace`);
          if (allRes.ok) {
            const allData = await allRes.json();
            const allProds = allData.products || [];
            const uniqueCats = [
              ...new Set(allProds.map((p: Product) => p.category)),
            ] as string[];
            setCategories(["All Works", ...uniqueCats]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [selectedCategory, search, categories.length]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-navy mb-2">
          Explore Gallery
        </h1>
        <p className="text-warm-gray">
          Discover unique, handcrafted pieces by master artisans.
          <br />
          Filter by discipline or search for specific works.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <SearchInput
          placeholder="Search the gallery..."
          value={search}
          onChange={setSearch}
          className="w-full sm:w-80"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                selectedCategory === cat
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-warm-gray border-border hover:border-navy-light"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <Link href={`/products/${product.id}`} className="block">
              {product.images ? (
                <div
                  className="aspect-[4/5] rounded-xl mb-3 overflow-hidden bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${product.images.split(",")[0]})`,
                  }}
                />
              ) : (
                <div
                  className={`aspect-[4/5] rounded-xl ${
                    categoryColors[product.category] || "bg-stone-200"
                  } flex items-center justify-center mb-3 overflow-hidden`}
                >
                  <div className="text-white/60 text-center p-4">
                    <svg
                      className="w-12 h-12 mx-auto mb-2 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <h3 className="font-serif text-lg text-navy group-hover:text-gold transition-colors">
                {product.title}
              </h3>
            </Link>
            <p className="text-sm text-warm-gray mt-1">
              by{" "}
              <Link
                href={`/artisans/${product.artisan_id}`}
                className="hover:text-navy hover:underline relative z-10"
              >
                {product.artisan_name || product.artisan_id}
              </Link>{" "}
              · {product.category}
            </p>
            <p className="text-sm font-medium text-navy mt-1">
              ₹{product.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-warm-gray text-lg">No products found.</p>
          <p className="text-warm-gray-light text-sm mt-2">
            Try a different search or category.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 border border-navy text-navy rounded-lg text-sm font-medium hover:bg-navy hover:text-white transition-colors">
            LOAD MORE WORKS
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-warm-gray">Loading gallery...</p>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
