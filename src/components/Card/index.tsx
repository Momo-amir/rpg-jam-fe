import Card from "../ui/card";
import { StaticImageData } from "next/image";
import { Url } from "next/dist/shared/lib/router/router";

type CardItem = {
  id: string;
  title: string;
  description: string;
  image: string | StaticImageData;
  imageAlt: string;
  href: Url;
};

type CardLayoutProps = {
  cards: CardItem[];
};

export default function CardLayout({ cards }: CardLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          title={card.title}
          description={card.description}
          image={card.image}
          imageAlt={card.imageAlt}
          href={card.href}
        />
      ))}
    </div>
  );
}
