import { getCustomer } from "@/app/actions/customer";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { logoutCustomer } from "@/app/actions/customer";

export default async function AccountPage() {
  const customer = await getCustomer();

  if (!customer) {
    redirect("/account/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Account</h1>
            <p className="text-xl text-gray-600 mt-2">
              Welcome back, {customer.firstName} {customer.lastName}
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await logoutCustomer();
              redirect("/account/login");
            }}
          >
            <Button
              variant="outline"
              type="submit"
              className="mt-4 md:mt-0 font-medium"
            >
              Log Out
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
              <h2 className="font-semibold text-lg border-b pb-2 mb-4">
                Account Details
              </h2>
              <p className="text-sm font-medium">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-sm text-gray-600">{customer.email}</p>
              <p className="text-sm text-gray-600 mt-2">
                {customer.phone || "No phone added"}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
              <h2 className="font-semibold text-xl mb-6">Order History</h2>

              {!customer.orders || customer.orders.edges.length === 0 ? (
                <p className="text-gray-500 py-8 text-center border-t">
                  You haven't placed any orders yet.
                </p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Fulfillment Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.orders.edges.map((edge: any) => {
                        const order = edge.node;
                        const date = new Date(
                          order.processedAt,
                        ).toLocaleDateString();
                        const total = new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: order.totalPrice.currencyCode,
                        }).format(parseFloat(order.totalPrice.amount));

                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              #{order.orderNumber}
                            </TableCell>
                            <TableCell>{date}</TableCell>
                            <TableCell>{order.financialStatus}</TableCell>
                            <TableCell>{order.fulfillmentStatus}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {total}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
