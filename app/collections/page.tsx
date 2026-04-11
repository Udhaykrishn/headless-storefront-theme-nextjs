import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getCollections } from "@/lib/shopify";
import { ChevronRight, LayoutGrid } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Laptop Series | RebootX",
  description: "Browse our curated laptop series and find the perfect refurbished device for your workflow.",
};

export default async function CollectionsPage() {
  const collections = await getCollections(24);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 w-full">
        {/* ── Page Header ── */}
        <div className="mb-16 text-center max-w-2xl mx-auto pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            <LayoutGrid className="w-4 h-4" />
            <span>Curated Categories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Laptop Series
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Explore our professionally refurbished laptop categories. From ultrabooks 
            to high-performance workstations, find the perfect device tailored to your needs.
          </p>
        </div>

        {/* ── Empty State ── */}
        {collections.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <LayoutGrid className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Series Available
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              We&apos;re currently updating our curated series. Please check back later or explore all our products in the shop.
            </p>
            <Link 
              href="/shop" 
              className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          /* ── Collections Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                      <LayoutGrid className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {collection.title}
                  </h2>
                  
                  {collection.description ? (
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-6 flex-1">
                      {collection.description}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600 mb-6 flex-1">
                      Explore our premium selection of {collection.title.toLowerCase()} devices.
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-700">
                    <span>View Series</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
