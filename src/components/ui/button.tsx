import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";
import { D20Icon } from "./icons/D20Icon";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg border cursor-pointer border-transparent font-button text-button leading-button whitespace-nowrap transition-all outline-none cursor select-none disabled:pointer-events-none disabled:opacity-80 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-secondary text-white hover:opacity-90",
        outline: "border-border bg-transparent hover:bg-neutral text-primary",
        ghost: "hover:bg-neutral text-primary",
        destructive: "bg-error/10 text-error hover:bg-error/20",
        link: "text-secondary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 gap-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    loadingText?: string;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot='button'
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading ? (
        <>
          <D20Icon className='size-5 animate-d20-spin' />
          {loadingText}
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
