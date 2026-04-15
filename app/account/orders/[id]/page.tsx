import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrder } from "@/app/actions/customer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const TIMELINE = [
  {
    icon: CheckCircle2,
    label: "Order Placed",
    desc: "Your order has been received",
    done: true,
  },
  {
    icon: Package,
    label: "Processing",
    desc: "We're preparing your items",
    done: true,
  },
  {
    icon: Truck,
    label: "Shipped",
    desc: "Your order is on its way",
    done: false,
  },
  {
    icon: CheckCircle2,
    label: "Delivered",
    desc: "Package delivered successfully",
    done: false,
  },
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) redirect("/account");

  const customer = order.customer || { firstName: "Customer", lastName: "" };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Gradient backdrop */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-indigo-50 via-purple-50/40 to-transparent" />
      </div>

      <Header />

      <main className="flex-1 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Back */}
          <div className="mb-8">
            <Link
              href="/account"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Account
            </Link>
          </div>

          {/* Page header */}
          <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/30 px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">
                Order
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                #{order.orderNumber}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm text-slate-500">
                  Placed on{" "}
                  {new Date(order.processedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <StatusBadge status={order.financialStatus} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
              >
                <Download className="w-4 h-4" />
                Invoice
              </Button>
              <Button
                size="sm"
                className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/30"
              >
                <Truck className="w-4 h-4" />
                Track Order
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ── Left Column ─────────────────────────────────── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Order Items */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/20 overflow-hidden">
                <div className="border-b border-slate-100 px-8 py-5">
                  <h2 className="text-base font-bold text-slate-900">
                    Items Ordered
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {order.lineItems.edges.length} item
                    {order.lineItems.edges.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {order.lineItems.edges.map((edge: any) => {
                    const item = edge.node;
                    return (
                      <div
                        key={item.variant.id}
                        className="flex gap-5 px-8 py-5 group"
                      >
                        {/* Product image */}
                        <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                          {item.variant.image ? (
                            <Image
                              src={item.variant.image.url}
                              alt={item.variant.image.altText || item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                              <Package className="w-8 h-8 text-indigo-200" />
                            </div>
                          )}
                        </div>

                        {/* Product details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors">
                            {item.title}
                          </h3>
                          {item.variant.title &&
                            item.variant.title !== "Default Title" && (
                              <span className="text-xs text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded-md inline-block w-fit">
                                {item.variant.title}
                              </span>
                            )}
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-500">
                              Qty: {item.quantity}
                            </span>
                            {item.variant.product?.handle && (
                              <Link
                                href={`/products/${item.variant.product.handle}`}
                                className="text-xs text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center gap-1"
                              >
                                Buy again <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0 flex flex-col justify-center">
                          <p className="text-sm font-bold text-slate-900">
                            {parseFloat(
                              item.variant.price.amount,
                            ).toLocaleString("en-US", {
                              style: "currency",
                              currency: item.variant.price.currencyCode,
                            })}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            per item
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Timeline */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/20 px-8 py-6">
                <h2 className="text-base font-bold text-slate-900 mb-6">
                  Order Status
                </h2>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-200" />

                  <div className="space-y-6">
                    {TIMELINE.map((step) => (
                      <div
                        key={step.label}
                        className="flex items-start gap-4 relative"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-colors",
                            step.done
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                              : "bg-white border-slate-200 text-slate-300",
                          )}
                        >
                          {step.done ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </div>
                        <div
                          className={cn("pt-1.5", !step.done && "opacity-40")}
                        >
                          <p className="text-sm font-semibold text-slate-900">
                            {step.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column ─────────────────────────────────── */}
            <div className="lg:col-span-4 space-y-5">
              {/* Order Summary */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/20 p-6">
                <h3 className="text-base font-bold text-slate-900 mb-5">
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">
                      {parseFloat(order.subtotalPrice?.amount || order.totalPrice.amount).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: order.subtotalPrice?.currencyCode || order.totalPrice.currencyCode,
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">
                      {parseFloat(order.totalShippingPrice?.amount || "0") === 0 
                        ? "Free" 
                        : parseFloat(order.totalShippingPrice.amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: order.totalShippingPrice.currencyCode,
                          })
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span className="font-medium text-slate-900">Included</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-lg text-indigo-700">
                      {parseFloat(order.totalPrice.amount).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: order.totalPrice.currencyCode,
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/20 p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Shipping Address
                  </h3>
                </div>
                {order.shippingAddress ? (
                  <div className="text-sm text-slate-600 space-y-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="font-semibold text-slate-900">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p>{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && (
                      <p>{order.shippingAddress.address2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.province}{" "}
                      {order.shippingAddress.zip}
                    </p>
                    <p className="text-indigo-600 font-medium">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    No address on file
                  </p>
                )}
              </div>

              {/* Payment */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-indigo-100/20 p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Payment</h3>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-indigo-950 rounded text-white text-[8px] font-bold flex items-center justify-center tracking-wider">
                      VISA
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        •••• 4242
                      </p>
                      <StatusBadge status={order.financialStatus} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
