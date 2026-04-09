import { getOrder } from "@/app/actions/customer";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { 
  ChevronLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Truck, 
  Check,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    redirect("/account");
  }

  const customer = order.customer || { firstName: "Customer", lastName: "" };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 overflow-hidden relative selection:bg-indigo-600 selection:text-white">
      {/* Cinematic Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[150px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[200px] -z-10 delay-700"></div>

      <Header />
      
      <main className="flex-1 py-12 lg:py-24 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Back Navigation Protocol */}
          <div className="mb-16">
            <Link href="/account" className="group inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black hover:bg-white transition-all shadow-xl">
               <ChevronLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
               Archive Dashboard
            </Link>
          </div>

          <div className="mb-24 flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/40 backdrop-blur-3xl p-12 lg:p-20 rounded-[5rem] border-2 border-white shadow-[0_80px_150px_-30px_rgba(0,0,0,0.1)] relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]"></div>
             <div className="relative z-10 text-center lg:text-left">
                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em] mb-6 block italic">Acquisition Verified</span>
                <div className="flex flex-col lg:flex-row items-center gap-10">
                   <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase text-indigo-950 italic underline decoration-indigo-200 decoration-[16px] underline-offset-[12px] leading-none block">
                      Manifest #{order.orderNumber}
                   </h1>
                   <div className={cn(
                      "text-[10px] font-black uppercase tracking-[0.4em] px-10 py-4 rounded-full shadow-2xl border-2 border-white/80 backdrop-blur-xl scale-110",
                      order.financialStatus === "PAID" ? "bg-green-100/60 text-green-700" : "bg-amber-100/60 text-amber-700"
                   )}>
                      {order.financialStatus} Protocol
                   </div>
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-16 flex items-center justify-center lg:justify-start gap-4">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  Processed at Source: {new Date(order.processedAt).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric"
                  })}
                </p>
             </div>
             
             <div className="flex flex-wrap gap-8 relative z-10 lg:skew-x-[-12deg]">
                <Button variant="outline" className="rounded-[2.5rem] h-24 px-12 text-[10px] font-black uppercase tracking-[0.3em] border-2 bg-white/60 backdrop-blur-md border-white/80 hover:bg-black hover:text-white transition-all shadow-2xl lg:skew-x-[12deg]">
                   Export Proof
                </Button>
                <Button className="rounded-[2.5rem] h-24 px-12 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.5)] bg-indigo-600 border-none hover:bg-black transition-all lg:skew-x-[12deg]">
                   Real-time Logistics
                </Button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Manifest Itemization */}
            <div className="lg:col-span-8 space-y-16">
              <div className="bg-white/40 backdrop-blur-[60px] rounded-[5rem] p-12 lg:p-20 shadow-2xl border-2 border-white relative overflow-hidden group/manifest">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] group-hover/manifest:bg-indigo-500/10 transition-colors duration-1000"></div>
                <h2 className="relative text-4xl font-black uppercase tracking-tighter mb-20 italic text-indigo-950 underline decoration-indigo-200 decoration-8 underline-offset-8">Unit Summary</h2>
                <div className="space-y-16 relative">
                  {order.lineItems.edges.map((edge: any) => {
                    const item = edge.node;
                    return (
                      <div key={item.variant.id} className="flex flex-col md:flex-row gap-16 group/item">
                        <div className="relative w-48 h-64 rounded-[3.5rem] overflow-hidden bg-white border-2 border-white/80 flex-shrink-0 group-hover/item:scale-105 group-hover/item:rotate-2 transition-all duration-[1.5s] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
                          {item.variant.image ? (
                            <Image
                              src={item.variant.image.url}
                              alt={item.variant.image.altText || item.title}
                              fill
                              className="object-cover group-hover/item:scale-110 transition-transform duration-[2s]"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-indigo-100 bg-indigo-950">
                               <Package className="w-16 h-16" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center pt-4">
                          <div className="flex justify-between items-start mb-8 gap-8">
                            <div>
                               <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] mb-3 block">SKU-{item.variant.id.slice(-6).toUpperCase()}</span>
                               <h3 className="text-4xl font-black uppercase tracking-tighter text-indigo-950 italic group-hover/item:underline decoration-indigo-200 decoration-8 underline-offset-8 transition-all">{item.title}</h3>
                               <p className="text-[10px] font-black text-slate-400 mt-6 uppercase tracking-[0.3em] bg-white/60 px-6 py-2 rounded-full border border-white/60 inline-block shadow-sm">{item.variant.title}</p>
                            </div>
                            <div className="text-right">
                               <p className="font-black text-4xl tracking-tighter text-indigo-900 italic underline decoration-indigo-200 decoration-4">
                                {parseFloat(item.variant.price.amount).toLocaleString("en-US", {
                                  style: "currency",
                                  currency: item.variant.price.currencyCode,
                                })}
                               </p>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Unit Valuation</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8 mt-6">
                             <div className="px-8 py-5 bg-indigo-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                                Units Captured: {item.quantity}
                             </div>
                             <Link href={`/products/${item.variant.product.handle}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-indigo-600 transition-all group/link flex items-center gap-3">
                                Reacquire Item <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                             </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Logistic Timeline Terminal */}
              <div className="bg-white/40 backdrop-blur-[60px] rounded-[5rem] p-12 lg:p-20 shadow-2xl border-2 border-white relative overflow-hidden group/timeline">
                 <div className="absolute inset-x-0 bottom-0 h-48 bg-indigo-500/5 blur-[100px]"></div>
                 <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 italic text-indigo-950 relative underline decoration-indigo-200 decoration-8 underline-offset-8">Logistic Feedback</h2>
                 <div className="space-y-16 relative">
                    <div className="flex gap-12 relative">
                       <div className="absolute left-[34px] top-16 bottom-0 w-1 bg-indigo-600/10"></div>
                       <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center flex-shrink-0 relative z-10 shadow-[0_25px_50px_-15px_rgba(79,70,229,0.5)] group-hover/timeline:rotate-12 transition-transform duration-700">
                          <Check className="text-white w-10 h-10" />
                       </div>
                       <div className="pt-2">
                          <h4 className="font-black text-xl uppercase tracking-[0.2em] mb-4 text-indigo-950">Resource Confirmed</h4>
                          <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-sm uppercase tracking-widest italic opacity-60">Physical manifestation successful. Archive updated.</p>
                       </div>
                    </div>
                    <div className="flex gap-12 relative opacity-40">
                       <div className="w-20 h-20 rounded-[2rem] bg-white border-2 border-white/80 flex items-center justify-center flex-shrink-0 relative z-10 shadow-xl backdrop-blur-md">
                          <Truck className="text-slate-300 w-10 h-10" />
                       </div>
                       <div className="pt-2">
                          <h4 className="font-black text-xl uppercase tracking-[0.2em] mb-4 text-slate-400">Transit Protocol</h4>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] italic">Projection Window: Pending Terminal Update</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Financial & Node Breakdown Sidebar */}
            <div className="lg:col-span-4 space-y-16">
              <div className="bg-white/40 backdrop-blur-[80px] rounded-[5rem] p-12 lg:p-16 shadow-2xl border-2 border-white relative overflow-hidden group/summary">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                <h3 className="relative text-3xl font-black uppercase tracking-tighter mb-16 italic text-indigo-950 leading-none">Voucher</h3>
                <div className="space-y-10 mb-16 relative">
                  <div className="flex justify-between items-center bg-white/60 p-8 rounded-[2.5rem] border border-white shadow-inner group/val">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover/val:text-indigo-400 transition-colors">Net Valuation</span>
                    <span className="font-black text-2xl text-indigo-950 italic">
                      {parseFloat(order.totalPrice.amount).toLocaleString("en-US", {
                        style: "currency",
                        currency: order.totalPrice.currencyCode,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-8">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Logistics</span>
                    <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] bg-white/80 px-6 py-2 rounded-full border border-white/80 shadow-2xl">Terminal Free</span>
                  </div>
                  <div className="flex justify-between items-center px-8">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Levy</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950">Amalgamated</span>
                  </div>
                  <div className="h-px bg-white/80 mx-4"></div>
                  <div className="pt-8 px-4">
                      <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8">Total Investment</span>
                      <div className="bg-indigo-950 text-white p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] skew-x-[-12deg] relative group/total overflow-hidden">
                         <div className="absolute inset-0 bg-indigo-600/20 translate-x-full group-hover/total:translate-x-0 transition-transform duration-1000"></div>
                         <span className="relative z-10 text-5xl lg:text-6xl font-black tracking-tighter italic skew-x-[12deg] leading-none block">
                            {parseFloat(order.totalPrice.amount).toLocaleString("en-US", {
                               style: "currency",
                               currency: order.totalPrice.currencyCode,
                            })}
                         </span>
                      </div>
                  </div>
                </div>
              </div>

              {/* Node Destination Card */}
              <div className="bg-white/40 backdrop-blur-[60px] rounded-[5rem] p-12 lg:p-16 shadow-2xl border-2 border-white relative overflow-hidden group/destination">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px]"></div>
                <h3 className="relative text-3xl font-black uppercase tracking-tighter mb-16 italic text-indigo-950">Node Registry</h3>
                <div className="space-y-12 relative">
                   <div className="flex flex-col gap-10 group/item">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-950 text-white flex items-center justify-center border-2 border-white/20 flex-shrink-0 shadow-2xl group-hover/destination:rotate-12 transition-transform duration-700">
                           <MapPin className="w-8 h-8" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Terminal Address</h4>
                      </div>
                      <div className="relative">
                         <div className="text-xl font-black uppercase tracking-tighter text-indigo-950 italic mb-6 leading-none">{customer.firstName} {customer.lastName}</div>
                         {order.shippingAddress ? (
                           <div className="bg-white/60 p-10 rounded-[3rem] border-2 border-white shadow-inner text-sm font-bold leading-relaxed text-indigo-900/60 uppercase tracking-widest italic">
                             <p className="text-indigo-950 not-italic font-black text-xl mb-3">{order.shippingAddress.address1}</p>
                             {order.shippingAddress.address2 && <p className="mb-2">{order.shippingAddress.address2}</p>}
                             <p>{order.shippingAddress.city}, {order.shippingAddress.provinceCode} {order.shippingAddress.zip}</p>
                             <div className="w-full h-px bg-indigo-200/40 my-6"></div>
                             <p className="text-indigo-600 font-black">{order.shippingAddress.country} // SECTOR-7</p>
                           </div>
                         ) : (
                           <p className="italic text-gray-400">No destination specified</p>
                         )}
                      </div>
                   </div>
                   
                   <div className="flex flex-col gap-10 group/item">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-400 text-white flex items-center justify-center border-2 border-white/20 flex-shrink-0 shadow-2xl group-hover/destination:-rotate-12 transition-transform duration-700">
                           <CreditCard className="w-8 h-8" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Payment Authorization</h4>
                      </div>
                      <div className="bg-white/60 p-10 rounded-[3rem] border-2 border-white shadow-inner">
                        <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] mb-4 block">Current State</span>
                        <p className="text-2xl font-black uppercase tracking-tighter text-indigo-950 italic mb-6 leading-none underline decoration-indigo-200 decoration-8 underline-offset-8">{order.financialStatus}</p>
                        <div className="flex items-center gap-4 bg-indigo-950/5 p-4 rounded-2xl border border-white">
                           <div className="w-10 h-7 bg-black rounded flex items-center justify-center text-[7px] text-white font-black tracking-[0.3em] uppercase">VISA</div>
                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Archive Match: **** 4242</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
