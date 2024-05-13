
import User from '@/models/user';
import { connectMongoDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
      const { code, email } = await request.json();
      await connectMongoDB();

      // Find the user with both email and passwordResetToken
      const user = await User.findOne({ email, passwordResetToken: code });

      if (!user) {
        return NextResponse.json({ message: 'Invalid password reset code or email'  },
            {status: 400})
      }

      const successResponse = {
        message: 'Verification successful.',
      };
      return NextResponse.json({successResponse},
      {status: 200})
    } catch (error) {
      console.error('An error occurred while verifying the code:', error);
      const errorResponse = {
        message: 'An error occurred while verifying the code.',
      };
      return NextResponse.json({errorResponse},
        {status: 500})
    }
  }