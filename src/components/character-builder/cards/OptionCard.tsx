"use client";

import Image from "next/image";
import { Button } from "@base-ui/react/button";
import { Check } from "lucide-react";

import { cn } from "@/utils/cn";
import { Tag } from "@/components/ui/tag";
import type { OptionItem } from "@/types/character";
import heroImage from "@/../public/hero.jpg";

interface OptionCardProps {
  option: OptionItem;
  selected: boolean;
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  disabled?: boolean;
}

export function OptionCard({
  option,
  selected,
  onSelect,
  multiSelect = false,
  disabled = false,
}: OptionCardProps) {
  const imageSrc = option.image ?? heroImage;

  return (
    <Button
      disabled={disabled}
      onClick={() => onSelect(option.id)}
      className={cn(
        "group relative min-h-72 w-full overflow-hidden rounded-lg border text-left transition-all outline-none ",
        "focus-visible:ring-2 focus-visible:ring-secondary/40",
        selected ? "border-secondary" : "border-border hover:border-secondary",
        disabled && !selected && "cursor-not-allowed opacity-50",
      )}
    >
      <Image
        src={imageSrc}
        alt=''
        fill
        className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
      />
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-t transition-opacity duration-300",
          selected
            ? "from-black/90 via-black/50 to-black/10"
            : "from-black/75 via-black/35 to-black/10 group-hover:from-black/85 group-hover:via-black/45",
        )}
      />

      {/* Selection indicator */}
      <div className='absolute right-3 top-3'>
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center border-2 bg-black/30 backdrop-blur-sm transition-all",
            multiSelect ? "rounded-md" : "rounded-full",
            selected ? "border-white bg-secondary" : "border-white/50",
          )}
        >
          {selected && (
            <Check size={11} strokeWidth={3} className='text-white' />
          )}
        </span>
      </div>

      {/* Content pinned to bottom */}
      <div className='relative flex h-full flex-col justify-end gap-1 p-3'>
        <span className='text-body-semibold font-body-semibold leading-body-semibold text-white'>
          {option.name}
        </span>
        <p className='text-helper leading-helper text-white/70'>
          {option.description}
        </p>
        {option.tags && option.tags.length > 0 && (
          <div className='mt-1 flex flex-wrap gap-1'>
            {(Array.isArray(option.tags) ? option.tags : [option.tags]).map(
              (tag) => (
                <Tag
                  key={tag}
                  label={tag}
                  className='bg-white/10 text-white/80'
                />
              ),
            )}
          </div>
        )}
      </div>
    </Button>
  );
}
