"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/stores/CartContext";
import { useAuth } from "@/stores/AuthContext";
import { fetchApi } from "@/lib/api/client";

export default function CartPage() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?role=customer");
    }
  }, [user, authLoading, router]);

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
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-4xl text-navy mb-4">Order Placed Successfully!</h1>
        <p className="text-warm-gray mb-8">Thank you for supporting artisans.</p>
        <Link href="/explore" className="px-6 py-3 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors">
          Continue Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-serif text-4xl text-navy mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-xl">
          <p className="text-warm-gray text-lg mb-4">Your cart is empty.</p>
          <Link href="/explore" className="text-navy font-medium hover:text-gold transition-colors">
            Start browsing →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 bg-white p-6 rounded-xl border border-border items-center">
                <div 
                  className="w-24 h-24 rounded-lg bg-cover bg-center bg-stone-200 shrink-0" 
                  style={item.images ? { backgroundImage: `url(${item.images.split(',')[0]})` } : undefined}
                />
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-navy">{item.title}</h3>
                  <p className="text-sm text-warm-gray">{item.category}</p>
                  <div className="text-sm font-medium text-navy mt-2">
                    ₹{item.price.toLocaleString()} x {item.cartQuantity}
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-error hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl border border-border p-6 h-fit sticky top-24">
            <h2 className="font-serif text-xl text-navy mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray">Subtotal</span>
                <span className="text-navy font-medium">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray">Shipping</span>
                <span className="text-navy font-medium">Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t border-border-light pt-4 mb-6 flex justify-between font-medium">
              <span className="text-navy">Total (INR)</span>
              <span className="text-navy">₹{total.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={placingOrder}
              className="w-full py-3 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-50"
            >
              {placingOrder ? "Processing..." : "Place Order (Demo)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
