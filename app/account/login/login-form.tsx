"use client";

import { useActionState, useEffect } from "react";
import { loginCustomer, createCustomer } from "@/app/actions/customer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const [loginState, loginAction, isLoginPending] = useActionState(
    loginCustomer,
    null as any,
  );
  const [registerState, registerAction, isRegisterPending] = useActionState(
    createCustomer,
    null as any,
  );

  const error = isLogin ? loginState?.error : registerState?.error;
  const success = isLogin ? loginState?.success : registerState?.success;

  useEffect(() => {
    if (success) {
      router.push("/account");
      router.refresh();
    }
  }, [success, router]);

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader>
        <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Sign in to your account to continue."
            : "Enter your details below to create an account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <form
          action={isLogin ? loginAction : registerAction}
          className="space-y-4"
        >
          {!isLogin && (
            <div className="grid gap-2">
              <Input name="firstName" placeholder="First Name" required />
              <Input name="lastName" placeholder="Last Name" required />
            </div>
          )}
          <div className="grid gap-2">
            <Input
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-md font-medium"
            disabled={isLoginPending || isRegisterPending}
          >
            {(isLoginPending || isRegisterPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="underline font-semibold"
            type="button"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
