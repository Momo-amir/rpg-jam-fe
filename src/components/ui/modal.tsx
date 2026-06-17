"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/utils/cn";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className='fixed inset-0 z-40 bg-white/40 dark:bg-black/85 backdrop-blur-sm transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0' />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-full max-w-[85vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-white/50 dark:bg-surface/60 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.6)]",
            "transition-all duration-300 ease-out",
            "data-starting-style:translate-y-[-46%] data-starting-style:opacity-0",
            "data-ending-style:translate-y-[-46%] data-ending-style:opacity-0",

            className,
          )}
        >
          <div className='flex items-start justify-between border-b border-white/10 px-8 py-6'>
            <div>
              <Dialog.Title className='text-h2 font-h2 leading-h2 text-primary'>
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className='mt-3 text-helper text-primary'>
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close className='ml-4 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutraltwo transition-colors hover:bg-neutral hover:text-primary'>
              <X size={18} />
            </Dialog.Close>
          </div>

          <div
            className='overflow-y-auto px-8 py-6'
            style={{ maxHeight: "calc(92vh - 110px)" }}
          >
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
