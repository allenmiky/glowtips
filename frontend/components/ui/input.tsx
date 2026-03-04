import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[4px] border border-border bg-card px-3 text-sm outline-none transition duration-200 focus:border-accent",
        className
      )}
      {...props}
    />
  );
}

