"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { UserPlus, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleRegister = () => {
    // Passwordless auth — same OAuth flow as login
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="w-full space-y-5">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* What you get */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <p className="text-sm font-semibold text-indigo-900">What you get for free</p>
        </div>
        <ul className="space-y-2">
          {[
            "Order history & tracking dashboard",
            "Faster checkout with saved details",
            "Early access to restocks",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-indigo-700/80">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA button */}
      <Button
        onClick={handleRegister}
        className="w-full h-12 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/30 transition-all gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Create Account with Shopify
      </Button>

      {/* Trust row */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-400">Secured by Shopify — no password needed</span>
      </div>
    </div>
  );
}
