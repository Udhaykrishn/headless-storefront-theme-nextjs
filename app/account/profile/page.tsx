import { ChevronLeft, Mail, Shield, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileForm from "@/app/account/profile/profile-form";
import { getCustomer } from "@/app/actions/customer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default async function ProfilePage() {
  const customer = await getCustomer();

  if (!customer) {
    redirect("/account/login");
  }

  const initials =
    `${customer.firstName?.[0] ?? ""}${customer.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Gradient backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-indigo-50 via-purple-50/40 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-indigo-100/30 blur-[100px]" />
      </div>

      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Back nav */}
        <div className="mb-8">
          <Link
            href="/account"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Account
          </Link>
        </div>

        {/* Header card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 px-8 py-6 mb-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-white flex items-center justify-center text-lg font-bold flex-shrink-0 shadow shadow-indigo-900/30">
            {initials}
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-0.5">
              Account Settings
            </p>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
              Edit Profile
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Update your personal information
            </p>
          </div>
        </div>

        {/* Info cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-md shadow-indigo-100/20 p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                Email
              </p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {customer.email}
              </p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-md shadow-indigo-100/20 p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                Account Status
              </p>
              <p className="text-sm font-semibold text-emerald-700">
                Verified & Active
              </p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 px-8 py-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6">
              <User className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Personal Information
              </h2>
            </div>
            <ProfileForm customer={customer!} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
