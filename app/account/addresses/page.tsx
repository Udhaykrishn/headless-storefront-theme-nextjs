import { ChevronLeft, MapPin, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomerToken, deleteCustomerAddress } from "@/app/actions/customer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { shopifyClient, GET_CUSTOMER_ADDRESSES_QUERY } from "@/lib/shopify";
import AddressForm from "./address-form";
import AddressDeleteButton from "./address-delete-button";

export default async function AddressesPage() {
  const token = await getCustomerToken();

  if (!token) {
    redirect("/account/login");
  }

  let addresses: any[] = [];
  try {
    const data = await shopifyClient.request<{
      customer: {
        addresses: { edges: Array<{ node: any }> };
      };
    }>(GET_CUSTOMER_ADDRESSES_QUERY, { customerAccessToken: token });
    
    addresses = data.customer?.addresses?.edges?.map(e => e.node) || [];
  } catch (err) {
    console.error("Failed to load addresses", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Gradient backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-indigo-50 via-purple-50/40 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-indigo-100/30 blur-[100px]" />
      </div>

      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
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
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 px-8 py-6 mb-6 flex items-center justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 shadow shadow-indigo-200/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-0.5">
                Saved Locations
              </p>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                Addresses
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage your shipping and billing addresses
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Saved Addresses */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Saved Addresses</h2>
            {addresses.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-dashed border-indigo-200 shadow-sm p-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4 text-indigo-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-700 mb-1">No addresses saved</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  You haven't saved any addresses yet. Add a new address to make checkout faster.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {addresses.map((address) => (
                  <div key={address.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative group hover:border-indigo-200 hover:shadow-md transition-all">
                    <h3 className="text-base font-bold text-slate-800 mb-1">
                      {address.firstName} {address.lastName}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {address.address1} {address.address2 ? `, ${address.address2}` : ""}
                    </p>
                    <p className="text-sm text-slate-600">
                      {address.city}, {address.province} {address.zip}
                    </p>
                    <p className="text-sm text-slate-600 mb-3">{address.country}</p>
                    {address.phone && (
                      <p className="text-xs font-medium text-slate-500">Phone: {address.phone}</p>
                    )}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <AddressDeleteButton addressId={address.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Add Address Form */}
          <div className="lg:col-span-5">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 p-6 sticky top-24">
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

      </main>

      <Footer />
    </div>
  );
}
