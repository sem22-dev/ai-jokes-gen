"use client"
import Logo from '@/components/logo';
import { useEffect, useState } from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from 'next-auth/react';

const formSchema = z
  .object({
    verification: z.string(),
  })

export default function Verify({verificationCode, email, password}: {verificationCode : string, email:string, password: string}) {
    const [isVerifying, setIsVerifying] = useState(false); // State to track verification process

    useEffect(() => {
        console.log("code", verificationCode)
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    verification: "",
    },
  });

  const handleVerifyClick = () => {
    setIsVerifying(true); // Set the verifying state to true 
    const code = parseInt(verificationCode, 10);
    if (!isNaN(code)) {
      const requestBody = {
        email: email,
        verification_code: verificationCode,
      };

      fetch('/api/verifyEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (response.ok) {
            alert('Email verified successfully'); 
              // Create a session for the user
          signIn('credentials', {
            email: email,
            password: password, // Provide the user's password here
            callbackUrl: '/', // Redirect to the dashboard after login
          });
            return response.json();
          } else {
            alert('Failed to verify email');
            setIsVerifying(false); // Set the verifying state to false on failure
            throw new Error('Failed to verify email');
          }
        })
        .catch((error) => {
          console.error('Email verification error:', error);
          setIsVerifying(false); // Set the verifying state to false on error
        });
    } else {
      alert('Invalid verification code. Please enter a valid integer'); 
      setIsVerifying(false); // Set the verifying state to false on validation error
    }
  };

  return (
    <main className="flex flex-col gap-12 items-center justify-center"> 
      <div className="bg-white  w-full">
        <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleVerifyClick)}
          className="  flex flex-col gap-4 mt-3"
        >
        <FormField
            control={form.control}
            name="verification"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Enter verification code sent to <span className='text-green-600'>{email}</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
            <Button type="submit" className="w-full">
            Submit
          </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
