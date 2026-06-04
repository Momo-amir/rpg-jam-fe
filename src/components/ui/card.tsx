
import Image, { StaticImageData } from "next/image"
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

type CardProps = {
  title: string
  description: string
  image:  string | StaticImageData;
  imageAlt: string
  href: Url 
}


export default function Card({
  title,
  description,
  image,
  imageAlt,
  href,
}: CardProps) {
  return (
    <div>
      <Link href={href} className="group relative block w-full h-full">
        <Image
          src={image}
          alt={imageAlt}
          className="rounded-lg group-hover:opacity-65 transition-opacity duration-300"
        />
        <div className="absolute inset-0 flex flex-col opacity-0 justify-end p-4 group-hover:opacity-100 transition-opacity duration-300">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}
