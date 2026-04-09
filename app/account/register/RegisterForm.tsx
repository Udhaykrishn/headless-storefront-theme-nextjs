"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { ShoppingBag, ChevronRight } from "lucide-react";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleRegister = () => {
    // For passwordless auth, register and login are often the same flow
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="w-full">
      {error && (
        <div className="p-6 mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-100/60 backdrop-blur-md rounded-[2rem] border border-red-200 flex items-center justify-center animate-shake">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-4 flex-shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <div className="space-y-12">
        <div className="bg-white/50 backdrop-blur-xl p-10 lg:p-12 rounded-[3.5rem] border border-white/60 shadow-2xl relative group">
           <div className="absolute -top-10 -left-10 w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white group-hover:rotate-12 transition-transform duration-500">
              <ShoppingBag className="w-8 h-8 text-white" />
           </div>
           
           <div className="pt-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-indigo-950 italic mb-4">Secured Access</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] leading-relaxed">
                 We use Shopify's modern encrypted authentication. No passwords to remember, just pure secure access.
              </p>
           </div>
           
           <Button
             onClick={handleRegister}
             className="w-full h-24 mt-12 text-sm font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(79,70,229,0.3)] hover:shadow-none hover:scale-[0.98] transition-all bg-indigo-600 border-none group/btn"
           >
             <span className="flex items-center gap-6">
                Register with Shopify 
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
             </span>
           </Button>
        </div>

        <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] leading-relaxed px-10">
          Enrolling signifies agreement with the <span className="text-indigo-600 hover:text-black cursor-pointer underline underline-offset-4 decoration-indigo-200 hover:decoration-black transition-colors">Terms of Artistry</span> & <span className="text-indigo-600 hover:text-black cursor-pointer underline underline-offset-4 decoration-indigo-200 hover:decoration-black transition-colors">Privacy Doctrine</span>.
        </p>
      </div>
    </div>
  );
}
