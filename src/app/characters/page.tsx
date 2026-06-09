import CardLayout from "@/components/Card";
import { getSession } from "@/lib/session";
import heroImage from "@/../public/hero.jpg";

const characterCards = [
  {
    id: "create",
    title: "Create Character",
    description: "Build a new level 1 character.",
    image: heroImage,
    imageAlt: "Create a new character",
    href: "/characters/new",
  },
  {
    id: "list",
    title: "Your Characters",
    description: "View and manage your existing characters.",
    image: heroImage,
    imageAlt: "Your characters",
    href: "/characters/list",
  },
];

export default async function CharactersPage() {
  const user = await getSession();

  return (
    <main className='container'>
      <div className='my-20'>
        <h2>{user ? `${user.displayName}'s Characters` : "Characters"}</h2>
        <p></p>
        <div className='mt-10 flex w-full flex-col gap-6'>
          <CardLayout cards={characterCards} />
        </div>
      </div>
    </main>
  );
}
