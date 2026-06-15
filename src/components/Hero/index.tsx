import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  heading: string;
  subheading: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  imageSrc: string | StaticImageData;
  imageAlt: string;
}

export default function Hero({
  heading,
  subheading,
  primaryButtonLabel,
  secondaryButtonLabel,
  imageSrc,
  imageAlt,
}: HeroProps) {
  return (
    <div className='relative w-full min-h-[93dvh] flex items-center -mt-14 isolate overflow-x-hidden'>
      {/* Mobile/tablet: full-bleed background image */}
      <Image
        fill
        alt={imageAlt}
        src={imageSrc}
        draggable={false}
        priority
        className='object-cover object-top select-none -z-10 md:hidden '
      />
      <div className='absolute inset-x-0 bottom-0 top-14 bg-black/40 -z-10 md:hidden' />

      <div className='container flex flex-row items-center self-stretch gap-0'>
        <div className='flex flex-col gap-y-6 w-full md:w-[40%] lg:w-[30%] md:shrink-0 py-32 relative z-10 text-white md:text-primary '>
          <h1 className='hero-header'>{heading}</h1>
          <h3>{subheading}</h3>
          <div className='flex gap-4'>
            <Link href='/login'>
              <Button variant='default'>{primaryButtonLabel}</Button>
            </Link>
            <Button
              variant='outline'
              className='md:border-border md:text-primary border-white text-white hover:bg-white/20'
            >
              {secondaryButtonLabel}
            </Button>
          </div>
        </div>

        {/* Desktop: split image on the right */}
        <div
          className='hidden md:block relative self-stretch grow -mr-[calc((100vw-100%)/2)] '
          style={{ clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        >
          <Image
            fill
            alt={imageAlt}
            src={imageSrc}
            draggable={false}
            priority
            className='object-cover object-top select-none '
          />
        </div>
      </div>
    </div>
  );
}
