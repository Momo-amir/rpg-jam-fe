"use client";

import { cn } from "@/utils/cn";

interface TagProps {
  label: string;
  onClick?: () => void;
  variant?: "default" | "active" | "pending" | "error";
  className?: string;
}

export function Tag({
  label,
  onClick,
  variant = "default",
  className,
}: TagProps) {
  const base =
    "rounded-md px-2 py-0.5 text-[0.75rem] font-medium backdrop-blur-sm transition-colors";

  const variants = {
    default: "bg-primary/10 text-primary/80",
    active: "bg-secondary/30 text-accenttwo hover:bg-secondary/40",
    pending: "bg-primary/10 text-white/70 hover:bg-white/20",
    error: "bg-error/20 text-error ring-1 ring-error/50 hover:bg-error/30",
  };

  if (onClick) {
    return (
      <button
        type='button'
        onClick={onClick}
        className={cn(base, variants[variant], "cursor-pointer", className)}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={cn(base, variants[variant], className)}>{label}</span>
  );
}
