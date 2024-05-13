
"use client";

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
import { useState } from "react";
import Verify from "./verification";
import Link from "next/link";

const formSchema = z
  .object({
    name: z.string(),
    emailAddress: z.string().email(),
    password: z.string().min(3),
    passwordConfirm: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    }
  )

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    name:"",
      emailAddress: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const [isCreating, setIsCreating] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verifyCode, setVerifyCode] = useState('')
  const [showVerificationModal, setShowVerificationModal] = useState(false);


  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, emailAddress, password } = form.getValues();
    try {
      const res = await fetch("/api/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name, 
            email: emailAddress,
            password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message === 'User created successfully') {
          const verificationEmailResponse = await fetch('/api/resend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailAddress,
              verification_token: data.verification_token,
              verification_code: data.verification_code,
            }),
          });

          if (verificationEmailResponse.ok) {
            setRegistrationSuccess(true);
            const resendData = await verificationEmailResponse.json()
            alert(resendData.message)
            setVerifyCode(data.verification_code)
            setShowVerificationModal(true);
          } else {
            alert('User registered successfully, but failed to send verification email.');
          }
        } else {
          alert('Registration failed: ' + 'resend api failed');
        }
      } else {
        const data = await res.json();
        alert('email is already in use');
      }
    } catch (error) {
      console.error('An error occurred while registering the user:', error);
      alert('An error occurred while registering the user.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="">
        {!showVerificationModal ?
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
                <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      type="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password confirm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password confirm"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full">
            Create acccount
          </Button>
        </form>
            <p className="px-8 mt-4 text-center text-sm text-muted-foreground">
              By clicking Create account, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>s
              .
            </p>
      </Form> 
      
      : 
      <Verify verificationCode={verifyCode}  email={form.getValues().emailAddress} password={form.getValues().password}/>
}
    </main>
  );
}
