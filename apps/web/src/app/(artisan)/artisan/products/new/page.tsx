"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { fetchApi, API_BASE_URL } from "@/lib/api/client";
import { useAuth } from "@/stores/AuthContext";

function ProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [imageUrl, setImageUrl] = useState("");
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    materials: "",
    price: "",
    currency: "INR",
    quantity: "1",
    crafting_process: "",
  });
  const [tagList, setTagList] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Load existing product if editing
  useEffect(() => {
    if (!editId) return;
    setFetching(true);
    fetchApi(`/products/${editId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load product");
        return res.json();
      })
      .then((data) => {
        setForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          materials: data.materials || "",
          price: data.price ? String(data.price) : "",
          currency: data.currency || "INR",
          quantity: data.quantity ? String(data.quantity) : "1",
          crafting_process: data.crafting_process || "",
        });
        if (data.images) setImageUrl(data.images);
        if (data.tags) setTagList(data.tags.split(",").filter(Boolean));
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [editId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = (e.target as HTMLInputElement).value.trim();
      if (val && !tagList.includes(val)) setTagList([...tagList, val]);
      (e.target as HTMLInputElement).value = "";
    }
  };

  const removeTag = (tag: string) => setTagList(tagList.filter((t) => t !== tag));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/products/upload`, {
        method: "POST",
        headers,
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Upload failed");
      }
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) {
      val = parts[0] + "." + parts.slice(1).join("");
    }
    setForm({ ...form, price: val });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setForm({ ...form, quantity: val });
  };

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, allowDecimal = true) => {
    if (["e", "E", "+", "-"].includes(e.key) || (!allowDecimal && e.key === ".")) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!user?.id) {
      setError("You must be logged in.");
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0 || !form.category) {
      setError("Price and Category on the right panel are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const finalTitle = form.title.trim() || `${form.category} Craft Work`;
      const endpoint = isEdit ? `/products/${editId}` : "/products/";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetchApi(endpoint, {
        method,
        body: JSON.stringify({
          artisan_id: user.id,
          title: finalTitle,
          description: form.description || null,
          category: form.category,
          materials: form.materials || null,
          price: parseFloat(form.price),
          currency: form.currency,
          quantity: parseInt(form.quantity) || 1,
          tags: tagList.join(",") || null,
          images: imageUrl || null,
          status,
          crafting_process: form.crafting_process || null,
        }),
      });
      if (res.ok) {
        router.push("/artisan/posts");
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to save product.");
      }
    } catch (err: any) {
      setError(err.message || "Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return <div className="py-20 text-center text-warm-gray">Loading work details...</div>;
  }

  const ic =
    "w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors";
  const lc =
    "text-xs font-medium tracking-widest text-warm-gray-light uppercase block mb-1.5";

  return (
    <div>
      <div className="text-sm text-warm-gray mb-2">
        Inventory / <span className="text-navy">{isEdit ? "Edit Work" : "List New Work"}</span>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-navy">{isEdit ? "Edit Work" : "List New Work"}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={saving || uploading}
            className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-warm-gray hover:bg-cream transition-colors cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={saving || uploading}
            className="px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (isEdit ? "Updating..." : "Publishing...") : (isEdit ? "Update Work" : "Publish to Gallery")}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery Imagery */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-serif text-xl text-navy mb-2">
              Gallery Imagery
            </h2>
            <p className="text-sm text-warm-gray mb-4">
              Upload a high-resolution image that showcases the craftsmanship.
            </p>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />

            {imageUrl ? (
              <div className="space-y-3">
                <div className="relative border border-border rounded-xl overflow-hidden aspect-video bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImageUrl("")}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-white shadow-sm transition-colors"
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex justify-center">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); }}
                    className="px-4 py-1.5 bg-navy text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 hover:bg-navy-light transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Enhance with AI
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-gold transition-colors cursor-pointer ${uploading ? "opacity-50" : ""}`}
              >
                <svg
                  className="w-10 h-10 mx-auto mb-3 text-warm-gray-light"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-warm-gray mb-1">
                  {uploading ? "Uploading..." : "Click to select an image"}
                </p>
                <p className="text-xs text-warm-gray-light mb-3">
                  PNG, JPG, up to 5MB
                </p>
                <div className="flex flex-col items-center gap-2.5 mt-1">
                  <span className="px-4 py-2 border border-border rounded-lg text-sm text-navy hover:bg-cream transition-colors inline-block font-medium">
                    {uploading ? "Uploading..." : "Browse Files"}
                  </span>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); }}
                    className="px-4 py-1.5 bg-navy text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 hover:bg-navy-light transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Enhance with AI
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Work Details (Optional) */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-navy">Work Details</h2>
              <span className="text-xs bg-cream text-warm-gray px-2.5 py-1 rounded-full">Optional</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className={lc}>Title of Work (Optional)</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Hand-thrown Ceramic Vase (Defaults to category name if left blank)"
                  className={ic}
                />
              </div>
              <div>
                <label className={lc}>Description (Optional)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the piece, its inspiration, and its unique characteristics..."
                  className={ic + " resize-none"}
                />
              </div>
              <div>
                <label className={lc}>Tags (Optional)</label>
                <input
                  onKeyDown={handleTagInput}
                  placeholder="e.g., Ceramics, Minimalist (press Enter)"
                  className={ic}
                />
                {tagList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tagList.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gold-muted text-navy rounded-full text-xs"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-error"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Required Primary Panel */}
        <div className="space-y-6">
          {/* Pricing & Inventory (Required) */}
          <div className="bg-white rounded-xl border border-navy/20 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-navy">Pricing &amp; Inventory</h2>
              <span className="text-xs bg-navy text-white px-2.5 py-1 rounded-full font-medium">Required</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lc}>Price * (Numbers only)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handlePriceChange}
                    onKeyDown={(e) => handleNumericKeyDown(e, true)}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    className={ic + " font-mono font-medium text-navy"}
                  />
                </div>
                <div>
                  <label className={lc}>Currency *</label>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className={ic + " bg-white"}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={lc}>Available Quantity * (Numbers only)</label>
                <input
                  name="quantity"
                  value={form.quantity}
                  onChange={handleQuantityChange}
                  onKeyDown={(e) => handleNumericKeyDown(e, false)}
                  type="text"
                  inputMode="numeric"
                  placeholder="1"
                  className={ic + " font-mono font-medium text-navy"}
                />
                <p className="text-xs text-warm-gray-light mt-1">
                  Leave as 1 for unique, one-of-a-kind pieces.
                </p>
              </div>
            </div>
          </div>

          {/* Provenance */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-serif text-xl text-navy mb-2">Provenance</h2>
            <p className="text-sm text-warm-gray mb-4">
              Detail the materials and category for this work.
            </p>
            <div className="space-y-4">
              <div>
                <label className={lc}>Category * (Required)</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={ic + " bg-white font-medium text-navy"}
                >
                  <option value="">Select category</option>
                  <option value="Ceramics">Ceramics</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Woodworking">Woodworking</option>
                  <option value="Metalwork">Metalwork</option>
                  <option value="Handicrafts">Handicrafts</option>
                  <option value="Pottery">Pottery</option>
                </select>
              </div>
              <div>
                <label className={lc}>Primary Materials (Optional)</label>
                <input
                  name="materials"
                  value={form.materials}
                  onChange={handleChange}
                  placeholder="e.g., Stoneware clay, natural ash glaze"
                  className={ic}
                />
              </div>
              <div>
                <label className={lc}>Crafting Process (Optional)</label>
                <textarea
                  name="crafting_process"
                  value={form.crafting_process}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Briefly describe the techniques used..."
                  className={ic + " resize-none"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListNewWorkPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-warm-gray">Loading...</div>}>
      <ProductFormContent />
    </Suspense>
  );
}
