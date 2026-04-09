"use client";

import { useActionState, useEffect } from "react";
import { updateCustomerProfile } from "@/app/actions/customer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ customer }: { customer: any }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(updateCustomerProfile, null as any);

  useEffect(() => {
    if (state?.success) {
      toast.success("Identity profile synchronized successfully");
      router.refresh();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-12 max-w-2xl group/form relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic block">Primary Name</label>
          <div className="relative group/input">
            <Input 
              name="firstName" 
              defaultValue={customer.firstName} 
              placeholder="First Name" 
              required 
              className="h-20 rounded-[1.5rem] bg-white/40 backdrop-blur-md border-2 border-white/60 focus:bg-white focus:border-indigo-600 focus:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all px-8 text-sm font-bold placeholder:text-slate-300 placeholder:italic"
            />
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic block">Surname Archive</label>
          <div className="relative group/input">
            <Input 
              name="lastName" 
              defaultValue={customer.lastName} 
              placeholder="Last Name" 
              required 
              className="h-20 rounded-[1.5rem] bg-white/40 backdrop-blur-md border-2 border-white/60 focus:bg-white focus:border-indigo-600 focus:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all px-8 text-sm font-bold placeholder:text-slate-300 placeholder:italic"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic block">Communication Protocol (Email)</label>
        <div className="relative group/input">
          <Input 
            name="email" 
            type="email" 
            defaultValue={customer.email} 
            placeholder="Email Address" 
            required 
            className="h-20 rounded-[2rem] bg-white/40 backdrop-blur-md border-2 border-white/60 focus:bg-white focus:border-indigo-600 focus:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all px-10 text-sm font-bold placeholder:text-slate-300 placeholder:italic"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic block">Neural Link (Phone Optional)</label>
        <div className="relative group/input">
          <Input 
            name="phone" 
            type="tel" 
            defaultValue={customer.phone || ""} 
            placeholder="+1 234 567 890" 
            className="h-20 rounded-[2rem] bg-white/40 backdrop-blur-md border-2 border-white/60 focus:bg-white focus:border-indigo-600 focus:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all px-10 text-sm font-bold placeholder:text-slate-300 placeholder:italic"
          />
        </div>
      </div>

      <div className="pt-10">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full md:w-auto px-16 h-24 text-[11px] font-black uppercase tracking-[0.5em] rounded-[2rem] bg-indigo-950 hover:bg-black transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-center gap-6 skew-x-[-12deg]"
          disabled={isPending}
        >
          <span className="skew-x-[12deg] flex items-center gap-6">
            {isPending && <Loader2 className="h-6 w-6 animate-spin" />}
            Commit Configuration
          </span>
        </Button>
      </div>
    </form>
  );
}
