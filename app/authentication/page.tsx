
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "./components/user-auth-form"
import { DemoCreateAccount } from "@/components/createAccount/create-account"
import Logo from "@/components/logo"
import Footer from "@/components/footer"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative  h-screen flex-col items-center justify-center md:grid">
        <Link
          href="/authentication/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-15 md:top-8 border"
          )}
        >
          Login
        </Link>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[450px]">
            <DemoCreateAccount />
          </div>
        </div>
        <div className={` text-center pb-8 w-full`}>
            <Link  href={'https://github.com/sem22-dev'} target="_blank" className="flex items-center justify-center">
              <Icons.gitHub className="mr-2 h-4 w-4"/>
                <span className="text-green-500">Thotsem Jajo</span>
            </Link>
        </div>
      </div>
    </>
  )
}