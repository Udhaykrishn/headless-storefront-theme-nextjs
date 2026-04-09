import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getCollections } from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Collections | LUXE",
  description: "Browse all our curated collections of premium products.",
};

export default async function CollectionsPage() {
  const collections = await getCollections(24);

  return (
    <div className="min-h-screen flex flex-col text-slate-900 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-purple-500/5 blur-[100px] -z-10"></div>

      <Header />
      <main className="flex-1 max-w-[1400px] mx-auto px-6 lg:px-12 py-24 w-full">
        {/* Page Header */}
        <div className="mb-24 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-6 block drop-shadow-sm">Editorial Selection</span>
          <h1 className="text-8xl font-black tracking-tighter uppercase text-indigo-950 italic underline decoration-indigo-200 decoration-8 drop-shadow-2xl">
            Collections <span className="text-indigo-400 italic">2026</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-10 font-bold uppercase tracking-widest leading-relaxed">
            Explore our curated masterpieces, hand-picked for the modern connoisseur of fine lifestyle goods.
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="bg-white/30 backdrop-blur-3xl rounded-[4rem] p-32 text-center border border-white/40 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-10 opacity-10 mx-auto"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <p className="text-2xl font-black uppercase tracking-widest text-slate-400">Archive Empty</p>
            <p className="text-[10px] mt-4 font-bold uppercase tracking-[0.2em] text-indigo-300">New arrivals manifesting shortly</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-white/30 backdrop-blur-2xl shadow-xl border border-white/50 mb-10 group-hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.2)] transition-all duration-700 hover:translate-y-[-10px]">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 flex items-center justify-center">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">No Visual Asset</span>
                    </div>
                  )}
                  
                  {/* Floating Glass UI Overlay */}
                  <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out z-10">
                     <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-2xl">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-2 block">Premium Range</span>
                        <div className="flex items-center justify-between">
                           <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-950 italic">Open Gallery</h3>
                           <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" x2="17" y1="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                
                <div className="text-center md:text-left px-4">
                  <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter italic group-hover:text-indigo-600 transition-colors">
                    {collection.title}
                  </h2>
                  {collection.description && (
                    <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-[0.2em] line-clamp-2 leading-relaxed max-w-xs">
                      {collection.description}
                    </p>
                  )}
                  <div className="h-0.5 w-0 group-hover:w-full bg-indigo-200 mt-6 transition-all duration-700 shadow-sm"></div>
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
