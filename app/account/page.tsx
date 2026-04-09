import { getCustomer } from "@/app/actions/customer";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Package, 
  History as HistoryIcon, 
  MapPin, 
  CreditCard,
  LogOut,
  ArrowRight
} from "lucide-react";

export default async function AccountPage() {
  const customer = await getCustomer();

  if (!customer) {
    redirect("/account/login");
  }

  const orders = customer.orders;

  return (
    <div className="min-h-screen flex flex-col text-slate-900 overflow-hidden relative selection:bg-indigo-600 selection:text-white">
      {/* Cinematic Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[150px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[200px] -z-10 delay-700"></div>

      <Header />
      
      <main className="flex-1 py-12 lg:py-24 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Dashboard Header Protocol */}
          <div className="mb-24 p-12 lg:p-16 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white/60 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]"></div>
            <div className="relative z-10">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em] mb-6 block">Member Status: Elite</span>
              <h1 className="text-7xl lg:text-9xl font-black tracking-tighter uppercase text-indigo-950 italic leading-[0.8] underline decoration-indigo-200 decoration-[16px] underline-offset-[12px]">
                 Greetings, {customer.firstName}
              </h1>
              <p className="text-slate-500 mt-16 font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">
                Authorized entry to the premium resource network
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            
            {/* Sidebar - Terminal Navigation */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-white/40 backdrop-blur-[60px] rounded-[4rem] p-12 border-2 border-white/80 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px]"></div>
                
                <div className="relative flex flex-col items-center lg:items-start mb-16">
                  <div className="w-40 h-40 rounded-[3rem] bg-indigo-950 flex items-center justify-center text-white text-5xl font-black shadow-[0_30px_60px_-15px_rgba(49,46,129,0.5)] mb-10 border-4 border-white group-hover:rotate-6 transition-all duration-1000">
                    {customer.firstName?.[0]}{customer.lastName?.[0]}
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-indigo-950 italic">{customer.firstName} {customer.lastName}</h2>
                  <div className="flex items-center gap-3 mt-4">
                     <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                     <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">{customer.email}</p>
                  </div>
                  
                  <div className="w-full grid grid-cols-2 gap-4 mt-12">
                    <div className="bg-indigo-950 text-white p-6 rounded-[2rem] shadow-2xl skew-x-[-12deg] group/stat">
                       <p className="text-[8px] font-black uppercase tracking-widest mb-2 opacity-40 skew-x-[12deg]">Tier</p>
                       <p className="text-sm font-black uppercase skew-x-[12deg]">Platinum</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm skew-x-[-12deg] group/stat">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 skew-x-[12deg]">Assets</p>
                       <p className="text-sm font-black text-indigo-950 uppercase skew-x-[12deg]">{orders.nodes.length} Items</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: HistoryIcon, label: "Asset History", active: true },
                    { icon: MapPin, label: "Node Addresses", active: false },
                    { icon: CreditCard, label: "Vault Parameters", active: false },
                    { icon: LogOut, label: "Terminate Session", active: false, action: "/api/auth/logout" }
                  ].map((item) => (
                    <button 
                      key={item.label}
                      className={cn(
                        "w-full flex items-center justify-between p-6 rounded-[2rem] transition-all font-black text-[10px] uppercase tracking-[0.3em] group/nav relative overflow-hidden",
                        item.active 
                          ? "bg-indigo-600 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] skew-x-[-12deg]" 
                          : "text-slate-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-white/60"
                      )}
                    >
                      <span className={cn("flex items-center gap-6", item.active && "skew-x-[12deg]")}>
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </span>
                      {item.active && <div className="w-2 h-2 bg-white rounded-full animate-ping skew-x-[12deg]"></div>}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Content Area - Resource Manifest */}
            <div className="lg:col-span-8">
              <div className="bg-white/40 backdrop-blur-[60px] rounded-[4.5rem] p-12 lg:p-20 border-2 border-white/80 shadow-2xl h-full relative overflow-hidden group/content">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] group-hover/content:bg-indigo-500/10 transition-colors duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
                    <div>
                      <h2 className="text-6xl font-black uppercase tracking-tighter text-indigo-950 italic underline decoration-indigo-200 decoration-[12px] underline-offset-8">Archive</h2>
                      <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-6 opacity-60">Log of all historical material acquisitions</p>
                    </div>
                    <Button variant="outline" className="rounded-full h-16 px-10 text-[9px] font-black uppercase tracking-[0.3em] border-2 bg-white/60 backdrop-blur-md border-white hover:bg-indigo-950 hover:text-white transition-all shadow-xl">
                       Global Shipment Tracking
                    </Button>
                  </div>

                  {orders.nodes.length === 0 ? (
                    <div className="bg-white/30 backdrop-blur-md rounded-[4rem] p-24 text-center border-2 border-dashed border-white/60 group/empty">
                      <div className="w-24 h-24 bg-white/80 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-white group-hover/empty:scale-110 transition-transform">
                        <Package className="w-12 h-12 text-indigo-200" />
                      </div>
                      <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Manifest remains unoccupied</p>
                      <Link href="/shop" className="mt-12 group inline-block text-white font-black uppercase tracking-[0.3em] text-[10px] bg-indigo-600 px-12 py-6 rounded-full hover:bg-black transition-all shadow-2xl">
                         <span className="flex items-center gap-4">Initialize Acquisition <ArrowRight className="w-4 h-4" /></span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {orders.nodes.map((order: any) => (
                        <Link 
                          href={`/account/orders/${order.id.split("/").pop()}`} 
                          key={order.id}
                          className="group/order block"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between p-10 rounded-[3.5rem] bg-white/50 backdrop-blur-xl border-2 border-white shadow-xl hover:bg-white hover:translate-y-[-8px] transition-all duration-700 relative overflow-hidden">
                            <div className="absolute inset-y-0 right-0 w-24 bg-indigo-950 opacity-0 group-hover/order:opacity-5 transition-opacity"></div>
                            
                            <div className="flex items-center gap-10 relative z-10">
                              <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-950 text-white shadow-2xl flex items-center justify-center border-2 border-white/20 group-hover/order:rotate-12 transition-transform duration-700">
                                <Package className="w-10 h-10" />
                              </div>
                              <div className="text-left">
                                <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] mb-2 block">Protocol-00{order.orderNumber}</span>
                                <h3 className="font-black text-2xl uppercase tracking-tighter text-indigo-950 italic">Acquisition Manifest</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 bg-white/40 px-4 py-1.5 rounded-full border border-white/40 inline-block">
                                  {new Date(order.processedAt).toLocaleDateString("en-US", {
                                    month: "long", day: "numeric", year: "numeric"
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-5 mt-10 md:mt-0 relative z-10">
                               <span className="text-4xl font-black text-indigo-900 tracking-tighter italic group-hover/order:scale-110 transition-transform underline decoration-indigo-200 decoration-4">
                                  {parseFloat(order.totalPrice.amount).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: order.totalPrice.currencyCode,
                                  })}
                               </span>
                               <div className="flex items-center gap-4">
                                 <span className={cn(
                                   "text-[9px] font-black uppercase tracking-[0.4em] px-6 py-2.5 rounded-full shadow-lg border border-white/60 backdrop-blur-md",
                                   order.financialStatus === "PAID" ? "bg-green-100/40 text-green-700" : "bg-amber-100/40 text-amber-700"
                                 )}>
                                   {order.financialStatus}
                                 </span>
                                 <ArrowRight className="w-5 h-5 text-indigo-200 group-hover/order:translate-x-3 transition-transform duration-500" />
                               </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
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
