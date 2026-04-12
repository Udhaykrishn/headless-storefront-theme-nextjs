"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createCustomerAddress } from "@/app/actions/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddressForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, isPending] = useActionState(
    createCustomerAddress,
    null as { success?: boolean; error?: string } | null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Address added successfully");
      formRef.current?.reset();
      router.refresh();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="address1" className="text-xs font-semibold text-slate-600">
          Address Line 1 <span className="text-red-400">*</span>
        </label>
        <Input
          id="address1"
          name="address1"
          placeholder="123 Main St"
          required
          className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="address2" className="text-xs font-semibold text-slate-600">
          Apartment, suite, etc.
        </label>
        <Input
          id="address2"
          name="address2"
          placeholder="Apt 4B"
          className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="city" className="text-xs font-semibold text-slate-600">
            City <span className="text-red-400">*</span>
          </label>
          <Input
            id="city"
            name="city"
            placeholder="Mumbai"
            required
            className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="province" className="text-xs font-semibold text-slate-600">
            State <span className="text-red-400">*</span>
          </label>
          <Input
            id="province"
            name="province"
            placeholder="Maharashtra"
            required
            className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="zip" className="text-xs font-semibold text-slate-600">
            ZIP / Postal Code <span className="text-red-400">*</span>
          </label>
          <Input
            id="zip"
            name="zip"
            placeholder="400001"
            required
            className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-semibold text-slate-600">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4"
          />
        </div>
      </div>

      <input type="hidden" name="country" value="India" />

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 shadow-md shadow-indigo-500/30 transition-all"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isPending ? "Adding Address..." : "Add Address"}
        </Button>
      </div>
    </form>
  );
}
