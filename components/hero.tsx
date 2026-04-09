"use client";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Next Generation <br />
            <span className="text-indigo-600">Tech Storefront</span>
          </h1>
          
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Premium products curated for performance and reliability. Experience the future of technology with our latest collection.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button
              size="lg"
              className="px-8 h-14 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all"
            >
              Shop Collection
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 h-14 text-base font-semibold rounded-full border-2 border-slate-200 hover:bg-white transition-all text-slate-900"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
