import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { InitTheme } from "@/providers/Theme/InitTheme";
import { getSession } from "@/lib/session";

import Nav from "@/components/Nav";
import { D20Icon } from "@/components/ui/D20Icon";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JAM - RPG",
    template: "JAM - RPG | %s",
  },
  description:
    "A D&D/TTRPG platform for character building, party management, and at-table digital helpers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
      </head>
      <body className='min-h-full flex flex-col'>
        <Providers initialUser={user}>
          <header className=''>
            <Nav />
          </header>
          <div className='fixed left-40 top-1/2 -translate-y-1/2 -translate-x-1/3 rotate-20 opacity-4 pointer-events-none select-none  w-1/2'>
            <D20Icon className='w-full text-primary' />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
