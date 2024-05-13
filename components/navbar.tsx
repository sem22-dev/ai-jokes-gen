"use client"

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="">
      <div className="flex items-center justify-between border py-6 px-12 md:px-32 lg:px-72 xl:px-96">
        <Link href={'/'}>Ai Joke Generator</Link>
        <AvatarDropdown />
      </div>
    </nav>
  );
}

function AvatarDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="relative">
      <button onClick={handleToggleMenu} className="relative z-10">
      <Avatar>
          {session?.user?.image ? (
            <AvatarImage src={session.user.image} alt="@shadcn" />
          ) : (
            <Link href={'/authentication'} className="flex items-center justify-center">
              <User />
            </Link>
          )}
        </Avatar>
      </button>
      {session && isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <div className="py-1">
            <p className="block px-4 py-2 text-sm text-gray-700">Hi <span className="text-green-500">{session?.user?.name}</span></p>
            <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
