"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, ProductCard, WishlistButton } from "@/components/ui";
import { fetchApi } from "@/lib/api/client";
import { useCart } from "@/stores/CartContext";
import { useAuth } from "@/stores/AuthContext";
import type { Product, Artisan } from "@/types";

const categoryGradients: Record<string, string> = {
  Ceramics: "from-stone-700 to-stone-900",
  Textiles: "from-amber-800 to-amber-950",
  Woodworking: "from-amber-900 to-stone-900",
  Metalwork: "from-zinc-700 to-zinc-950",
  Handicrafts: "from-rose-800 to-stone-900",
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"story" | "specs" | "care" | "guarantee">("story");
  const [cartQty, setCartQty] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const isArtisan = user?.role === "artisan";
  const isAdmin = user?.role === "admin";
  const isOwner = isArtisan && user?.id === product?.artisan_id;

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetchApi(`/products/${id}`);
        if (res.ok) {
          const productData = await res.json();
          setProduct(productData);

          // Fetch Artisan details
          if (productData.artisan_id) {
            const artRes = await fetchApi(`/artisans/${productData.artisan_id}`);
            if (artRes.ok) {
              setArtisan(await artRes.json());
            }
          }

          // Fetch related category products
          const relatedRes = await fetchApi(`/products/marketplace?category=${encodeURIComponent(productData.category)}`);
          if (relatedRes.ok) {
            const relData = await relatedRes.json();
            const relList = Array.isArray(relData) ? relData : relData.products || [];
            setRelatedProducts(relList.filter((p: Product) => p.id !== id).slice(0, 4));
          }
        }
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
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

  const handleAddToCart = (redirectCart = false) => {
    if (!user) {
      router.push("/login?role=customer");
      return;
    }
    if (!product) return;
    addToCart(product, cartQty);
    if (redirectCart) {
      router.push("/cart");
    } else {
      setAddedAlert(true);
      setTimeout(() => setAddedAlert(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="w-10 h-10 border-3 border-navy border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="text-warm-gray font-serif text-lg">Curating masterwork details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl text-navy">Product Not Found</h1>
        <p className="text-warm-gray text-sm">The handcrafted piece you are looking for may have been collected or removed.</p>
        <Link
          href="/explore"
          className="inline-block px-6 py-3 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy-light transition-colors"
        >
          Return to Gallery
        </Link>
      </div>
    );
  }

  const images = product.images ? product.images.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const currentImage = images[selectedImageIndex] || images[0];
  const artisanName = artisan?.name || product.artisan_name || product.artisan_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-light">
        <nav className="text-xs text-warm-gray flex items-center gap-2">
          <Link href="/" className="hover:text-navy">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-navy">Gallery</Link>
          <span>/</span>
          <Link href={`/explore?category=${encodeURIComponent(product.category)}`} className="hover:text-navy">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Artisan Listing Owner Controls */}
        {isArtisan && isOwner && (
          <div className="flex items-center gap-2">
            <Link
              href={`/artisan/products/new?id=${product.id}`}
              className="px-3 py-1.5 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-light transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Listing
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Listing"}
            </button>
          </div>
        )}
      </div>

      {/* Main PDP 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
        {/* Left Gallery Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream border border-border shadow-luxury">
            {currentImage ? (
              <div
                className="w-full h-full bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url(${currentImage})` }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${categoryGradients[product.category] || "from-navy to-navy-light"} flex flex-col items-center justify-center p-8 text-white text-center`}>
                <svg className="w-20 h-20 mb-4 text-gold/80 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="font-serif text-2xl font-bold">{product.title}</h3>
                <span className="text-xs text-white/70 uppercase tracking-widest mt-1">{product.category}</span>
              </div>
            )}

            {/* Wishlist Button floating top-right */}
            <div className="absolute top-4 right-4 z-10">
              <WishlistButton product={product} size="lg" />
            </div>

            {/* Scarcity badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 bg-navy/90 backdrop-blur-md text-gold text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                Certified Mastercraft
              </span>
            </div>
          </div>

          {/* Thumbnails strip if multiple images exist */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx ? "border-gold scale-105 shadow-sm" : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                </button>
              ))}
            </div>
          )}

          {/* Artisan Verification Card */}
          <div className="bg-cream/80 rounded-2xl p-6 border border-border shadow-luxury flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-navy text-gold flex items-center justify-center font-serif text-2xl font-bold shrink-0 border border-gold/40">
              {artisanName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-lg font-bold text-navy">{artisanName}</h4>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                  ✓ Verified Maker
                </span>
              </div>
              <p className="text-xs text-warm-gray mt-0.5">
                {artisan?.location ? `${artisan.location} · ` : ""}Master {product.category} Artisan
              </p>
              <Link
                href={`/artisans/${product.artisan_id}`}
                className="inline-block mt-2 text-xs font-semibold text-navy hover:text-gold underline transition-colors"
              >
                View Artisan Studio &amp; Heritage Bio →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Product Buy Stage */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs text-warm-gray flex items-center gap-1 font-medium">
                <span className="text-amber-500">★</span> 4.9 (28 Collector Reviews)
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy leading-tight">
              {product.title}
            </h1>

            <p className="text-sm text-warm-gray">
              Directly handcrafted by{" "}
              <Link href={`/artisans/${product.artisan_id}`} className="text-navy font-semibold underline hover:text-gold">
                {artisanName}
              </Link>
            </p>

            {/* Price Banner */}
            <div className="p-4 rounded-2xl bg-cream/60 border border-border flex items-center justify-between">
              <div>
                <span className="text-xs text-warm-gray-light block font-medium">Artisan Fair-Trade Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-navy">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    100% Direct Payout
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-warm-gray">
                {product.quantity > 0 ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                    ● In Stock ({product.quantity} units)
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-full">
                    Made-to-Order
                  </span>
                )}
              </div>
            </div>

            {/* Purchasing Widget */}
            {!isArtisan && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-border rounded-xl bg-cream px-3 py-2">
                    <button
                      onClick={() => setCartQty(Math.max(1, cartQty - 1))}
                      className="w-7 h-7 flex items-center justify-center text-navy font-bold hover:bg-white rounded-lg transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-navy text-sm">{cartQty}</span>
                    <button
                      onClick={() => setCartQty(Math.min(product.quantity || 99, cartQty + 1))}
                      className="w-7 h-7 flex items-center justify-center text-navy font-bold hover:bg-white rounded-lg transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 py-3.5 bg-navy hover:bg-navy-light text-white rounded-xl font-bold text-sm transition-all shadow-luxury hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Add to Bag · ₹{(product.price * cartQty).toLocaleString()}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(true)}
                  className="w-full py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  Buy Now &amp; Checkout
                </button>

                {addedAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
                    <span>✓</span> Added {cartQty} piece(s) to your bag successfully!
                  </div>
                )}
              </div>
            )}

            {/* Tabbed Craft Details Accordion */}
            <div className="border border-border rounded-2xl overflow-hidden bg-white shadow-luxury mt-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-border bg-cream/50 text-xs font-bold">
                {[
                  { id: "story", label: "The Craft Story" },
                  { id: "specs", label: "Materials & Origin" },
                  { id: "care", label: "Care Guide" },
                  { id: "guarantee", label: "Authenticity" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? "border-navy text-navy bg-white font-bold"
                        : "border-transparent text-warm-gray hover:text-navy"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-5 text-xs sm:text-sm text-warm-gray leading-relaxed">
                {activeTab === "story" && (
                  <div className="space-y-3">
                    <p>{product.description || "This piece is individually handcrafted using traditional methods."}</p>
                    {product.crafting_process && (
                      <div className="p-3 bg-cream rounded-xl border border-border-light mt-3">
                        <span className="font-serif font-bold text-navy block mb-1">Technique &amp; Process:</span>
                        <p>{product.crafting_process}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg bg-cream/60">
                      <span className="text-[11px] text-warm-gray-light block">Medium</span>
                      <span className="font-semibold text-navy">{product.category}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-cream/60">
                      <span className="text-[11px] text-warm-gray-light block">Raw Materials</span>
                      <span className="font-semibold text-navy">{product.materials || "Natural traditional elements"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-cream/60">
                      <span className="text-[11px] text-warm-gray-light block">Artisan Hub</span>
                      <span className="font-semibold text-navy">{artisan?.location || "India"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-cream/60">
                      <span className="text-[11px] text-warm-gray-light block">Batch Quantity</span>
                      <span className="font-semibold text-navy">{product.quantity} available</span>
                    </div>
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-2">
                    <p>• Wipe gently with a soft dry cotton cloth.</p>
                    <p>• Avoid harsh chemical cleaners, abrasive scrubbers, and direct moisture exposure.</p>
                    <p>• Natural patinas and glaze variations are marks of authentic handmade origin.</p>
                  </div>
                )}

                {activeTab === "guarantee" && (
                  <div className="space-y-2">
                    <p className="font-serif font-bold text-navy">100% Direct Artisan Guarantee</p>
                    <p>Every piece is certified as genuine handicraft. Payment is held in secure escrow until the masterwork reaches your hands.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Related Works */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-border-light">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold block">
                More in {product.category}
              </span>
              <h2 className="font-serif text-2xl font-bold text-navy">
                You May Also Cherish
              </h2>
            </div>
            <Link
              href={`/explore?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-navy hover:text-gold uppercase tracking-wider"
            >
              Explore Category →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
