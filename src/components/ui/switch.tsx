"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const switchVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-neutraltwo outline-none transition-colors data-[checked]:bg-secondary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
        lg: "h-7 w-13",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform",
  {
    variants: {
      size: {
        default: "size-5 data-[checked]:translate-x-5",
        sm: "size-4 data-[checked]:translate-x-4",
        lg: "size-6 data-[checked]:translate-x-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(switchVariants({ size, className }))}
      {...props}
    >
      <SwitchPrimitive.Thumb className={cn(switchThumbVariants({ size }))} />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
