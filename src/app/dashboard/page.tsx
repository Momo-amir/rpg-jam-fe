import CardLayout from "@/components/Card";
import { DashboardHeading } from "./DashboardHeading";
import heroImage from "@/public/hero.jpg";

const placeholderCards = [
  {
    id: "1",
    title: "Characters",
    description: "Manage your characters.",
    image: heroImage,
    imageAlt: "Characters",
    href: "/characters",
  },
  {
    id: "2",
    title: "Campaign",
    description: "View and manage your campaigns.",
    image: heroImage,
    imageAlt: "Campaign",
    href: "/campaign",
  },
  {
    id: "3",
    title: "Player",
    description: "Your player profile and settings.",
    image: heroImage,
    imageAlt: "Player",
    href: "/account",
  },
];

export default function Dashboard() {
  return (
    <main className='container'>
      {" "}
      <div className='my-20'>
        <DashboardHeading />
        <p></p>
        <div className='mt-10 flex w-full flex-col gap-6 h-auto'>
          <CardLayout cards={placeholderCards} />
        </div>
      </div>
      <div className='flex flex-row gap-4 p-8 w-full'></div>
    </main>
  );
}
