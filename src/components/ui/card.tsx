
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


export default function Card ({
    title,
    description,
    image,
    imageAlt,
    href,
    
}:CardProps) {

    return (
        <div
            data-slot='card'
        >
            <h1>{title}</h1>
            <p>{description}</p>
            <Image src={image} alt={imageAlt} />
            <Link href={href}>{ }</Link>
            </div>
    );
}
