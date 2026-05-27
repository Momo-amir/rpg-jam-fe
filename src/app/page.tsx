import { ThemeSelector } from "@/providers/Theme/ThemeSelector";
import Image from "next/image";

export default function Home() {
  return (
    <main className='main text-primary container my-20 flex flex-col gap-y-20'>
      {" "}
      <h1 className='hero-header'>hellos</h1>
      <Image src='/next.svg' width={100} height={100} alt='alt' />
      <ThemeSelector />
      <div className='bg-base flex flex-col gap-4 p-4 rounded-lg'>
        <h3 className='text-accentthree '>hellos</h3>
        <h2 className='text-accentthree'>HELLO</h2>
        <p className='text-accentthree'>hellos</p>
      </div>
    </main>
  );
}
