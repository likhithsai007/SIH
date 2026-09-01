"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api/client";

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await fetchApi("/artisans/");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setArtisans(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch artisans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisans();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-warm-gray">Loading artisans...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-12">
        <h1 className="font-serif text-4xl text-navy mb-4">Our Artisans</h1>
        <p className="text-warm-gray text-lg max-w-2xl">
          Discover the master craftsmen and independent creators behind the exceptional pieces in our gallery.
        </p>
      </div>

      {artisans.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-xl">
          <p className="text-warm-gray text-lg">No artisans found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <Link 
              href={`/artisans/${artisan.id}`} 
              key={artisan.id}
              className="group block bg-white border border-border rounded-2xl p-6 hover:border-gold transition-colors shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 text-warm-gray-light group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-navy group-hover:text-gold transition-colors">{artisan.name}</h3>
                  <p className="text-sm text-warm-gray">{artisan.location}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-border-light pt-4 mt-2">
                <span className="px-3 py-1 bg-gold-muted text-navy rounded-full text-xs font-medium">
                  {artisan.craft_category}
                </span>
                <span className="text-sm text-navy font-medium group-hover:underline">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
