"use client"

import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Login } from "./login"
import Logo from "@/components/logo"
import {signIn} from "next-auth/react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function AuthenticationPage() {

  const { data: session, status } = useSession();
  const router = useRouter()

  if (status === "loading") {
    return(
    <div className={`h-screen fixed z-50 w-full bg-white flex items-center justify-center`}>
            <h1 className="fixed top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black rounded-full px-3 py-1 text-lg">Loggin in...</h1>
    </div>
    ) 
  }

  return (
    <>
      <div className="container relative  h-screen flex-col items-center justify-center md:grid ">
      <Link
          href="/authentication"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8 border"
          )}
        >
          Sign Up
        </Link>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
            <Login />
          </div>
        </div>
      </div>
    </>
  )
}