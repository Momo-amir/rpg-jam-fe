"use client";

import Hero from "@/components/Hero";
import heroImg from "@/public/hero.jpg";
import { useMe } from "@/hooks/useMe";

export function HomeHero() {
  const { data: user } = useMe();

  return (
    <Hero
      heading={user ? `Welcome back, ${user.displayName}!` : "JAM RPG"}
      subheading={user ? "Jump back into RPG JAM" : "Your first stop character builder"}
      primaryButtonLabel={user ? "Go to dashboard" : "Get Started"}
      secondaryButtonLabel='Learn More'
      imageSrc={heroImg}
      imageAlt='Hero image'
    />
  );
}
