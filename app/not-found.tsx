import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShoppingBag, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <Header />
      <main className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <ShoppingBag className="w-12 h-12 text-gray-200" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-4">404</h1>
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col gap-4">
                <Link href="/">
                    <Button className="w-full h-12 rounded-xl font-bold" size="lg">
                        Go Home
                    </Button>
                </Link>
                <Link href="/shop">
                    <Button variant="outline" className="w-full h-12 rounded-xl font-bold" size="lg">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Browse Catalog
                    </Button>
                </Link>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
