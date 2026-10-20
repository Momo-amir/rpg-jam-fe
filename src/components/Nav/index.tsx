"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/utils/api/auth";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/providers/Theme/ThemeSelector";
import { useMe } from "@/hooks/useMe";
import { LOGIN_PATH } from "@/lib/auth";
import { D20Icon } from "../ui/icons/D20Icon";

export default function Nav() {
  const { data: user } = useMe();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      // Full page load: drops the whole query cache, so nothing of this user survives. Runs even if the request failed.
      window.location.replace(LOGIN_PATH);
    }
  }

  return (
    <nav className='sticky top-0 px-6 py-3 border-b border-white/20 z-30 bg-transparent backdrop-blur-xs'>
      <div className='flex items-center justify-between container'>
        <div className='flex items-center gap-6'>
          <Link className='flex items-center gap-2' href='/'>
            <D20Icon className='w-8 h-8' />
            <span>JAM-RPG</span>
          </Link>{" "}
          {user && <Link href='/dashboard'>Dashboard</Link>}
        </div>

        <div className='flex items-center gap-4'>
          <ThemeSelector />
          {user === undefined ? null : user ? (
            <>
              <span className='text-sm'>{user.displayName}</span>
              <Button variant='outline' size='sm' onClick={handleLogout} loading={loggingOut}>
                Log out
              </Button>
            </>
          ) : (
            <Link href='/login'>Log in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
