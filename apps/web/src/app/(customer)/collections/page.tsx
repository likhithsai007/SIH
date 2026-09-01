"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api/client";

interface Collection {
  title: string;
  description: string;
  imageClass: string;
  category: string;
}

const collectionDescriptions: Record<string, string> = {
  Ceramics: "Embracing imperfection through natural glazes and organic forms.",
  Textiles: "Hand-woven fabrics using centuries-old traditional techniques.",
  Woodworking: "Clean lines and masterful joinery in solid hardwood.",
  Metalwork: "Raw textures and patinas crafted into functional art.",
  Handicrafts: "Authentic, regional artifacts created by master artisans.",
};

const categoryImageClasses: Record<string, string> = {
  Ceramics: "bg-stone-300",
  Textiles: "bg-amber-200",
  Woodworking: "bg-amber-600",
  Metalwork: "bg-zinc-500",
  Handicrafts: "bg-rose-200",
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const res = await fetchApi('/products/marketplace');
        if (res.ok) {
          const data = await res.json();
          const allProds = data.products || (Array.isArray(data) ? data : []);
          const uniqueCats = Array.from(new Set(allProds.map((p: any) => p.category))) as string[];
          
          const dynamicCollections = uniqueCats.map(cat => ({
            title: cat,
            description: collectionDescriptions[cat] || `Explore our curated selection of ${cat.toLowerCase()}.`,
            imageClass: categoryImageClasses[cat] || "bg-stone-400",
            category: cat
          }));
          
          setCollections(dynamicCollections);
        }
      } catch (err) {
        console.error("Failed to fetch collections", err);
      }
    };
    loadCollections();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl text-navy mb-4">Curated Collections</h1>
        <p className="text-warm-gray text-lg max-w-2xl mx-auto">
          Explore our hand-picked selections of exceptional craftsmanship, themed by technique and philosophy.
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-xl">
          <p className="text-warm-gray text-lg">Loading collections...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Link 
              key={collection.title}
              href={`/explore?category=${collection.category}`}
              className="group block relative overflow-hidden rounded-2xl aspect-[16/9]"
            >
              <div className={`absolute inset-0 ${collection.imageClass} transition-transform duration-700 group-hover:scale-105`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h2 className="font-serif text-3xl mb-2 group-hover:text-gold-muted transition-colors">
                  {collection.title}
                </h2>
                <p className="text-white/90 mb-4 max-w-md">
                  {collection.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium uppercase tracking-widest">
                  Explore Collection <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
