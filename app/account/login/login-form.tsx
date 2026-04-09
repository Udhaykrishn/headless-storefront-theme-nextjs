"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { ShoppingBag, ShieldCheck, Zap, Lock } from "lucide-react";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleLogin = () => {
    // Redirect to our internal API route that initiates the OAuth flow
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="w-full">
      {error && (
        <div className="p-6 mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-100/60 backdrop-blur-md rounded-[2rem] border border-red-200 flex items-center justify-center animate-shake">
          <ShieldCheck className="w-5 h-5 mr-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-12">
        <div className="bg-white/50 backdrop-blur-xl p-10 lg:p-14 rounded-[4rem] border border-white/60 shadow-2xl relative group overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
           
           <div className="relative z-10">
              <div className="w-20 h-20 bg-indigo-950 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-2xl border-2 border-white/20 group-hover:rotate-12 transition-transform duration-700">
                 <Lock className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl font-black uppercase tracking-tighter text-indigo-950 italic mb-4">Identity Protocol</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] leading-relaxed max-w-xs">
                 Initialize secure authentication through the Shopify encrypted channel. 
              </p>
              
              <Button
                onClick={handleLogin}
                className="w-full h-24 mt-12 text-sm font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(79,70,229,0.4)] hover:shadow-none hover:scale-[0.98] transition-all bg-indigo-600 border-none group/btn relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-black opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                <span className="flex items-center gap-6 relative z-10">
                   Enter the Vault
                   <Zap className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                </span>
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
           <div className="flex flex-col items-center gap-4 bg-white/40 p-6 rounded-[2.5rem] border border-white/60 shadow-sm group">
              <ShieldCheck className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-400">Encrypted</span>
           </div>
           <div className="flex flex-col items-center gap-4 bg-white/40 p-6 rounded-[2.5rem] border border-white/60 shadow-sm group">
              <ShoppingBag className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-400">Curated</span>
           </div>
        </div>

        <p className="text-center text-[8px] text-slate-400 font-black uppercase tracking-[0.4em] leading-relaxed px-10">
          Authorization grants access to the <span className="text-indigo-400 font-black">Archive Manifest</span>. 
          By continuing, you accept our <span className="underline decoration-indigo-200">System Parameters</span>.
        </p>
      </div>
    </div>
  );
}
