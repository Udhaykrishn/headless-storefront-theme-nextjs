"use client";

import { AlertCircle, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleLogin = () => {
    window.location.href = 'https://rebootx-2.account.myshopify.com/authentication/social/google';
  };

  return (
    <div className="w-full space-y-6">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Primary Google Login Button */}
      <Button
        onClick={handleLogin}
        className="w-full h-12 text-sm font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 shadow-sm transition-all gap-3 overflow-hidden group relative"
      >
        <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        <span>Continue with Google</span>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">or</span>
        </div>
      </div>

      {/* Secondary Shopify Login (Subtle) */}
      <button
        onClick={handleLogin}
        className="w-full text-center text-xs text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        Sign in with your Shopify store account
      </button>

      {/* Trust row */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-400">
          Secured by enterprise-grade encryption
        </span>
      </div>
    </div>
  );
}
