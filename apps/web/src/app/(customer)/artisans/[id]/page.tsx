"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api/client";
import type { Product } from "@/types";

export default function ArtisanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [artisan, setArtisan] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const [artisanRes, productsRes] = await Promise.all([
          fetchApi(`/artisans/${id}`),
          fetchApi(`/artisans/${id}/products`)
        ]);
        
        if (artisanRes.ok) {
          setArtisan(await artisanRes.json());
        }
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          // Filter to only show published products on customer view
          setProducts((productsData.products || []).filter((p: any) => p.status === "published"));
        }
      } catch (err) {
        console.error("Failed to fetch artisan details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisan();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-warm-gray">Loading artisan profile...</p>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl text-navy mb-4">Artisan Not Found</h1>
        <Link href="/explore" className="text-gold hover:underline">
          Return to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Profile Header */}
      <div className="bg-beige rounded-2xl p-10 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-border">
          <svg className="w-12 h-12 text-warm-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="text-center md:text-left">
          <h1 className="font-serif text-4xl text-navy mb-2">{artisan.name}</h1>
          <p className="text-warm-gray text-lg mb-4">{artisan.craft_category} · {artisan.location}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
            <span className="px-3 py-1 bg-white text-navy rounded-full text-xs font-medium border border-border shadow-sm">
              {artisan.business_type === "individual" ? "Independent Artisan" : "Small Business"}
            </span>
            {artisan.languages && artisan.languages.map((lang: string) => (
              <span key={lang} className="px-3 py-1 bg-white text-navy rounded-full text-xs font-medium border border-border shadow-sm uppercase">
                {lang}
              </span>
            ))}
          </div>
          <p className="text-warm-gray leading-relaxed max-w-2xl">
            A dedicated craftsman specializing in {artisan.craft_category.toLowerCase()}. 
            Their work reflects a deep understanding of traditional techniques combined with contemporary sensibilities.
          </p>
        </div>
      </div>

      {/* Artisan's Works */}
      <h2 className="font-serif text-3xl text-navy mb-8">Works by {artisan.name}</h2>
      
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-xl">
          <p className="text-warm-gray text-lg">No published works available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div 
                className={`aspect-[4/5] rounded-xl flex items-center justify-center mb-3 overflow-hidden bg-cover bg-center ${product.images ? '' : 'bg-stone-200'}`}
                style={product.images ? { backgroundImage: `url(${product.images.split(',')[0]})` } : undefined}
              >
                {!product.images && (
                  <div className="text-white/60 text-center p-4">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="font-serif text-lg text-navy group-hover:text-gold transition-colors">
                {product.title}
              </h3>
              <p className="text-sm font-medium text-navy mt-1">
                ₹{product.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
