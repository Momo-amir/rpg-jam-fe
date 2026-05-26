"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/utils/cn";

const selectTriggerVariants = cva(
  "inline-flex w-full items-center justify-between gap-2 rounded-lg border bg-transparent px-3 font-body text-body leading-body text-primary outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&[data-popup-open]]:border-secondary [&[data-popup-open]]:ring-2 [&[data-popup-open]]:ring-secondary/20",
  {
    variants: {
      variant: {
        default: "border-border hover:border-secondary",
        error:
          "border-error hover:border-error [&[data-popup-open]]:border-error [&[data-popup-open]]:ring-error/20",
      },
      size: {
        default: "h-10",
        sm: "h-8 text-sm",
        lg: "h-12 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SelectTrigger({
  className,
  variant,
  size,
  children,
  ...props
}: SelectPrimitive.Trigger.Props & VariantProps<typeof selectTriggerVariants>) {
  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      className={cn(selectTriggerVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className='shrink-0 text-neutraltwo'>
        <ChevronDown size={16} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectPopup({ className, ...props }: SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner side='bottom' align='start' sideOffset={6} alignItemWithTrigger={false}>
        <SelectPrimitive.Popup
          data-slot='select-popup'
          className={cn(
            "z-50  origin-(--transform-origin) overflow-hidden rounded-lg border border-border bg-surface py-1 text-primary shadow-lg outline-none transition-[opacity,scale,transform] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className,
          )}
          {...props}
        />
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectScrollUpArrow({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      className={cn(
        "flex items-center justify-center py-1 text-neutraltwo",
        className,
      )}
      {...props}
    >
      <ChevronUp size={14} />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownArrow({
  className,
  ...props
}: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      className={cn(
        "flex items-center justify-center py-1 text-neutraltwo",
        className,
      )}
      {...props}
    >
      <ChevronDown size={14} />
    </SelectPrimitive.ScrollDownArrow>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 px-3 py-2 font-body text-body leading-body text-primary outline-none transition-colors data-highlighted:bg-neutral data-selected:font-medium",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className='absolute right-3 flex items-center text-secondary'>
        <Check size={14} />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectGroupLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn("px-3 py-1 text-sm font-medium text-neutraltwo", className)}
      {...props}
    />
  );
}

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectGroup = SelectPrimitive.Group;

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
  SelectGroup,
  SelectGroupLabel,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
  selectTriggerVariants,
};
