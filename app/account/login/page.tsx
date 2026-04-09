import { getCustomer } from "@/app/actions/customer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function LoginPage() {
  const customer = await getCustomer();

  if (customer) {
    redirect("/account");
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-900 overflow-hidden relative selection:bg-indigo-600 selection:text-white">
      {/* Cinematic Background Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px] -z-10"></div>

      <Header />
      <main className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-2xl bg-white/40 backdrop-blur-[60px] rounded-[5rem] p-16 lg:p-24 shadow-[0_80px_150px_-30px_rgba(79,70,229,0.2)] border-2 border-white/80 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] group-hover:bg-indigo-500/10 transition-colors duration-1000"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-20">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em] mb-6 block">Access Protocol</span>
              <h1 className="text-8xl lg:text-9xl font-black tracking-tighter uppercase text-indigo-950 italic leading-none underline decoration-indigo-200 decoration-[16px] underline-offset-[12px] mb-12">
                Enter
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">Initialize your premium lifestyle experience</p>
            </div>
            
            <LoginForm />
            
            <div className="mt-20 pt-16 border-t-2 border-white/40 text-center">
               <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[9px] mb-8">New to the archive?</p>
               <Link href="/account/register" className="group inline-block text-white font-black uppercase tracking-[0.3em] text-[10px] bg-indigo-950 px-12 py-6 rounded-full hover:bg-black transition-all shadow-2xl skew-x-[-12deg]">
                  <span className="flex items-center gap-4 skew-x-[12deg]">
                    Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </span>
               </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
