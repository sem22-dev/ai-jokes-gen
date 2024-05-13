"use client"
// Import necessary libraries and components
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import Logo from '@/components/logo';

// Define the form schema
const formSchema = z
  .object({
    email: z.string().email(),
    verificationCode: z.string().min(6).max(6),
    newPassword: z.string().min(3),
    confirmNewPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmNewPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmNewPassword'],
    }
  );

// Define the ResetPass component
const ResetPass = () => {
  const [resetting, setResetting] = useState(false);
  const [step, setStep] = useState(1); // Initial step is 1
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // Function to handle moving to the next step
  const handleNextStep = () => {
    setStep(step + 1);
  };

  // Function to handle resetting the password for step 1
  const handleStep1 = async () => {
    setResetting(true);
    const { email } = form.getValues();

    if (!email) {
      alert('Email is required.');
      setResetting(false);
      return;
    }

    try {
      const response = await fetch('/api/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        handleNextStep();
      } else {
        const data = await response.json();
        alert('not ok');
      }
    } catch (error) {
      console.error('An error occurred while resetting the password:', error);
      alert('An error occurred while resetting the password.');
    } finally {
      setResetting(false);
    }
  };

  // Function to handle validating verification code for step 2
  const handleStep2 = async() => {
    const { verificationCode, email } = form.getValues();

    if (!verificationCode) {
      alert('Verification code is required.');
      return;
    }

    try {
      const response = await fetch('/api/resetPassword/verifyResetCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode, email }),
      });

      if (response.ok) {
        alert('code is correct, click ok to continue')
        // Move to the next step
        handleNextStep()
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('An error occurred while verifying the code:', error);
     alert('An error occurred while verifying the code.');
    }
  };

  // Function to handle resetting password for step 3
  const handleStep3 = async() => {

    const { verificationCode, email, newPassword } = form.getValues();

    try {
      const response = await fetch('/api/resetPassword/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode, newPassword, email }),
      });

      if (response.ok) {
       alert('passwordchangesuccessfully')
        // signIn('credentials', {
        //   email: email,
        //   password: newPassword, // Provide the user's password here
        //   callbackUrl: '/', // Redirect to the dashboard after login
        // });
        // Password changed successfully, you can redirect the user or perform any other action here.
         // Display success message for a few seconds before redirecting
      } else {
        const data = await response.json();
        alert('hahahaha');
      
      }
    } catch (error) {
      console.error('An error occurred while changing the password:', error);
      alert('ehehehe');
   
    }
  };

  // JSX structure for the ResetPass component
  return (
    <main className="min-h-screen flex flex-col items-center md:justify-center">
      <h1>Reset Password</h1>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            switch (step) {
              case 1:
                handleStep1();
                break;
              case 2:
                handleStep2();
                break;
              case 3:
                handleStep3();
                break;
              default:
                break;
            }
          }}
          className="max-w-md w-full flex flex-col gap-4 p-6 bg-white rounded-md "
        >
          {/* Render form fields based on the current step */}
          {step === 1 && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {step === 2 && (
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Verification Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {step === 3 && (
            <>
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input placeholder="New Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {/* Render the submit button with appropriate label based on the current step */}
          <Button
            type="submit"
            className={`${resetting ? 'opacity-50 cursor-not-allowed' : ''} w-full text-white py-2 rounded-md transition duration-300`}
          >
            {resetting ? 'Resetting...' : step === 3 ? 'Reset Password' : 'Next'}
          </Button>
        </form>
      </Form>
    </main>
  );
};

// Export the ResetPass component
export default ResetPass;
