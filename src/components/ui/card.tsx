import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

type CardProps = {
  title: string;
  description: string;
  image: string | StaticImageData;
  imageAlt: string;
  href: Url;
};

export default function Card({
  title,
  description,
  image,
  imageAlt,
  href,
}: CardProps) {
  return (
    <Link href={href} className='group relative block w-full overflow-hidden rounded-lg aspect-video md:aspect-3/4'>
      <Image
        src={image}
        alt={imageAlt}
        fill
        className='object-cover group-hover:opacity-65 transition-opacity duration-300'
      />
      <div className='absolute inset-0 flex flex-col justify-end p-4'>
        <h2>{title}</h2>
        <p className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>{description}</p>
      </div>
    </Link>
  );
}
