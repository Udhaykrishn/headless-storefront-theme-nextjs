"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateCustomerProfile } from "@/app/actions/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileForm({
  customer,
}: {
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
}) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    updateCustomerProfile,
    null as { success?: boolean; error?: string } | null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Profile updated successfully");
      router.refresh();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="firstName"
            className="text-xs font-semibold text-slate-600 block"
          >
            First Name <span className="text-red-400">*</span>
          </label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={customer.firstName}
            placeholder="John"
            required
            className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="lastName"
            className="text-xs font-semibold text-slate-600 block"
          >
            Last Name <span className="text-red-400">*</span>
          </label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={customer.lastName}
            placeholder="Doe"
            required
            className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4 transition-all"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-semibold text-slate-600 block"
        >
          Email Address <span className="text-red-400">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={customer.email}
          placeholder="john@example.com"
          required
          className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4 transition-all"
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label
          htmlFor="phone"
          className="text-xs font-semibold text-slate-600 block"
        >
          Phone Number{" "}
          <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={customer.phone || ""}
          placeholder="+1 234 567 890"
          className="h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm px-4 transition-all"
        />
        <p className="text-xs text-slate-400">
          Used for order delivery notifications
        </p>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button
          type="submit"
          size="default"
          className="gap-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-md shadow-indigo-500/30 transition-all"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
