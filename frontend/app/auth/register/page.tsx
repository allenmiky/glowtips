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

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
  displayName: z.string().min(2)
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: async (payload: RegisterValues) =>
      apiRequest<{ accessToken: string; refreshToken: string; user: { creatorId?: string } }>("/api/v1/auth/register", {
        method: "POST",
        body: payload
      }),
    onSuccess: (data, variables) => {
      localStorage.setItem("glowtips_access", data.accessToken);
      localStorage.setItem("glowtips_refresh", data.refreshToken);
      localStorage.setItem("glowtips_creator", data.user.creatorId ?? "");
      localStorage.setItem("glowtips_email", variables.email);
      localStorage.setItem("glowtips_name", variables.displayName);
      toast.success("Account created");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 px-4 py-10 lg:grid-cols-[1.05fr_1fr]">
      <AuthBrand title="Start Your Creator Hub" subtitle="Create your account and set up your branded tip page in minutes." />

      <Card className="w-full rounded-[4px] border-border bg-card p-6 shadow-none">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Create Account</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Sign up</h1>
        
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <div>
            <Input 
              placeholder="Email" 
              {...form.register("email")} 
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Input 
              type="password" 
              placeholder="Password" 
              {...form.register("password")} 
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          <div>
            <Input 
              placeholder="Username" 
              {...form.register("username")} 
            />
            {form.formState.errors.username && (
              <p className="mt-1 text-xs text-red-500">{form.formState.errors.username.message}</p>
            )}
          </div>
          
          <div>
            <Input 
              placeholder="Display name" 
              {...form.register("displayName")} 
            />
            {form.formState.errors.displayName && (
              <p className="mt-1 text-xs text-red-500">{form.formState.errors.displayName.message}</p>
            )}
          </div>
          
          <Button 
            className="w-full rounded-[4px] py-3 text-xs font-black uppercase tracking-[0.2em]" 
            type="submit" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create account"}
          </Button>
        </form>
        
        <p className="mt-4 text-sm ">
          Already have an account?{" "}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/auth/login">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
