import CustomerHeader from "@/components/explore/Header";
import { Footer } from "@/components/ui";
import { CartProvider } from "@/stores/CartContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <CustomerHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
