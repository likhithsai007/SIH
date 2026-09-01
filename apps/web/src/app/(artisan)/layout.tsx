import ArtisanSidebar from "@/components/artisan/Sidebar";

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-cream">
      <ArtisanSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
