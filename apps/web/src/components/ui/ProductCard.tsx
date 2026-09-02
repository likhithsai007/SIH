"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WishlistButton } from "./WishlistButton";
import { useCart } from "@/stores/CartContext";
import { useAuth } from "@/stores/AuthContext";
import type { Product } from "@/types";

const categoryColors: Record<string, string> = {
  Ceramics: "from-stone-700 to-stone-900",
  Textiles: "from-amber-700 to-amber-950",
  Woodworking: "from-amber-900 to-stone-900",
  Metalwork: "from-zinc-700 to-zinc-950",
  Handicrafts: "from-rose-800 to-stone-900",
};

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = product.images ? product.images.split(",") : [];
  const primaryImage = images[0];
  const secondaryImage = images[1] || primaryImage;

  // Derive rating deterministically from product ID
  const hash = product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = (4.5 + (hash % 5) * 0.1).toFixed(1);
  const reviewCount = 8 + (hash % 34);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login?role=customer");
      return;
    }
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
  };

  if (viewMode === "list") {
    return (
      <div className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-gold/50 shadow-luxury shadow-luxury-hover transition-all flex flex-col sm:flex-row gap-5 p-4 relative">
        <Link href={`/products/${product.id}`} className="relative w-full sm:w-56 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-cream shrink-0">
          {primaryImage ? (
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${primaryImage})` }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryColors[product.category] || "from-navy to-navy-light"} flex items-center justify-center p-6 text-white/70`}>
              <span className="font-serif text-lg tracking-wider text-center">{product.category}</span>
            </div>
          )}
          <div className="absolute top-2.5 right-2.5 z-10">
            <WishlistButton product={product} size="sm" />
          </div>
        </Link>

        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <span className="text-xs text-warm-gray flex items-center gap-1">
                <span className="text-amber-500">★</span> {rating} ({reviewCount})
              </span>
            </div>

            <Link href={`/products/${product.id}`}>
              <h3 className="font-serif text-lg font-bold text-navy group-hover:text-gold transition-colors line-clamp-1">
                {product.title}
              </h3>
            </Link>

            <p className="text-xs text-warm-gray mt-1">
              Crafted by{" "}
              <Link href={`/artisans/${product.artisan_id}`} className="font-medium text-navy hover:underline">
                {product.artisan_name || "Master Artisan"}
              </Link>
            </p>

            {product.description && (
              <p className="text-xs text-warm-gray-light mt-2 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-light">
            <div>
              <span className="text-xs text-warm-gray-light block">Direct Price</span>
              <span className="text-lg font-serif font-bold text-navy">₹{product.price.toLocaleString()}</span>
            </div>

            <button
              onClick={handleQuickAdd}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm ${
                addedAnimation
                  ? "bg-emerald-600 text-white"
                  : "bg-navy hover:bg-navy-light text-white"
              }`}
            >
              {addedAnimation ? (
                <>✓ Added to Bag</>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-gold/50 shadow-luxury shadow-luxury-hover transition-all flex flex-col relative">
      {/* Product Image Stage */}
      <Link href={`/products/${product.id}`} className="relative aspect-[4/5] bg-cream overflow-hidden block">
        {primaryImage ? (
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${primaryImage})` }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${categoryColors[product.category] || "from-navy to-navy-light"} flex flex-col items-center justify-center p-6 text-white text-center`}>
            <svg className="w-12 h-12 mb-3 text-gold/80 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-serif text-sm tracking-widest uppercase font-semibold">{product.category}</span>
            <span className="text-[11px] text-white/70 mt-1">Handmade Original</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.quantity && product.quantity <= 3 ? (
            <span className="bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              Only {product.quantity} Left
            </span>
          ) : (
            <span className="bg-navy/80 backdrop-blur-md text-gold text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
              Handcrafted
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton product={product} size="sm" />
        </div>

        {/* Slide-Up Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 rounded-xl font-medium text-xs backdrop-blur-md transition-all shadow-md flex items-center justify-center gap-1.5 ${
              addedAnimation
                ? "bg-emerald-600 text-white"
                : "bg-navy/95 text-white hover:bg-gold hover:text-navy"
            }`}
          >
            {addedAnimation ? (
              <>✓ Added to Bag</>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Quick Add to Bag
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Category Line */}
          <div className="flex items-center justify-between text-xs text-warm-gray mb-1.5">
            <span className="text-[11px] font-medium tracking-wide uppercase text-warm-gray">
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-warm-gray font-medium">
              <span className="text-amber-500">★</span> {rating} ({reviewCount})
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-serif text-base font-bold text-navy group-hover:text-gold transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Artisan Subtitle */}
          <p className="text-xs text-warm-gray mt-1 truncate">
            by{" "}
            <Link
              href={`/artisans/${product.artisan_id}`}
              className="font-medium text-navy hover:text-gold transition-colors underline decoration-border hover:decoration-gold"
            >
              {product.artisan_name || "Regional Artisan"}
            </Link>
          </p>
        </div>

        {/* Price Tag */}
        <div className="mt-3 pt-2.5 border-t border-border-light flex items-center justify-between">
          <div>
            <span className="text-base font-serif font-bold text-navy">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
            Direct from Maker
          </span>
        </div>
      </div>
    </div>
  );
}
