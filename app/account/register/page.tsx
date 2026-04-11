import { HeadphonesIcon, Star, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomer } from "@/app/actions/customer";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const customer = await getCustomer();

  if (customer) {
    redirect("/account");
  }

  return (
    <div className="min-h-screen flex bg-slate-50 selection:bg-indigo-600 selection:text-white">
      {/* ── Left Panel — Brand ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] relative bg-indigo-950 flex-col justify-between p-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="relative z-10">
          <span className="text-white font-bold text-xl tracking-tight">
            Reboot<span className="text-indigo-400">X</span>
          </span>
        </Link>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Join thousands of
            <br />
            <span className="text-indigo-300">happy customers.</span>
          </h2>
          <p className="text-indigo-200/70 text-sm leading-relaxed max-w-xs">
            Create your free account to unlock faster checkout, order tracking,
            and exclusive member benefits.
          </p>

          {/* Benefits */}
          <div className="mt-10 space-y-4">
            {[
              { icon: Zap, text: "One-click checkout on all future orders" },
              { icon: Star, text: "Early access to restocks and new arrivals" },
              { icon: HeadphonesIcon, text: "Priority customer support" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-800/60 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-indigo-300" />
                </div>
                <span className="text-sm text-indigo-200/80">{text}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-10 bg-indigo-900/50 rounded-2xl p-5 border border-indigo-800/50">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`star-${i}`}
                  className="w-3.5 h-3.5 fill-indigo-300 text-indigo-300"
                />
              ))}
            </div>
            <p className="text-sm text-indigo-200/90 leading-relaxed italic">
              &ldquo;The whole process was seamless. My refurbished laptop
              arrived perfectly and the account portal is so easy to use.&rdquo;
            </p>
            <p className="text-xs text-indigo-400 mt-2 font-medium">
              — Ahmed R., verified buyer
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs text-indigo-400/60">
          © {new Date().getFullYear()} RebootX — Premium Refurbished Laptops
        </p>
      </div>

      {/* ── Right Panel — Form ───────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-4">
          <Link href="/">
            <span className="font-bold text-lg text-indigo-950 tracking-tight">
              Reboot<span className="text-indigo-600">X</span>
            </span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                Create your account
              </h1>
              <p className="text-sm text-slate-500 mt-1.5">
                Free forever — no credit card required to sign up.
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100/80 p-8">
              <RegisterForm />
            </div>

            {/* Sign in link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/account/login"
                  className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="underline hover:text-slate-600 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline hover:text-slate-600 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
