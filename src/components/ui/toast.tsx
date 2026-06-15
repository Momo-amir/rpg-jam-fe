"use client";

import { Toast } from "@base-ui/react/toast";
import { cva } from "class-variance-authority";
import { CheckCircle2, X, XCircle } from "lucide-react";

import { cn } from "@/utils/cn";

const ToastProvider = Toast.Provider;
const useToast = Toast.useToastManager;

const toastVariants = cva(
  "pointer-events-auto flex w-80 items-start gap-3 rounded-xl border bg-surface p-4 shadow-lg",
  {
    variants: {
      type: {
        success: "border-secondary/40",
        error: "border-error/40",
        default: "border-primary/10",
      },
    },
    defaultVariants: {
      type: "default",
    },
  },
);

function ToastIcon({ type }: { type?: string }) {
  if (type === "success")
    return <CheckCircle2 size={20} className='mt-0.5 shrink-0 text-secondary' />;
  if (type === "error")
    return <XCircle size={20} className='mt-0.5 shrink-0 text-error' />;
  return null;
}

function Toaster() {
  const { toasts } = useToast();

  return (
    <Toast.Portal>
      <Toast.Viewport className='fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-3'>
        {toasts.map((toast) => {
          const type = toast.type as "success" | "error" | "default" | undefined;
          return (
            <Toast.Root
              key={toast.id}
              toast={toast}
              className={cn(toastVariants({ type }))}
            >
              <ToastIcon type={toast.type} />
              <div className='flex flex-1 flex-col gap-0.5'>
                <Toast.Title className='text-sm font-semibold text-primary' />
                <Toast.Description className='text-helper text-primary/60' />
              </div>
              <Toast.Close
                aria-label='Close'
                className='shrink-0 cursor-pointer text-primary/40 transition-colors hover:text-primary'
              >
                <X size={16} />
              </Toast.Close>
            </Toast.Root>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export { ToastProvider, Toaster, useToast };
