import GithubIcon from "@/components/ui/icons/GithubIcon";
import FacebookIcon from "@/components/ui/icons/FacebookIcon";
import InstagramIcon from "@/components/ui/icons/InstagramIcon";
import Link from "next/link";
import { D20Icon } from "../ui/icons/D20Icon";
export default function Footer() {
  return (
    <footer className='mt-auto bg-secondary text-white dark:bg-base'>
      <div className='container py-8 gap-8 flex flex-col-reverse md:flex-row md:justify-between items-center'>
        <div className='flex flex-col gap-4'>
          <Link className='flex items-center gap-2' href='/'>
            <D20Icon className='w-8 h-8' />
            <span>JAM-RPG</span>
          </Link>{" "}
          <Link
            href='mailto:info@jam.rp'
            className='ml-auto md:ml-2 mr-auto md-mr-0'
          >
            info@jam.rp
          </Link>
        </div>
        <div className=' hidden md:flex items-center md:items-flex-end md:flex-row gap-4 text-sm self-end'>
          <Link href='mailto:info@jam.rp'>
            Copyright © 2026 - All right reserved by JAM Solutions Ltd
          </Link>
        </div>
        <div className='flex flex-col-reverse md:flex-row gap-4 items-baseline'>
          <div className='flex flex-col items-center md:items-start gap-4 '>
            <nav className='flex flex-wrap md:flex-col gap-x-4 gap-y-2 md:ml-1'></nav>
            <div className='flex md:flex-row gap-x-2 md:ml-2'>
              <Link href='google.com'>
                <GithubIcon className='h-5 w-5' />
              </Link>
              <Link href='google.com'>
                <FacebookIcon className='h-5 w-5' />
              </Link>
              <Link href='google.com'>
                <InstagramIcon className='h-5 w-5' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
