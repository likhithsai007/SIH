"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/stores/AuthContext";

const navLinks = [
  { href: "/explore", label: "Gallery" },
  { href: "/artisans", label: "Artisans" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export default function CustomerHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border-light">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl tracking-[0.15em] font-bold text-navy">
          AESTHETE
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/explore" && pathname?.startsWith("/explore"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-navy font-medium border-b border-navy pb-0.5"
                    : "text-warm-gray hover:text-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user?.role === "artisan" ? (
            <Link href="/artisan/dashboard" className="px-4 py-2 bg-navy text-white text-xs rounded-full hover:bg-navy-light transition-colors">
              Artisan Studio
            </Link>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link href="/orders" className="text-xs font-medium text-navy hover:text-gold transition-colors">
                My Orders
              </Link>
              <Link href="/cart" className="text-warm-gray hover:text-navy transition-colors relative" title="View Cart">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
              <button
                onClick={() => logout()}
                className="text-xs text-red-600 hover:text-red-800 transition-colors px-2 py-1 border border-red-200 rounded hover:bg-red-50"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login?role=customer" className="text-warm-gray hover:text-navy transition-colors" title="Sign In">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/cart" className="text-warm-gray hover:text-navy transition-colors relative" title="View Cart">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
