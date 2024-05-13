
// Import necessary modules and components
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { SessionStrategy } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Create a handler for authentication using NextAuth
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        return new Promise<any>(async (resolve, reject) => {
          try {
            await connectMongoDB();
            const user = await User.findOne({ email: credentials?.email });

            if (!user) {
              resolve(null);
            }

            const passwordsMatch = await bcrypt.compare(
              credentials?.password || '',
              user.password
            );

            if (!passwordsMatch) {
              resolve(null);
            }

            resolve(user);
          } catch (error) {
            console.error('Error during authorization:', error);
            reject(new Error('Authorization failed'));
          }
        });
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy | undefined,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectMongoDB();

        if (account?.provider === 'google') {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              password: null,
            });
          }
        } else {
          await connectMongoDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              verified: true,
            });
          }
        }
      } catch (error) {
        console.error('Error during sign-in:', error);
        throw new Error('Sign-in failed');
      }

      return true;
    },
  },
});

// Export the handler as both a GET and POST route for authentication
export { handler as GET, handler as POST };
