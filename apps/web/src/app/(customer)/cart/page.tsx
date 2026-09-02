"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/stores/CartContext";
import { useWishlist } from "@/stores/WishlistContext";
import { useAuth } from "@/stores/AuthContext";
import { fetchApi } from "@/lib/api/client";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { addToWishlist } = useWishlist();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [placingOrder, setPlacingOrder] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?role=customer");
    }
  }, [user, authLoading, router]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const code = promoCode.trim().toUpperCase();
    if (code === "HERITAGE10") {
      setDiscountPercent(10);
      setPromoSuccess("10% Heritage discount applied!");
    } else if (code === "ARTISAN20") {
      setDiscountPercent(20);
      setPromoSuccess("20% Artisan Guild discount applied!");
    } else {
      setPromoError("Invalid code. Try HERITAGE10 or ARTISAN20");
    }
  };

  const discountAmount = Math.round((total * discountPercent) / 100);
  const finalTotal = Math.max(0, total - discountAmount);

  const handleMoveToWishlist = (item: any) => {
    addToWishlist(item);
    removeFromCart(item.id);
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?role=customer");
      return;
    }
    setPlacingOrder(true);
    try {
      for (const item of items) {
        await fetchApi("/orders/", {
          method: "POST",
          body: JSON.stringify({
            customer_name: user.name,
            customer_email: user.email,
            product_id: item.id,
            artisan_id: item.artisan_id,
            product_title: item.title,
            quantity: item.cartQuantity,
            price: item.price,
            status: "pending",
          }),
        });
      }
      setSuccess(true);
      clearCart();
    } catch (e) {
      console.error("Checkout failed", e);
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        <h1 className="font-serif text-4xl text-navy font-bold">
          Order Confirmed &amp; Reserved!
        </h1>
        <p className="text-warm-gray text-base max-w-md mx-auto leading-relaxed">
          Thank you for supporting master artisans. Your order has been placed into artisan fulfillment and recorded in your account.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/orders"
            className="px-6 py-3 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy-light transition-colors shadow-sm"
          >
            View Your Orders
          </Link>
          <Link
            href="/explore"
            className="px-6 py-3 bg-cream text-navy border border-border text-xs font-semibold rounded-xl hover:bg-white transition-colors"
          >
            Continue Browsing Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 border-b border-border-light pb-4">
        <nav className="text-xs text-warm-gray mb-1.5 flex items-center gap-1.5">
          <Link href="/" className="hover:text-navy">Home</Link>
          <span>/</span>
          <span className="text-navy font-semibold">Your Shopping Bag</span>
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl text-navy font-bold">
          Shopping Bag ({items.reduce((s, i) => s + i.cartQuantity, 0)} items)
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border p-16 text-center shadow-luxury space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-warm-gray">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-navy">Your Bag is Empty</h2>
          <p className="text-warm-gray text-sm max-w-sm mx-auto">
            Discover exquisite handcrafted pottery, pure silks, and carved woodcraft directly from master artisans.
          </p>
          <div className="pt-2">
            <Link
              href="/explore"
              className="inline-block px-7 py-3 bg-navy hover:bg-navy-light text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              Explore Curated Gallery →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-border shadow-luxury flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                {/* Product Thumbnail */}
                <Link
                  href={`/products/${item.id}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-cream border border-border overflow-hidden shrink-0 block"
                >
                  {item.images ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.images.split(",")[0]})` }}
                    />
                  ) : (
                    <div className="w-full h-full bg-navy text-gold flex items-center justify-center font-serif text-lg font-bold">
                      {item.category.charAt(0)}
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-gold">
                    {item.category}
                  </span>
                  <Link href={`/products/${item.id}`} className="block">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-navy hover:text-gold transition-colors truncate">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-warm-gray">
                    Crafted by{" "}
                    <span className="font-medium text-navy">{item.artisan_name || "Master Artisan"}</span>
                  </p>
                  <div className="text-sm font-serif font-bold text-navy pt-1">
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>

                {/* Quantity Controls & Removal */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-border rounded-lg bg-cream px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-navy font-bold hover:bg-white rounded transition-colors text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-navy text-xs">
                      {item.cartQuantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-navy font-bold hover:bg-white rounded transition-colors text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => handleMoveToWishlist(item)}
                      className="text-warm-gray hover:text-navy underline"
                    >
                      Save for later
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-600 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Checkout Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-border p-6 shadow-luxury space-y-6 sticky top-28">
            <h2 className="font-serif text-xl font-bold text-navy pb-3 border-b border-border-light">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-warm-gray block">
                Promo or Guild Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. HERITAGE10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-cream/80 border border-border rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-navy"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy-light transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && <p className="text-xs text-emerald-700 font-medium">{promoSuccess}</p>}
              {promoError && <p className="text-xs text-rose-600 font-medium">{promoError}</p>}
            </form>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs sm:text-sm border-t border-border-light pt-4">
              <div className="flex justify-between text-warm-gray">
                <span>Subtotal</span>
                <span className="font-medium text-navy">₹{total.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Guild Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-warm-gray">
                <span>Direct Artisan Allocation</span>
                <span className="font-medium text-emerald-700">100% Payout</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="border-t border-border pt-4 flex items-baseline justify-between">
              <div>
                <span className="font-serif text-lg font-bold text-navy block">Total Amount</span>
                <span className="text-[11px] text-warm-gray">INR (All taxes included)</span>
              </div>
              <span className="font-serif text-2xl font-bold text-navy">
                ₹{finalTotal.toLocaleString()}
              </span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleCheckout}
              disabled={placingOrder}
              className="w-full py-3.5 bg-navy hover:bg-navy-light text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-luxury hover:scale-[1.01] disabled:opacity-50"
            >
              {placingOrder ? "Placing Order..." : "Confirm & Place Direct Order"}
            </button>

            {/* Trust Reassurance */}
            <div className="pt-2 border-t border-border-light space-y-2 text-[11px] text-warm-gray">
              <div className="flex items-center gap-2">
                <span className="text-gold">🛡️</span>
                <span>Protected Escrow Transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold">🌿</span>
                <span>Certified Genuine Craft Maker Direct</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
