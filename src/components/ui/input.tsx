"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const inputVariants = cva(
  "w-full rounded-lg border bg-transparent px-3 font-body text-body leading-body text-primary placeholder:text-neutraltwo outline-none transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-border hover:border-secondary focus:border-secondary focus:ring-2 focus:ring-secondary/20",
        error:
          "border-error hover:border-error focus:border-error focus:ring-2 focus:ring-error/20",
      },
      inputSize: {
        default: "h-10 py-2",
        sm: "h-8 px-2 text-sm",
        lg: "h-12 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  },
);

function Input({
  className,
  variant = "default",
  inputSize = "default",
  ...props
}: InputPrimitive.Props & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(inputVariants({ variant, inputSize, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
