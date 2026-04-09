import { getProduct } from "@/lib/shopify";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCart } from "@/components/add-to-cart";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  Truck,
  ShieldCheck,
  ChevronRight,
  Zap,
  History as HistoryIcon,
  PackageSearch
} from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const handle = (await params).handle;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const price = product.priceRange.maxVariantPrice;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));

  // The first image
  const mainImage = product.images.edges[0]?.node;

  return (
    <div className="min-h-screen flex flex-col text-slate-900 overflow-hidden relative selection:bg-indigo-600 selection:text-white">
      {/* Cinematic Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[150px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[200px] -z-10 delay-700"></div>

      <Header />

      <main className="flex-1 relative z-10">
        {/* Breadcrumbs - High Contrast Glass */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
          <nav className="inline-flex px-8 py-4 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] gap-4 items-center shadow-xl">
            <Link href="/" className="hover:text-black transition-colors">Origins</Link>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <Link href="/shop" className="hover:text-black transition-colors">Resources</Link>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span className="text-indigo-600 italic underline decoration-indigo-200 decoration-4">{product.title}</span>
          </nav>
        </div>

        {/* Main Product Interface */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Visual Architecture Column */}
            <div className="lg:col-span-7 space-y-10 group/visuals">
              <div className="aspect-[4/5] relative rounded-[4rem] overflow-hidden bg-white/20 backdrop-blur-3xl shadow-[0_80px_150px_-30px_rgba(0,0,0,0.15)] border-2 border-white/60 group">
                <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors z-10 pointer-events-none"></div>
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={mainImage.altText || product.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-[2s] ease-out"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-100 bg-indigo-950">
                    <span className="text-xl font-black uppercase tracking-[0.5em] italic">No Manifest Image</span>
                  </div>
                )}

                {/* Status Protocol Badge */}
                <div className="absolute top-12 left-12 z-20">
                  <span className="px-8 py-4 bg-indigo-950/90 backdrop-blur-2xl text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-[1.5rem] border-2 border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)] skew-x-[-12deg] block">
                    <span className="skew-x-[12deg] flex items-center gap-3">
                      <Zap className="w-4 h-4 text-indigo-400" />
                      Priority Resource
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-8">
                {product.images.edges.slice(1, 5).map((imageEdge, i) => (
                  <div
                    key={i}
                    className="aspect-square border-2 border-white/60 relative rounded-[2rem] overflow-hidden cursor-pointer hover:border-indigo-600 transition-all bg-white/40 backdrop-blur-md group shadow-xl hover:translate-y-[-8px] duration-700"
                  >
                    <Image
                      src={imageEdge.node.url}
                      alt={imageEdge.node.altText || ""}
                      fill
                      className="object-cover group-hover:scale-125 transition-transform duration-[1.5s]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Parameter Details Column */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-white/40 backdrop-blur-[60px] rounded-[4.5rem] p-12 lg:p-16 border-2 border-white shadow-[0_50px_100px_-20px_rgba(79,70,229,0.15)] relative overflow-hidden h-full group/details">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] group-hover/details:bg-indigo-500/20 transition-colors duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-10 overflow-hidden">
                    <div className="flex gap-1.5 bg-indigo-950/5 p-3 rounded-2xl border border-white/60">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-indigo-600 text-indigo-600" />
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 ml-4 uppercase tracking-[0.4em] bg-white/60 px-5 py-2 rounded-full border border-white shadow-xl italic">Premium Index: 4.98</span>
                  </div>

                  <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em] mb-6 block italic">Resource Classification</span>
                  <h1 className="text-6xl lg:text-7xl font-black tracking-tighter mb-10 leading-[0.9] text-indigo-950 uppercase italic underline decoration-indigo-200 decoration-[16px] underline-offset-8">
                    {product.title}
                  </h1>

                  <div className="flex flex-col gap-6 mb-16 bg-indigo-950 text-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(49,46,129,0.4)] skew-x-[-12deg] group/price relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-600 opacity-20 translate-x-full group-hover/price:translate-x-0 transition-transform duration-1000"></div>
                    <div className="relative z-10 skew-x-[12deg]">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] block mb-4 opacity-40">Acquisition Value</span>
                      <div className="flex items-baseline gap-6">
                        <p className="text-6xl font-black tracking-tighter italic">
                          {formattedPrice}
                        </p>
                        <p className="text-2xl text-indigo-300/40 line-through decoration-indigo-400/60 decoration-4">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: price.currencyCode,
                          }).format(parseFloat(price.amount) * 1.5)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="prose prose-lg max-w-none mb-16 text-slate-500 leading-relaxed font-bold italic border-l-[12px] border-indigo-200 pl-10"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />

                  {/* Specification Selectors */}
                  <div className="space-y-10 mb-16">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 flex justify-between text-slate-400 items-center">
                        <span className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-indigo-400 active:animate-ping"></div> Dimension Set</span>
                        <span className="text-indigo-500 lowercase italic font-black cursor-pointer hover:text-black border-b border-indigo-200">Terminal Guide</span>
                      </h3>
                      <div className="flex flex-wrap gap-5">
                        {["XS", "S", "M", "L", "XL"].map((size) => (
                          <button
                            key={size}
                            className={cn(
                              "w-20 h-20 rounded-[1.5rem] border-2 flex items-center justify-center text-sm font-black transition-all shadow-xl",
                              size === "M"
                                ? "bg-indigo-600 text-white border-white/40 shadow-indigo-400 scale-110 rotate-3 z-10"
                                : "bg-white/60 backdrop-blur-md border-white/80 text-slate-400 hover:bg-white hover:border-indigo-600 hover:text-indigo-600"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="scale-110 mb-12 px-4">
                     <AddToCart product={product} />
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-16">
                    <div className="flex flex-col gap-6 p-10 rounded-[2.5rem] bg-white border-2 border-white/60 shadow-2xl hover:scale-105 transition-transform duration-500">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-white flex items-center justify-center">
                        <Truck className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Global Transit</p>
                        <p className="text-sm font-black text-indigo-950 uppercase italic">Priority Free</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 p-10 rounded-[2.5rem] bg-indigo-950 text-white border-2 border-white/10 shadow-2xl hover:scale-105 transition-transform duration-500">
                      <div className="w-14 h-14 rounded-2xl bg-white text-indigo-950 flex items-center justify-center shadow-[0_20px_40px_rgba(255,255,255,0.2)]">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Security Hash</p>
                        <p className="text-sm font-black text-white uppercase italic">Verified Bond</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specification Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px] -z-10 border-y-2 border-white/80 shadow-2xl"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[200px] -z-10"></div>

          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center mb-24 relative">
            <span className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.8em] mb-8 block italic">Protocol Breakdown</span>
            <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-8 text-center text-indigo-950 italic underline decoration-indigo-200 decoration-[16px] underline-offset-8">Material Synthesis</h2>
            <p className="text-slate-400 max-w-3xl mx-auto font-black uppercase tracking-[0.3em] text-[10px] leading-[2] opacity-60">Engineered with high-frequency precision and sustainable biological structures.</p>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { icon: Zap, title: "Neural Link", text: "Proprietary textile architecture that synchronizes with thermal regulation protocols." },
                { icon: HistoryIcon, title: "Archive Core", text: "Validated to maintain structural integrity across unlimited temporal cycles." },
                { icon: PackageSearch, title: "Moral Hash", text: "Decentralized production network verified for human-centric ethical standards." }
              ].map((f, i) => (
                <div key={i} className="p-16 rounded-[4.5rem] bg-white/40 backdrop-blur-[60px] border-2 border-white shadow-2xl hover:translate-y-[-16px] hover:rotate-1 transition-all duration-700 group/feature">
                  <div className="w-24 h-24 rounded-[2rem] bg-indigo-950 text-white shadow-[0_30px_60px_-15px_rgba(49,46,129,0.5)] flex items-center justify-center border-2 border-white/20 mb-12 group-hover/feature:rotate-[15deg] transition-transform duration-700">
                    <f.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 text-indigo-950 italic underline decoration-indigo-100 decoration-8 underline-offset-4">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-[1.8] font-bold italic opacity-80 uppercase tracking-widest">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resource Verification (Reviews) */}
        <section className="py-32 relative group/verified">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12 text-center lg:text-left">
              <div>
                 <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em] mb-6 block italic">User Validation</span>
                <h2 className="text-7xl lg:text-9xl font-black uppercase tracking-tighter mb-4 text-indigo-950 italic leading-[0.8] underline decoration-indigo-200 decoration-[16px] underline-offset-[12px]">Feedbacks</h2>
                <div className="flex items-center gap-8 justify-center lg:justify-start mt-12">
                  <div className="flex gap-2 bg-white/60 p-5 rounded-[2rem] border-2 border-white shadow-xl scale-110">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-6 h-6 fill-indigo-600 text-indigo-600" />
                    ))}
                  </div>
                  <span className="text-4xl font-black text-indigo-950 tracking-tighter italic underline decoration-indigo-200 decoration-8">4.95 ARCHIVE</span>
                </div>
              </div>
              <Button size="lg" className="rounded-[2.5rem] px-16 h-28 text-[11px] font-black uppercase tracking-[0.5em] shadow-[0_40px_80px_-20px_rgba(79,70,229,0.4)] bg-indigo-600 border-none hover:bg-black transition-all skew-x-[-12deg]">
                <span className="skew-x-[12deg]">Submit Feedback</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {[
                { name: "Julian V.", role: "Lead Architect", rating: 5, date: "Protocol-2024.12", text: "Transcendent quality. The material synthesis is unlike anything in my current collection. Absolute masterclass." },
                { name: "Sarah M.", role: "Resource Curator", rating: 5, date: "Protocol-2024.28", text: "Best resource acquisition this cycle. The sensory feedback from the fabric is calibrated to perfection." },
                { name: "Michael K.", role: "Operationalist", rating: 4, date: "Protocol-2024.15", text: "Highly optimized and ergonomic. Requesting additional color palettes for future deployments." }
              ].map((review, i) => (
                <div key={review.name} className={cn(
                    "p-16 bg-white/40 backdrop-blur-[60px] rounded-[5rem] border-2 border-white/80 hover:border-indigo-600 hover:translate-y-[-12px] transition-all duration-[1s] shadow-2xl relative overflow-hidden group/review",
                    i === 1 && "md:translate-y-12"
                )}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px]"></div>
                  <div className="flex justify-between items-start mb-12 relative z-10">
                    <div>
                      <h4 className="font-black text-3xl uppercase tracking-tighter text-indigo-950 italic leading-none mb-3">{review.name}</h4>
                      <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.4em] mb-4">{review.role}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">{review.date}</p>
                    </div>
                    <div className="flex gap-1 bg-white/80 p-3 rounded-2xl border border-white/40 shadow-xl group-hover/review:rotate-12 transition-transform">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("w-3.5 h-3.5", s <= review.rating ? "fill-indigo-600 text-indigo-600" : "text-slate-200")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 leading-[1.8] text-sm font-black italic uppercase tracking-widest opacity-80 border-l-4 border-indigo-200 pl-6 underline decoration-indigo-100 decoration-1 underline-offset-4">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Resource Network */}
        <section className="py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-950 backdrop-blur-3xl -z-10 relative overflow-hidden">
             <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[200px]"></div>
             <div className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px]"></div>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
            <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-32 text-center text-white italic underline decoration-indigo-600 decoration-[16px] underline-offset-[12px]">Similar Assets</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group/related cursor-pointer">
                  <div className="aspect-[3/4] rounded-[4rem] overflow-hidden bg-white/5 backdrop-blur-xl mb-12 border-2 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] group-hover/related:translate-y-[-16px] group-hover/related:rotate-2 transition-all duration-[1s] relative">
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover/related:opacity-100 transition-opacity z-10"></div>
                    <div className="w-full h-full bg-white/5 flex items-center justify-center transition-all duration-[1.5s] group-hover/related:scale-110">
                      <Image
                        src={product.images.edges[i % product.images.edges.length]?.node.url || mainImage?.url || ""}
                        alt="Related"
                        width={600}
                        height={800}
                        className="object-cover w-full h-full grayscale group-hover/related:grayscale-0 transition-all duration-1000"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mb-4 block italic">Resource-00{i}</span>
                    <h3 className="font-black text-xl uppercase tracking-tighter text-white italic group-hover/related:text-indigo-400 transition-colors underline decoration-white/20 decoration-4 underline-offset-4 mb-4">Related Style Node</h3>
                    <p className="text-indigo-400 font-black text-3xl tracking-tighter italic scale-110">$125.00</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
