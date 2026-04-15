"use client";

import { AlertCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleRegister = () => {
    // Passwordless auth — same OIDC flow as login, which supports Google
    window.location.href = "/api/auth/login";
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

      {/* Benefits info */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <p className="text-sm font-semibold text-indigo-900">
            Account benefits
          </p>
        </div>
        <ul className="space-y-2">
          {[
            "Order history & real-time tracking",
            "One-tap checkout with saved details",
            "Exclusive member-only restock alerts",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-xs text-indigo-700/80"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Primary Google Button */}
      <Button
        onClick={handleRegister}
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
        </svg>
        <span>Join with Google</span>
      </Button>

      {/* Trust row */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-400">
          Secured by enterprise-grade encryption
        </span>
      </div>
    </div>
  );
}
