import Hero from "@/components/Hero";
import heroImg from "@/public/hero.jpg";
import { getSession } from "@/lib/session";

export default async function Home() {
  const user = await getSession();

  return (
    <main className='main text-primary flex flex-col'>
      <Hero
        heading={user ? `Welcome back, ${user.displayName}!` : "JAM RPG"}
        subheading={
          user ? "Jump back into RPG JAM" : "Your first stop character builder"
        }
        primaryButtonLabel={user ? "Go to dashboard" : "Get Started"}
        secondaryButtonLabel='Learn More'
        imageSrc={heroImg}
        imageAlt='Hero image'
      />
    </main>
  );
}
