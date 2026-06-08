"use client";

import Image, { type StaticImageData } from "next/image";

import { cn } from "@/utils/cn";

interface CharacterCreationCardProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  displayValue?: string | number;
  backgroundImage?: StaticImageData;
  grayscale?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function CharacterCreationCard({
  label,
  description,
  icon,
  className,
  displayValue,
  backgroundImage,
  grayscale = true,
  onClick,
  children,
  style,
}: CharacterCreationCardProps) {
  const isFilled = displayValue !== undefined && displayValue !== "";

  return (
    <div
      style={style}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border transition-all",
        backgroundImage ? "min-h-72" : "",
        isFilled ? "border-white/10" : "border-dashed border-white/10",
        onClick && "hover:border-white/20",
        className,
      )}
    >
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=''
            fill
            className={cn(
              "object-cover  transition-transform duration-500 group-hover:scale-105",
              grayscale && "grayscale",
            )}
          />
          <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20' />
        </>
      )}

      <button
        type='button'
        onClick={onClick}
        className={cn(
          "relative flex grow flex-col gap-3 text-left outline-none",
          backgroundImage ? "p-5" : "bg-surface/60 p-5",
          onClick
            ? "cursor-pointer focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/40"
            : "cursor-default",
        )}
      >
        <div className='flex items-center justify-between'>
          <div
            className={cn(
              "flex items-center gap-2",
              backgroundImage ? "text-white/70" : "text-neutraltwo",
            )}
          >
            {icon}
            <span className='text-helper font-medium uppercase tracking-wider'>
              {label}
            </span>
          </div>
        </div>

        {backgroundImage ? (
          <div className='mt-auto'>
            <p
              className={cn(
                "text-helper",
                isFilled ? "text-primary" : "text-white/40",
              )}
            >
              {isFilled ? displayValue : description}
            </p>
          </div>
        ) : isFilled ? (
          <p className='text-h3 font-h3 leading-h3 text-primary'>
            {displayValue}
          </p>
        ) : (
          <p className='text-helper text-neutraltwo'>{description}</p>
        )}
      </button>

      {children}
    </div>
  );
}
