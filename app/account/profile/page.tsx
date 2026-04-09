import { getCustomer } from "@/app/actions/customer";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProfileForm from "@/app/account/profile/profile-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ProfilePage() {
  const customer = await getCustomer();

  if (!customer) {
    redirect("/account/login");
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-900 overflow-hidden relative selection:bg-indigo-600 selection:text-white">
      {/* Cinematic Background Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px] -z-10"></div>

      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-12 py-12 lg:py-24 w-full relative z-10">
        <Link 
          href="/account" 
          className="group inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black hover:bg-white transition-all mb-16 shadow-xl"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
          Dashboard Protocol
        </Link>

        <div className="bg-white/40 backdrop-blur-[60px] rounded-[5rem] shadow-[0_80px_150px_-30px_rgba(79,70,229,0.2)] border-2 border-white/80 p-12 md:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] group-hover:bg-indigo-500/10 transition-colors duration-1000"></div>
            
            <div className="relative z-10">
                <div className="mb-20">
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em] mb-6 block">Identity Management</span>
                    <h1 className="text-7xl lg:text-8xl font-black tracking-tighter uppercase text-indigo-950 italic underline decoration-indigo-200 decoration-[16px] underline-offset-[12px] mb-8">Edit Identity</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">Reconfigure your personal parameters within the collection</p>
                </div>
                
                <div className="p-1 w-full">
                    <ProfileForm customer={customer!} />
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
