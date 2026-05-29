import Hero from "@/components/Hero";
import heroImg from "@/public/hero.jpg";

export default function Home() {
  return (
    <main className='main text-primary flex flex-col'>
      <Hero
        heading='RPG JAM'
        subheading='Your first stop character builder'
        primaryButtonLabel='Get Started'
        secondaryButtonLabel='Learn More'
        imageSrc={heroImg}
        imageAlt='Hero image'
      />
    </main>
  );
}
