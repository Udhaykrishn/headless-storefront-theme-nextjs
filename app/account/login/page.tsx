import { getCustomer } from "@/app/actions/customer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const customer = await getCustomer();

  if (customer) {
    redirect("/account");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-24">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
