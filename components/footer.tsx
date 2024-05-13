"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icons } from "./icons";

export default function Footer(){

    const pathname = usePathname()
    return(
        <div className={`${pathname === '/authentication' || pathname === '/authentication/login' ? 'hidden' : 'block'} text-center py-12 absolute w-full bottom-0`}>
             <Link  href={'https://github.com/sem22-dev'} target="_blank" className="flex items-center justify-center">
              <Icons.gitHub className="mr-2 h-4 w-4"/>
                <span className="text-green-500">Thotsem Jajo</span>
            </Link>
        </div>
    )
}