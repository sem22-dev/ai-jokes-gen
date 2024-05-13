"use client"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import SignUp from "./signUpForm"

export function DemoCreateAccount() {

  const { data: session } = useSession();
  const router = useRouter()

  // If the user is already signed in, redirect to home page
  if (session) {
    router.push('/');
    return null; // Optionally, you can return some loading indicator or message
  }

  return (
    <Card className="mt-12">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Get Started to begin generating jokes!</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
          <Button variant="outline" onClick={() => signIn('google')}>
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <SignUp />
      </CardContent>
    </Card>
  )
}
