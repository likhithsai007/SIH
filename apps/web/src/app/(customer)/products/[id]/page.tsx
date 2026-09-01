"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import type { Product } from "@/types";

const categoryColors: Record<string, string> = {
  Ceramics: "bg-stone-300",
  Textiles: "bg-amber-200",
  Woodworking: "bg-amber-600",
  Metalwork: "bg-zinc-500",
  Handicrafts: "bg-rose-200",
};

import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api/client";
import { useCart } from "@/stores/CartContext";
import { useAuth } from "@/stores/AuthContext";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [cartQty, setCartQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [unitsSold, setUnitsSold] = useState<number>(0);
  const isAdmin = user?.role === "admin";
  const isArtisan = user?.role === "artisan";
  const isOwner = isArtisan && user?.id === product?.artisan_id;

  useEffect(() => {
    if (!id) return;
    fetchApi("/orders/")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const ordersList = Array.isArray(data) ? data : data.orders || [];
        const prodOrders = ordersList.filter(
          (o: any) =>
            (o.product_id === id ||
              (product?.title && o.product_title?.toLowerCase() === product.title.toLowerCase())) &&
            o.status !== "pending"
        );
        const totalSold = prodOrders.reduce((sum: number, o: any) => sum + Number(o.quantity), 0);
        setUnitsSold(totalSold);
      })
      .catch(() => {});
  }, [id, product?.title]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this work? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetchApi(`/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/artisan/posts");
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Error deleting product");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetchApi(`/products/${id}`);
        if (res.ok) {
          const productData = await res.json();
          setProduct(productData);
          if (productData.artisan_id) {
            const artisanRes = await fetchApi(`/artisans/${productData.artisan_id}`);
            if (artisanRes.ok) {
              setArtisan(await artisanRes.json());
            }
          }
        }
      } catch {
        // API unavailable
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-warm-gray">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl text-navy mb-4">Product Not Found</h1>
        <Link href="/explore" className="text-gold hover:underline">
          Return to Gallery
        </Link>
      </div>
    );
  }

  const artisanName = artisan?.name || product.artisan_id;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <nav className="text-sm text-warm-gray">
          <Link href="/artisans" className="hover:text-navy">Artisans</Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-navy">{product.title}</span>
        </nav>

        {/* Top-right Edit & Delete controls for Artisans */}
        {isArtisan && (
          <div className="flex gap-2">
            <Link
              href={`/artisan/products/new?id=${product.id}`}
              className="px-3 py-1.5 bg-navy text-white text-xs font-medium rounded-lg hover:bg-navy-light transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Work
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        {product.images ? (
          <div 
            className="aspect-square rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${product.images.split(',')[0]})` }} 
          />
        ) : (
          <div className={`aspect-square rounded-2xl ${categoryColors[product.category] || "bg-stone-200"} flex items-center justify-center`}>
            <div className="text-white/40 text-center">
              <svg className="w-20 h-20 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Product Image</p>
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="gold" className="w-fit">One of a Kind</Badge>
            {isArtisan && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                product.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {product.status}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl text-navy mb-1">{product.title}</h1>
          <p className="text-warm-gray text-sm mb-4">
            Crafted by{" "}
            <Link href={`/artisans/${product.artisan_id}`} className="text-navy font-medium underline hover:text-gold transition-colors">
              {artisanName}
            </Link>
          </p>
          <p className="text-2xl font-serif text-navy mb-6">
            ₹{product.price.toLocaleString()}
          </p>

          {/* Action / Inspector Panel */}
          {isAdmin ? (
            <div className="bg-cream/70 border border-navy/20 p-5 rounded-xl mb-8 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-navy">Admin Product Inspection</span>
                <span className="text-xs bg-navy text-white px-2.5 py-0.5 rounded-full font-medium">Inspector Mode</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border-light">
                <div>
                  <span className="text-xs text-warm-gray block mb-1">Products Sold Out</span>
                  <p className="font-serif text-xl font-bold text-navy">{unitsSold} units sold</p>
                </div>
                <div>
                  <span className="text-xs text-warm-gray block mb-1">Remaining Stock Left</span>
                  <p className="font-serif text-xl font-bold text-navy">{product.quantity} in stock</p>
                </div>
              </div>
            </div>
          ) : !isArtisan ? (
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center border border-border rounded-lg bg-cream/50 px-2 py-1">
                  <button
                    onClick={() => setCartQty(Math.max(1, cartQty - 1))}
                    className="w-8 h-8 flex items-center justify-center text-navy font-bold hover:bg-white rounded transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-medium text-navy text-sm">{cartQty}</span>
                  <button
                    onClick={() => setCartQty(Math.min(product.quantity || 99, cartQty + 1))}
                    className="w-8 h-8 flex items-center justify-center text-navy font-bold hover:bg-white rounded transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button 
                  onClick={() => {
                    if (!user) {
                      router.push("/login?role=customer");
                      return;
                    }
                    addToCart(product, cartQty);
                    alert(`Added ${cartQty} item${cartQty > 1 ? "s" : ""} to cart!`);
                  }}
                  className="flex-1 py-3 bg-navy text-white rounded-lg font-medium text-sm hover:bg-navy-light transition-colors shadow-sm"
                >
                  Add {cartQty > 1 ? `${cartQty} ` : ""}to Bag
                </button>
              </div>

              <button 
                onClick={() => {
                  if (!user) {
                    router.push("/login?role=customer");
                  } else {
                    router.push("/cart");
                  }
                }}
                className="w-full py-3 border border-navy text-navy rounded-lg font-medium text-sm hover:bg-navy hover:text-white transition-colors text-center"
              >
                Go to Cart
              </button>
            </div>
          ) : (
            <div className="bg-cream border border-border p-4 rounded-xl mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs text-warm-gray uppercase tracking-wider font-medium">Listing Management</p>
                <p className="text-sm text-navy font-medium">Manage this work</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/artisan/products/new?id=${product.id}`}
                  className="px-3.5 py-2 bg-navy text-white text-xs font-medium rounded-lg hover:bg-navy-light transition-colors"
                >
                  Edit Listing
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Work"}
                </button>
              </div>
            </div>
          )}

          {/* Product Description */}
          {product.description && (
            <div className="border-t border-border pt-6 mb-6">
              <h3 className="font-serif text-lg text-navy mb-2">Description</h3>
              <p className="text-warm-gray leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Crafting Process */}
          {(product as any).crafting_process && (
            <div className="bg-cream/60 rounded-xl p-5 mb-6 border border-border">
              <h3 className="font-serif text-base text-navy mb-1.5 flex items-center gap-2">
                <span>✨</span> Crafting Technique &amp; Process
              </h3>
              <p className="text-sm text-warm-gray leading-relaxed whitespace-pre-line">
                {(product as any).crafting_process}
              </p>
            </div>
          )}

          {/* Materials & Dimensions */}
          {product.materials && (
            <div className="border border-border rounded-xl p-6 mb-6">
              <h3 className="font-serif text-lg text-navy mb-4">Materials</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-warm-gray-light">Material</span>
                  <p className="text-navy font-medium">{product.materials}</p>
                </div>
                <div>
                  <span className="text-warm-gray-light">Category</span>
                  <p className="text-navy font-medium">{product.category}</p>
                </div>
                <div>
                  <span className="text-warm-gray-light">Availability</span>
                  <p className="text-navy font-medium">{product.quantity} in stock</p>
                </div>
                <div>
                  <span className="text-warm-gray-light">Currency</span>
                  <p className="text-navy font-medium">{product.currency}</p>
                </div>
              </div>
            </div>
          )}

          {/* Artisan Card */}
          <div className="bg-beige rounded-xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-warm-gray-light rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-serif text-lg text-navy">{artisanName}</h4>
              <p className="text-xs tracking-widest text-warm-gray-light uppercase mt-1">
                {artisan?.location ? `${artisan.location} · ` : ""}{product.category} Artisan
              </p>
              <Link
                href={`/artisans/${product.artisan_id}`}
                className="inline-block mt-3 text-sm text-navy underline hover:text-gold transition-colors font-medium"
              >
                View Artisan Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
