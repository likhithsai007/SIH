"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/AuthContext";
import { fetchApi } from "@/lib/api/client";

export default function ArtisanProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [artisan, setArtisan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) { router.push("/login?role=artisan"); return; }
    fetchApi(`/artisans/${user.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setArtisan(d))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  const handleLogout = () => { logout(); router.push("/"); };

  if (loading) return <div className="py-20 text-center text-warm-gray">Loading profile...</div>;
  if (!artisan) return <div className="py-20 text-center text-warm-gray">Profile not found.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-navy">My Profile</h1>
          <p className="text-warm-gray text-sm mt-1">Your artisan account details</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
        >
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="bg-white rounded-xl border border-border p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-4 border border-border">
            <svg className="w-10 h-10 text-warm-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-navy mb-1">{artisan.name}</h2>
          <p className="text-warm-gray text-sm mb-2">{artisan.email || user?.email}</p>
          <span className="px-3 py-1 bg-gold-muted text-navy rounded-full text-xs font-medium">
            {artisan.craft_category}
          </span>
          <div className="mt-4 flex gap-2 flex-wrap justify-center">
            {Array.isArray(artisan.languages) && artisan.languages.map((l: string) => (
              <span key={l} className="px-2 py-0.5 bg-cream text-navy rounded-full text-xs uppercase">{l}</span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-8">
          <h3 className="font-serif text-xl text-navy mb-6">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Full Name", value: artisan.name },
              { label: "Location", value: artisan.location },
              { label: "Craft Category", value: artisan.craft_category },
              { label: "Business Type", value: artisan.business_type },
              { label: "Phone", value: artisan.phone || "—" },
              { label: "Verification", value: artisan.verification_status },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-medium tracking-widest text-warm-gray-light uppercase mb-1">{label}</p>
                <p className="text-navy text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link href="/artisan/posts" className="bg-white rounded-xl border border-border p-6 hover:border-gold transition-colors group">
          <h3 className="font-serif text-lg text-navy group-hover:text-gold transition-colors mb-1">My Posts</h3>
          <p className="text-warm-gray text-sm">View all your listed works</p>
        </Link>
        <Link href="/artisan/orders" className="bg-white rounded-xl border border-border p-6 hover:border-gold transition-colors group">
          <h3 className="font-serif text-lg text-navy group-hover:text-gold transition-colors mb-1">My Orders</h3>
          <p className="text-warm-gray text-sm">View orders placed for your works</p>
        </Link>
      </div>
    </div>
  );
}
