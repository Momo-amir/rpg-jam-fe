import Hero from "@/components/Hero";
import heroImg from "@/public/hero.jpg";
import { getSession } from "@/lib/session";
import Card from "@/components/ui/card";

export default async function Home() {
  const user = await getSession();

  return (
    <main className='main text-primary flex flex-col'>
      <Hero
        heading={user ? `Welcome back, ${user.displayName}!` : "RPG JAM"}
        subheading={
          user ? "Jump back into RPG JAM" : "Your first stop character builder"
        }
        primaryButtonLabel={user ? "Go to dashboard" : "Get Started"}
        secondaryButtonLabel='Learn More'
        imageSrc={heroImg}
        imageAlt='Hero image'
      />
      <div className="container flex flex-col border-4 rounded-xl">

      <Card title="hello" description="I den her boks skal der være tekst" image={heroImg} imageAlt="flot billede smukke" href={"google.com"}></Card>
      </div>
    </main>
  );
}
