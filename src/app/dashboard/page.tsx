import CardLayout from "@/components/Card";
import { getSession } from "@/lib/session";
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

export default async function Dashboard() {
  const user = await getSession();

  return (
    <main className='container'>
      {" "}
      <div className='my-20'>
        <h2>
          {user ? ` ${user.displayName}'s Dashboard` : "How did you get here?"}
        </h2>
        <p></p>
        <div className='mt-10 flex w-full flex-col gap-6 h-auto'>
          <CardLayout cards={placeholderCards} />
        </div>
      </div>{" "}
    </main>
  );
}
