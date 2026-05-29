"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/api/auth";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/providers/Theme/ThemeSelector";

export default function Nav() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <nav className='sticky top-0 px-6 py-3 border-b border-white/20 z-50 bg-transparent backdrop-blur-xs'>
      <div className='flex items-center justify-between container'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='font-semibold text-lg'>
            JAM-RPG
          </Link>
          <Link href='/dashboard'>Dashboard</Link>
        </div>

        <div className='flex items-center gap-4'>
          <ThemeSelector />
          <Button
            variant='outline'
            size='sm'
            className=''
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
    </nav>
  );
}
