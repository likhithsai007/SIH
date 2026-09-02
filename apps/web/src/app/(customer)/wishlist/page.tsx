"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ui";
import { useWishlist } from "@/stores/WishlistContext";
import { useCart } from "@/stores/CartContext";

export default function WishlistPage() {
  const { wishlistItems, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => addToCart(item, 1));
    alert("Added all saved works to your shopping bag!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-border-light pb-4">
        <div>
          <nav className="text-xs text-warm-gray mb-1.5 flex items-center gap-1.5">
            <Link href="/" className="hover:text-navy">Home</Link>
            <span>/</span>
            <span className="text-navy font-semibold">Wishlist</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy font-bold">
            Saved Masterworks ({wishlistCount})
          </h1>
          <p className="text-warm-gray text-xs sm:text-sm mt-1">
            Your personal collection of cherished handcrafted treasures.
          </p>
        </div>

        {wishlistCount > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddAllToCart}
              className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy-light transition-colors shadow-sm"
            >
              Add All to Bag
            </button>
            <button
              onClick={clearWishlist}
              className="px-4 py-2 border border-border text-warm-gray hover:text-rose-600 text-xs font-semibold rounded-xl hover:bg-white transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {wishlistCount === 0 ? (
        <div className="bg-white rounded-3xl border border-border p-16 text-center shadow-luxury space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-warm-gray">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-navy">No Saved Works Yet</h2>
          <p className="text-warm-gray text-sm max-w-sm mx-auto">
            Tap the heart icon on any handcrafted piece in the gallery to save it to your collection.
          </p>
          <div className="pt-2">
            <Link
              href="/explore"
              className="inline-block px-7 py-3 bg-navy hover:bg-navy-light text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              Explore Gallery →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
