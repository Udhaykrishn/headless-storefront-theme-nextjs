import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { cookies } from "next/headers";
import { getCartData } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  Trash2, 
  Heart, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Zap 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const revalidate = 0;

export default async function CartPage() {
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = cartId ? await getCartData(cartId) : null;
  const isEmpty = !cart || cart.lines.edges.length === 0;

  if (!cart && !isEmpty) return null;

  return (
    <div className="min-h-screen flex flex-col text-slate-900 overflow-hidden relative selection:bg-indigo-600 selection:text-white">
      {/* Cinematic Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[150px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[200px] -z-10 delay-700"></div>

      <Header />
      
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-24 relative z-10">
          {/* Header Protocol */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-24 p-12 lg:p-16 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white/60 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] gap-12">
            <div>
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Current Selection</span>
              <h1 className="text-7xl lg:text-9xl font-black tracking-tighter uppercase text-indigo-950 italic leading-[0.8] underline decoration-indigo-200 decoration-[16px] underline-offset-[12px]">
                 Inventory
              </h1>
              <p className="text-slate-500 mt-12 font-bold uppercase tracking-[0.3em] text-[10px]">
                {isEmpty ? "Zero assets curated" : `${cart.lines.edges.length} premium pieces staged`}
              </p>
            </div>
            {!isEmpty && (
               <Link href="/shop" className="group text-[10px] font-black uppercase tracking-[0.3em] bg-indigo-950 text-white px-12 py-6 rounded-full hover:bg-black transition-all shadow-2xl skew-x-[-12deg]">
                  <span className="flex items-center gap-4 skew-x-[12deg]">
                    Expand Search <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </span>
               </Link>
            )}
          </div>

          {(isEmpty || !cart) ? (
            <div className="bg-white/30 backdrop-blur-[50px] rounded-[5rem] p-16 lg:p-48 text-center border border-white/60 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]"></div>
              <div className="relative z-10">
                <div className="w-32 h-32 bg-white/60 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl border border-white/60 group-hover:rotate-[360deg] transition-transform duration-[1.5s]">
                  <ShoppingBag className="w-14 h-14 text-indigo-600" />
                </div>
                <h2 className="text-5xl font-black mb-8 uppercase tracking-tighter text-indigo-950 italic">The vault is open</h2>
                <p className="text-slate-500 mb-16 max-w-lg mx-auto leading-relaxed font-bold uppercase tracking-[0.2em] text-[11px] opacity-80 italic">
                  Your curated archive remains unoccupied. Begin your journey through our latest material manifestations.
                </p>
                <Link href="/shop">
                  <Button size="lg" className="rounded-full px-16 h-24 text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl bg-indigo-600 hover:scale-[1.05] transition-all border-none">
                    Discovery Protocol
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Asset Manifest */}
              <div className="lg:col-span-8 space-y-12">
                <div className="space-y-12">
                  {cart.lines.edges.map((edge: any) => {
                    const line = edge.node;
                    const merchandise = line.merchandise;
                    const price = parseFloat(merchandise.price.amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: merchandise.price.currencyCode,
                    });

                    return (
                      <div key={line.id} className="group relative flex flex-col md:flex-row gap-12 p-10 rounded-[4rem] bg-white/40 backdrop-blur-3xl border border-white/60 shadow-xl hover:bg-white/50 transition-all duration-700">
                        <div className="relative w-full md:w-64 aspect-[3/4] rounded-[3rem] overflow-hidden border-2 border-white/80 flex-shrink-0 shadow-2xl transition-transform duration-1000 group-hover:scale-105">
                          {merchandise.image && (
                            <Image
                              src={merchandise.image.url}
                              alt={merchandise.image.altText || ""}
                              fill
                              className="object-cover group-hover:rotate-2 transition-transform duration-[2s]"
                            />
                          )}
                          <div className="absolute top-6 left-6 px-4 py-1.5 bg-indigo-950/80 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/10 z-10">
                             Item ID-{line.id.slice(-4)}
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col pt-4">
                          <div className="flex justify-between items-start mb-10">
                            <div className="max-w-[70%]">
                              <Link href={`/products/${merchandise.product.handle}`} className="group-hover:text-indigo-600 transition-colors">
                                <h3 className="text-4xl font-black leading-[1] uppercase tracking-tighter text-indigo-950 italic group-hover:underline decoration-indigo-200 decoration-8 underline-offset-8 transition-all">
                                  {merchandise.product.title}
                                </h3>
                              </Link>
                              <div className="flex flex-wrap gap-4 mt-8">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] bg-white/60 px-5 py-2 rounded-full border border-white/60 shadow-sm">{merchandise.title}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white/60 px-5 py-2 rounded-full border border-white/60 shadow-sm">Protocol Status: Optimal</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-4xl tracking-tighter text-indigo-900 italic underline decoration-indigo-200 decoration-4">{price}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Base Valuation</p>
                            </div>
                          </div>
                          
                          <div className="mt-auto flex items-center justify-between gap-8 flex-wrap">
                            <div className="flex items-center gap-8">
                              <div className="flex items-center bg-indigo-950 text-white rounded-3xl px-10 py-5 gap-10 shadow-2xl">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Quantity</span>
                                <span className="text-lg font-black italic">{line.quantity}</span>
                              </div>
                              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-all flex items-center gap-4 bg-white/40 px-8 py-5 rounded-3xl border border-white/60 hover:bg-white hover:shadow-xl group/trash">
                                <Trash2 className="w-5 h-5 group-hover/trash:rotate-12 transition-transform" />
                                Decommission
                              </button>
                            </div>
                            
                            <div className="flex gap-4">
                               <button className="p-5 bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl hover:bg-indigo-600 hover:text-white transition-all text-indigo-950 shadow-xl group/heart">
                                  <Heart className="w-6 h-6 group-hover/heart:fill-current group-hover/heart:scale-110 transition-all" />
                               </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Extended Manifest Recommendations */}
                <div className="pt-32 relative">
                   <div className="flex items-center justify-between mb-16">
                      <h2 className="text-4xl font-black uppercase tracking-tighter italic text-indigo-950 underline decoration-indigo-200 decoration-8 underline-offset-8">Complementary Units</h2>
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400">Archive Suggestions</span>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                     {[1, 2, 3].map((i) => (
                       <div key={i} className="space-y-8 group cursor-pointer relative">
                          <div className="aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-white/20 backdrop-blur-3xl border-2 border-white/60 shadow-xl group-hover:scale-105 transition-all duration-[1s]">
                             <div className="w-full h-full bg-indigo-950/5 flex items-center justify-center">
                                <Plus className="w-12 h-12 text-indigo-200 group-hover:rotate-90 transition-transform duration-700" />
                             </div>
                             <div className="absolute inset-x-0 bottom-0 p-8 bg-white/40 backdrop-blur-xl translate-y-full group-hover:translate-y-0 transition-transform duration-700 border-t border-white/60">
                                <Button className="w-full bg-indigo-600 text-[9px] font-black uppercase tracking-[0.3em] rounded-full h-12 shadow-2xl">Deploy Asset</Button>
                             </div>
                          </div>
                          <div className="px-6">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-950 mb-2">Refined Attachment // {i}</h4>
                             <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] italic">$75.00</p>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Secure Transaction Column */}
              <div className="lg:col-span-4">
                <div className="bg-white/40 backdrop-blur-[60px] rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(79,70,229,0.15)] border-2 border-white/80 p-12 lg:p-16 sticky top-32 overflow-hidden transition-all duration-700 hover:shadow-[0_80px_150px_-30px_rgba(79,70,229,0.25)]">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
                  
                  <h2 className="relative text-5xl font-black mb-16 uppercase tracking-tighter text-indigo-950 italic leading-none">Voucher</h2>
                  
                  <div className="space-y-10 mb-16 relative">
                    <div className="flex justify-between items-center bg-white/60 p-8 rounded-[2rem] border border-white/80 shadow-inner group">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-indigo-400 transition-colors">Net Valuation</span>
                      <span className="text-indigo-950 font-black text-2xl italic">
                        {parseFloat(cart.cost.subtotalAmount.amount).toLocaleString("en-US", {
                          style: "currency",
                          currency: cart.cost.subtotalAmount.currencyCode,
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center px-8">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Logistic Protocol</span>
                       <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 italic">Complementary</span>
                       </div>
                    </div>
                    
                    <div className="h-px bg-white/60 mx-4"></div>
                    
                    <div className="pt-6 px-4">
                        <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Total Investment</span>
                        <div className="bg-indigo-950 text-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] skew-x-[-8deg] relative overflow-hidden group/total">
                           <div className="absolute inset-0 bg-indigo-600/20 translate-x-full group-hover/total:translate-x-0 transition-transform duration-1000"></div>
                           <span className="relative z-10 text-6xl lg:text-7xl font-black tracking-tighter italic skew-x-[8deg] leading-none block">
                                {parseFloat(cart.cost.totalAmount.amount).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: cart.cost.totalAmount.currencyCode,
                                })}
                           </span>
                        </div>
                    </div>
                  </div>

                  <Button asChild className="w-full h-28 text-[11px] font-black uppercase tracking-[0.4em] rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(79,70,229,0.5)] hover:shadow-none hover:scale-[0.98] transition-all bg-indigo-600 border-none relative overflow-hidden group/checkout" size="lg">
                    <a href={cart.checkoutUrl} className="flex items-center justify-between px-12 relative z-10">
                      <span>Begin Clearance</span>
                      <div className="flex items-center gap-2 group-hover:translate-x-4 transition-transform duration-500">
                         <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                         <ArrowRight className="w-8 h-8" />
                      </div>
                      <div className="absolute inset-0 bg-black translate-y-full group-hover/checkout:translate-y-0 transition-transform duration-500 opacity-20"></div>
                    </a>
                  </Button>
                  
                  <div className="mt-16 grid grid-cols-2 gap-6 px-4">
                    <div className="flex flex-col gap-4 items-center bg-white/50 p-6 rounded-[2rem] border border-white/80 group">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-white flex items-center justify-center group-hover:rotate-12 transition-transform shadow-xl">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 whitespace-nowrap">Encrypted Architecture</span>
                    </div>
                    <div className="flex flex-col gap-4 items-center bg-white/50 p-6 rounded-[2rem] border border-white/80 group">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-400 text-white flex items-center justify-center group-hover:-rotate-12 transition-transform shadow-xl">
                            <Zap className="w-6 h-6" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 whitespace-nowrap">Streamlined Flow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
