"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthBrand } from "@/components/auth/auth-brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";

const forgotSchema = z.object({
  email: z.string().email()
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const form = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

  const mutation = useMutation({
    mutationFn: async (payload: ForgotValues) =>
      apiRequest<{ message: string }>("/api/v1/auth/forgot-password", {
        method: "POST",
        body: payload
      }),
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message)
  });

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 px-4 py-10 lg:grid-cols-[1.05fr_1fr]">
      <AuthBrand title="Password Recovery" subtitle="Enter your email and we will send a secure reset link." />

      <Card className="w-full rounded-[8px] border-black/10">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Secure Access</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Forgot Password</h1>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <Input placeholder="Email" {...form.register("email")} />
          <Button className="w-full rounded-[4px] py-3 text-xs font-black uppercase tracking-[0.2em]" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
        <p className="mt-4 text-sm ">
          Back to{" "}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/auth/login">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}

