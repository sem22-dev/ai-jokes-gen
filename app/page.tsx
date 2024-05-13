'use client'

import JokeForm from "@/components/JokeForm";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export default function Home() {
  const {data: session} = useSession()

  if(!session){
    redirect('/authentication')
  }

  return (
    <main>
      <JokeForm />
    </main>
  );
}
