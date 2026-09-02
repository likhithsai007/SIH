"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api/client";

interface Collection {
  title: string;
  description: string;
  category: string;
  badge: string;
  gradient: string;
  tags: string[];
}

const defaultCollections: Collection[] = [
  {
    title: "The Kiln & The Wheel",
    category: "Ceramics",
    description: "Embracing imperfection through wood-fired glazes, raw terracotta, and quartz Jaipur pottery.",
    badge: "Master Ceramics",
    gradient: "from-stone-800 via-stone-900 to-amber-950",
    tags: ["Jaipur Blue Glaze", "Khurja Terracotta", "Stoneware"],
  },
  {
    title: "Heirloom Looms & Natural Dyes",
    category: "Textiles",
    description: "Centuries-old pit loom traditions weaving pure mulberry silks, Pashmina wool, and herbal indigo.",
    badge: "Heritage Textiles",
    gradient: "from-rose-950 via-amber-950 to-stone-900",
    tags: ["Chanderi Silk", "Kashmiri Pashmina", "Bagru Block Print"],
  },
  {
    title: "Solid Hardwood & Inlay Joinery",
    category: "Woodworking",
    description: "Seasoned Indian rosewood and teak crafted with geometric brass inlays and traditional lattice screens.",
    badge: "Master Woodcraft",
    gradient: "from-amber-950 via-stone-900 to-stone-950",
    tags: ["Saharanpur Teak", "Sheet Brass Inlay", "Jali Carving"],
  },
  {
    title: "The Lost-Wax Metal Foundry",
    category: "Metalwork",
    description: "4,000-year tribal Dhokra casting and hand-beaten bell metal crafted into timeless sculptural heirlooms.",
    badge: "Ancient Metalwork",
    gradient: "from-zinc-800 via-stone-900 to-amber-950",
    tags: ["Bastar Dhokra", "Beaten Brass", "Moradabad Inlay"],
  },
  {
    title: "Sacred Folk Arts & Handicrafts",
    category: "Handicrafts",
    description: "Preserving generational folklore, Madhubani brush paintings, and royal Bidriware silver inlays.",
    badge: "GI Regional Craft",
    gradient: "from-stone-900 via-rose-950 to-stone-950",
    tags: ["Madhubani Art", "Bidriware", "Tarkashi"],
  },
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(defaultCollections);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const res = await fetchApi("/products/marketplace");
        if (res.ok) {
          const data = await res.json();
          const allProds = data.products || (Array.isArray(data) ? data : []);
          const uniqueCats = Array.from(new Set(allProds.map((p: any) => p.category))) as string[];
          if (uniqueCats.length > 0) {
            const dynamicList = uniqueCats.map((cat) => {
              const matched = defaultCollections.find((d) => d.category.toLowerCase() === cat.toLowerCase());
              return (
                matched || {
                  title: `${cat} Masterworks`,
                  category: cat,
                  description: `Curated handcrafted treasures and heritage collections of ${cat.toLowerCase()}.`,
                  badge: `${cat} Craft`,
                  gradient: "from-navy via-navy-light to-amber-950",
                  tags: [cat, "Handmade", "Authentic"],
                }
              );
            });
            setCollections(dynamicList);
          }
        }
      } catch (err) {
        console.error("Failed to fetch collections", err);
      }
    };
    loadCollections();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold">
          Curated Thematic Portfolios
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy font-bold">
          Heritage Collections
        </h1>
        <p className="text-warm-gray text-sm sm:text-base leading-relaxed">
          Explore our hand-picked selections of exceptional craftsmanship, organized by regional technique, material discipline, and design philosophy.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((col) => (
          <Link
            key={col.category}
            href={`/explore?category=${encodeURIComponent(col.category)}`}
            className="group relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] shadow-luxury shadow-luxury-hover border border-border flex flex-col justify-end p-8 transition-all"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} transition-transform duration-700 group-hover:scale-105`} />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

            {/* Content Stage */}
            <div className="relative z-10 space-y-3 text-white">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-gold/90 text-navy text-[11px] font-bold uppercase tracking-wider">
                  {col.badge}
                </span>
                <span className="text-xs text-white/80 group-hover:text-gold transition-colors font-semibold flex items-center gap-1">
                  View Series →
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold group-hover:text-gold-muted transition-colors">
                {col.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-lg leading-relaxed">
                {col.description}
              </p>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {col.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-md text-white/90 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
