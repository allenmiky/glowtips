"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthBrand } from "@/components/auth/auth-brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";

const resetSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type ResetValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const form = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  const mutation = useMutation({
    mutationFn: async (payload: ResetValues) =>
      apiRequest<{ message: string }>("/api/v1/auth/reset-password", {
        method: "POST",
        body: {
          token,
          password: payload.password
        }
      }),
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
    },
    onError: (error) => toast.error(error.message)
  });

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 px-4 py-10 lg:grid-cols-[1.05fr_1fr]">
      <AuthBrand title="Set New Password" subtitle="Choose a strong password to protect your creator account." />

      <Card className="w-full rounded-[8px] border-black/10">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Secure Access</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Reset Password</h1>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <Input type="password" placeholder="New password" {...form.register("password")} />
          <Input type="password" placeholder="Confirm password" {...form.register("confirmPassword")} />
          <Button className="w-full rounded-[4px] py-3 text-xs font-black uppercase tracking-[0.2em]" type="submit" disabled={mutation.isPending || !token}>
            {mutation.isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
        {!token && <p className="mt-4 text-sm text-red-500">Reset token missing or invalid.</p>}
        <p className="mt-4 text-sm text-muted-foreground">
          Back to{" "}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/auth/login">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
