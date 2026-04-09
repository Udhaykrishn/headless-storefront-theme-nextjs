"use client";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Decorative gradient background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-rose-100/40 to-teal-50/40 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-blue-100/30 to-purple-50/40 blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 mb-8 border border-gray-200">
          <span className="flex w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
          Spring Collection 2026 is here
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight text-balance max-w-4xl leading-[1.1]">
          Elevate Your Everyday{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900">
            Essentials
          </span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto text-balance leading-relaxed">
          Discover a world of carefully curated premium pieces. Designed with
          uncompromising quality, crafted for those who appreciate the finer
          things.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            size="lg"
            className="h-14 px-8 text-base bg-black text-white hover:bg-gray-800 rounded-full shadow-xl shadow-black/10 transition-all hover:-translate-y-1"
          >
            Shop the Collection
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 text-base rounded-full border-gray-200 hover:bg-gray-50 transition-all"
          >
            Explore Features
          </Button>
        </div>
      </div>
    </section>
  );
}
