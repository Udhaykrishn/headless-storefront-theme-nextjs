import { ChevronLeft, MapPin, Mail, Shield, User, Plus, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomer, getCustomerToken } from "@/app/actions/customer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { shopifyClient, GET_CUSTOMER_ADDRESSES_QUERY } from "@/lib/shopify";
import ProfileForm from "@/app/account/profile/profile-form";
import AddressForm from "@/app/account/profile/address-form";
import AddressDeleteButton from "@/app/account/profile/address-delete-button";

export default async function CombinedProfilePage() {
  const customer = await getCustomer();
  const token = await getCustomerToken();

  if (!customer || !token) {
    redirect("/account/login");
  }

  let addresses: any[] = [];
  try {
    const data = await shopifyClient.request<{
      customer: {
        addresses: { edges: Array<{ node: any }> };
      };
    }>(GET_CUSTOMER_ADDRESSES_QUERY, { customerAccessToken: token! });
    
    addresses = data.customer?.addresses?.edges?.map(e => e.node) || [];
  } catch (err) {
    console.error("Failed to load addresses", err);
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

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
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
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 px-8 py-6 mb-8 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-white flex items-center justify-center text-lg font-bold flex-shrink-0 shadow shadow-indigo-900/30">
            {initials}
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-0.5">
              Settings
            </p>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
              Profile & Addresses
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your personal information and delivery locations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 px-8 py-8 relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-6">
                  <User className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Personal Details
                  </h2>
                </div>
                <ProfileForm customer={customer!} />
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

          {/* Right Column: Address Management */}
          <div className="lg:col-span-7 space-y-8">
            {/* Saved Addresses List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Saved Addresses
                  </h2>
                </div>
                {addresses.length > 0 && (
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {addresses.length} total
                  </span>
                )}
              </div>

              {addresses.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-dashed border-slate-200 p-8 flex flex-col items-center text-center">
                  <MapPin className="w-8 h-8 text-slate-300 mb-3" />
                  <p className="text-sm text-slate-500">No addresses saved yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="bg-white rounded-2xl border border-slate-200 p-5 relative group hover:border-indigo-200 hover:shadow-sm transition-all">
                      <h3 className="text-sm font-bold text-slate-800 mb-1">
                        {address.address1}
                      </h3>
                      {address.address2 && (
                        <p className="text-xs text-slate-500 mb-1">{address.address2}</p>
                      )}
                      <p className="text-xs text-slate-600">
                        {address.city}, {address.province} {address.zip}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        For: {address.firstName} {address.lastName}
                      </p>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AddressDeleteButton addressId={address.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Address Form Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 px-8 py-8 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-6">
                  <Plus className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Add New Address
                  </h2>
                </div>
                <AddressForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
