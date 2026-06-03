import { StaticImageData } from "next/image";

export interface HeroProps {
  heading: string;
  subheading: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  imageSrc: string | StaticImageData;
  imageAlt: string;
}
