"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/ui";
import { useAuth } from "@/stores/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect immediately to their role homepage
    if (user) {
      if (user.role === "artisan") router.replace("/artisan/dashboard");
      else if (user.role === "admin") router.replace("/admin/dashboard");
      else router.replace("/explore");
      return;
    }

    // Fallback check from localStorage before state hydration
    try {
      const saved = localStorage.getItem("auth_user");
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === "artisan") router.replace("/artisan/dashboard");
        else if (u.role === "admin") router.replace("/admin/dashboard");
        else router.replace("/explore");
      }
    } catch {}
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border-light">
        <Link href="/" className="font-serif text-2xl tracking-[0.15em] font-bold text-navy">
          AESTHETE
        </Link>
        <div className="flex items-center gap-6 text-sm tracking-wide text-warm-gray">
          <Link href="#" className="hover:text-navy transition-colors">SUPPORT</Link>
          <Link href="#" className="hover:text-navy transition-colors">LANGUAGE</Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 py-20">
        <h1 className="font-serif text-5xl md:text-6xl text-navy text-center mb-4">
          Welcome to Aesthete
        </h1>
        <p className="text-warm-gray text-center max-w-lg text-lg mb-16">
          Select your destination to manage collections, craft narratives, or curate the exceptional.
        </p>

        {/* Portal Cards — 2 main portals for Creators and Buyers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {/* Artisan Studio */}
          <Link href="/login?role=artisan" className="group relative h-96 rounded-2xl overflow-hidden bg-navy-light flex flex-col justify-end p-8 transition-transform hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-gold text-xs tracking-widest uppercase mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Creator
              </div>
              <h2 className="font-serif text-3xl text-white mb-2">Artisan Studio</h2>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                Manage your inventory, update listings, and track bespoke commissions with precision.
              </p>
              <span className="text-white text-sm font-medium group-hover:underline">
                Enter Studio →
              </span>
            </div>
          </Link>

          {/* Explore Gallery */}
          <Link href="/explore" className="group relative h-96 rounded-2xl overflow-hidden bg-beige flex flex-col justify-end p-8 transition-transform hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-navy text-xs tracking-widest uppercase mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Public
              </div>
              <h2 className="font-serif text-3xl text-navy mb-2">Explore Gallery</h2>
              <p className="text-warm-gray text-sm mb-4 line-clamp-2">
                Experience the storefront as a visitor. Browse exquisite collections and artisan profiles.
              </p>
              <span className="text-navy text-sm font-medium group-hover:underline">
                View Gallery →
              </span>
            </div>
          </Link>
        </div>

        {/* Small lower-right Admin portal bar */}
        <div className="w-full max-w-4xl flex justify-end mt-8">
          <Link 
            href="/login?role=admin" 
            className="text-xs text-warm-gray-light hover:text-navy transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-cream border border-transparent hover:border-border"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Operations &amp; Admin Portal →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
