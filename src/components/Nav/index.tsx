"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/api/auth";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/providers/Theme/ThemeSelector";
import { useSession } from "@/hooks/useSession";
import { D20Icon } from "../ui/icons/D20Icon";

export default function Nav() {
  const router = useRouter();
  const { isLoggedIn } = useSession();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <nav className='sticky top-0 px-6 py-3 border-b border-white/20 z-30 bg-transparent backdrop-blur-xs'>
      <div className='flex items-center justify-between container'>
        <div className='flex items-center gap-6'>
          <Link className='flex items-center gap-2' href='/'>
            <D20Icon className='w-8 h-8' />
            <span>JAM-RPG</span>
          </Link>{" "}
          {isLoggedIn && <Link href='/dashboard'>Dashboard</Link>}
        </div>

        <div className='flex items-center gap-4'>
          <ThemeSelector />
          {isLoggedIn ? (
            <Button variant='outline' size='sm' onClick={handleLogout}>
              Log out
            </Button>
          ) : (
            <Link href='/login'>Log in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
