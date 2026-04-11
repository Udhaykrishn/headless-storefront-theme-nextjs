"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, LogIn, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleLogin = () => {
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

      {/* Info block */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <LogIn className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm font-semibold text-indigo-900">Single Sign-On via Shopify</p>
        </div>
        <p className="text-xs text-indigo-700/70 leading-relaxed">
          We use Shopify's secure authentication. You'll be redirected to sign in and automatically returned here.
        </p>
      </div>

      {/* CTA button */}
      <Button
        onClick={handleLogin}
        className="w-full h-12 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/30 transition-all gap-2"
      >
        <LogIn className="w-4 h-4" />
        Continue with Shopify
      </Button>

      {/* Trust row */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-400">Secured by Shopify — your data is safe</span>
      </div>
    </div>
  );
}
