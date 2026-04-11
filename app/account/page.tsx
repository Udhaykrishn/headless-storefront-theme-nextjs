import {
  ArrowRight,
  ChevronRight,
  Clock,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomer } from "@/app/actions/customer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Package, label: "My Orders", href: "#orders", active: true },
  { icon: User, label: "Profile", href: "/account/profile" },
  { icon: MapPin, label: "Addresses", href: "#addresses" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    PAID: {
      label: "Paid",
      class: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    PENDING: {
      label: "Pending",
      class: "bg-amber-100 text-amber-700 border-amber-200",
    },
    REFUNDED: {
      label: "Refunded",
      class: "bg-red-100 text-red-700 border-red-200",
    },
    PARTIALLY_REFUNDED: {
      label: "Partial Refund",
      class: "bg-orange-100 text-orange-700 border-orange-200",
    },
  };
  const s = map[status] ?? {
    label: status,
    class: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={cn(
        "text-xs font-semibold px-3 py-1 rounded-full border",
        s.class,
      )}
    >
      {s.label}
    </span>
  );
}

export default async function AccountPage() {
  const customer = await getCustomer();
  if (!customer) redirect("/account/login");

  const orders = customer.orders?.edges?.map((edge) => edge.node) ?? [];
  const initials =
    `${customer.firstName?.[0] ?? ""}${customer.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Subtle gradient backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-indigo-50 via-purple-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-indigo-100/40 blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* ── Welcome Banner ────────────────────────────────── */}
          <div className="mb-10 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/40 px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-white flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-lg shadow-indigo-900/30">
              {initials}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
                Welcome back
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                {customer.firstName} {customer.lastName}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">{customer.email}</p>
            </div>
            {/* Stats row */}
            <div className="flex gap-6 mt-2 sm:mt-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-700">
                  {orders.length}
                </p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                  Orders
                </p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-700">
                  {
                    orders.filter((o: any) => o.financialStatus === "PAID")
                      .length
                  }
                </p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                  Completed
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ── Sidebar ────────────────────────────────────── */}
            <aside className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 p-6 sticky top-24">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
                  Account
                </p>
                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        item.active
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                          : "text-slate-600 hover:bg-slate-100 hover:text-indigo-700",
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {item.label}
                      {item.active && (
                        <ChevronRight className="ml-auto w-4 h-4 opacity-60" />
                      )}
                    </Link>
                  ))}
                </nav>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <a
                    href="/api/auth/logout"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    Sign Out
                  </a>
                </div>
              </div>
            </aside>

            {/* ── Main Content ────────────────────────────────── */}
            <div className="lg:col-span-9 space-y-6">
              {/* Orders Section */}
              <div
                id="orders"
                className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 overflow-hidden"
              >
                {/* Section header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Order History
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Track and manage your past orders
                    </p>
                  </div>
                  {orders.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                      {orders.length} order{orders.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Orders list */}
                <div className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                        <ShoppingBag className="w-8 h-8 text-indigo-300" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-700 mb-1">
                        No orders yet
                      </h3>
                      <p className="text-sm text-slate-400 max-w-xs mb-6">
                        When you place an order, it will appear here so you can
                        track its status.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-md shadow-indigo-500/30"
                      >
                        Start Shopping
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    orders.map((order: any) => (
                      <Link
                        key={order.id}
                        href={`/account/orders/${order.id.split("/").pop()}`}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-5 hover:bg-indigo-50/50 transition-colors duration-200"
                      >
                        {/* Order info */}
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                            <Package className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                              Order #{order.orderNumber}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <p className="text-xs text-slate-500">
                                {new Date(order.processedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order meta */}
                        <div className="flex items-center gap-4 sm:gap-6 sm:ml-auto">
                          <StatusBadge status={order.financialStatus} />
                          <span className="text-base font-bold text-slate-900">
                            {parseFloat(order.totalPrice.amount).toLocaleString(
                              "en-US",
                              {
                                style: "currency",
                                currency: order.totalPrice.currencyCode,
                              },
                            )}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/account/profile"
                  className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-md shadow-indigo-100/20 p-6 flex items-center gap-4 hover:border-indigo-200 hover:shadow-indigo-200/40 transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors duration-200">
                    <User className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Edit Profile
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Update your name and contact info
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>

                <Link
                  href="/shop"
                  className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-md shadow-indigo-100/20 p-6 flex items-center gap-4 hover:border-indigo-200 hover:shadow-indigo-200/40 transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors duration-200">
                    <ShoppingBag className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Continue Shopping
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Browse the latest products
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
