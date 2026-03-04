import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
        variant === "default" && "bg-primary text-white shadow-glow hover:opacity-90",
        variant === "outline" && "border border-border bg-card hover:border-accent/70",
        className
      )}
      {...props}
    />
  );
}
