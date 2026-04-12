"use client";

import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createCustomerAddress } from "@/app/actions/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddressForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    createCustomerAddress,
    null as { success?: boolean; error?: string } | null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Address added successfully");
      router.refresh();
      // Optionally reset form
      const form = document.getElementById("address-form") as HTMLFormElement;
      if (form) form.reset();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form id="address-form" action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="text-xs font-semibold text-slate-600 block">
            First Name <span className="text-red-400">*</span>
          </label>
          <Input id="firstName" name="firstName" required className="h-10 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="lastName" className="text-xs font-semibold text-slate-600 block">
            Last Name <span className="text-red-400">*</span>
          </label>
          <Input id="lastName" name="lastName" required className="h-10 text-sm" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="address1" className="text-xs font-semibold text-slate-600 block">
          Street Address <span className="text-red-400">*</span>
        </label>
        <Input id="address1" name="address1" required placeholder="123 Main St" className="h-10 text-sm" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="address2" className="text-xs font-semibold text-slate-600 block">
          Apartment, suite, etc.
        </label>
        <Input id="address2" name="address2" placeholder="Appt 4B" className="h-10 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="city" className="text-xs font-semibold text-slate-600 block">
            City <span className="text-red-400">*</span>
          </label>
          <Input id="city" name="city" required className="h-10 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="province" className="text-xs font-semibold text-slate-600 block">
            State/Province <span className="text-red-400">*</span>
          </label>
          <Input id="province" name="province" required className="h-10 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="zip" className="text-xs font-semibold text-slate-600 block">
            ZIP/Postal Code <span className="text-red-400">*</span>
          </label>
          <Input id="zip" name="zip" required className="h-10 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="country" className="text-xs font-semibold text-slate-600 block">
            Country <span className="text-red-400">*</span>
          </label>
          <Input id="country" name="country" required defaultValue="United States" className="h-10 text-sm" />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-xs font-semibold text-slate-600 block">
          Phone
        </label>
        <Input id="phone" name="phone" className="h-10 text-sm" />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-500/30 transition-all font-semibold"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {isPending ? "Adding..." : "Add Address"}
        </Button>
      </div>
    </form>
  );
}
