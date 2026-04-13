"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, Loader2, Save } from "lucide-react";
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
        <label htmlFor="address1" className="text-xs font-semibold text-slate-600 block">
          Address <span className="text-red-400">*</span>
        </label>
        <Input 
          id="address1" 
          name="address1" 
          required 
          placeholder="Street address" 
          className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4" 
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="address2" className="text-xs font-semibold text-slate-600 block">
          Apartment, suite, etc. (optional)
        </label>
        <Input 
          id="address2" 
          name="address2" 
          placeholder="Apt 4B" 
          className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4" 
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="city" className="text-xs font-semibold text-slate-600 block">
            City <span className="text-red-400">*</span>
          </label>
          <Input 
            id="city" 
            name="city" 
            required 
            className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4" 
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="province" className="text-xs font-semibold text-slate-600 block">
            State <span className="text-red-400">*</span>
          </label>
          <select 
            id="province" 
            name="province" 
            required 
            className="w-full h-11 rounded-xl bg-white border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-3 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled selected>Select State</option>
            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
            <option value="Daman and Diu">Daman and Diu</option>
            <option value="Delhi">Delhi</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Puducherry">Puducherry</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="zip" className="text-xs font-semibold text-slate-600 block">
          PIN code <span className="text-red-400">*</span>
        </label>
        <Input 
          id="zip" 
          name="zip" 
          required 
          placeholder="400001" 
          className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4" 
        />
      </div>
      
      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-xs font-semibold text-slate-600 block">
          Phone
        </label>
        <Input 
          id="phone" 
          name="phone" 
          placeholder="Optional" 
          className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4" 
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-500/30 transition-all h-11"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isPending ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  );
}
