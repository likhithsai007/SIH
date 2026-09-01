import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="font-serif text-2xl tracking-wider">AESTHETE</h3>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">
              Crafted for the Discerning.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Shipping</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-xs text-gray-500 text-center">
          © 2024 AESTHETE. Crafted for the Discerning.
        </div>
      </div>
    </footer>
  );
}
