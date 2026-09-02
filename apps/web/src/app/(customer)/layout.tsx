import CustomerHeader from "@/components/explore/Header";
import { Footer } from "@/components/ui";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

