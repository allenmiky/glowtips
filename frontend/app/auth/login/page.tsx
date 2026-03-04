"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthBrand } from "@/components/auth/auth-brand";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: async (payload: LoginValues) =>
      apiRequest<{ accessToken: string; refreshToken: string; user: { creatorId?: string } }>("/api/v1/auth/login", {
        method: "POST",
        body: payload
      }),
    onSuccess: (data, variables) => {
      localStorage.setItem("glowtips_access", data.accessToken);
      localStorage.setItem("glowtips_refresh", data.refreshToken);
      localStorage.setItem("glowtips_creator", data.user.creatorId ?? "");
      localStorage.setItem("glowtips_email", variables.email);
      localStorage.setItem("glowtips_name", (data.user as any).displayName ?? variables.email.split("@")[0]);
      toast.success("Welcome back");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 px-4 py-10 lg:grid-cols-[1.05fr_1fr]">
      <AuthBrand title="Welcome Back" subtitle="Sign in and continue managing your creator dashboard, alerts, and payouts." />

      <Card className="w-full rounded-[4px] border-black/10">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Account Access</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Login</h1>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <Input placeholder="Email" {...form.register("email")} />
          <Input type="password" placeholder="Password" {...form.register("password")} />
          <Button className="w-full rounded-[4px] py-3 text-xs font-black uppercase tracking-[0.2em]" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm ">
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/auth/forgot-password">
            Forgot password?
          </Link>
          <span>
            Don&apos;t have an account?{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/auth/register">
              Sign up
            </Link>
          </span>
        </div>
      </Card>
    </main>
  );
}

