
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import { connectMongoDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
      const { code, newPassword, email } = await request.json();

      await connectMongoDB();

      
      // Find the user with both email and passwordResetToken
      const user = await User.findOne({ email, passwordResetToken: code });

      if (!user) {
        return NextResponse.json({ message: 'Invalid email or password reset token.'  },
        {status: 400})
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
    
      await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

      const successResponse = {
        message: 'Password updated successfully.',
      };
      return NextResponse.json({ successResponse },
      {status: 200})
    } catch (error) {
      console.error('An error occurred while changing the password:', error);
      const errorResponse = {
        message: 'An error occurred while changing the password.',
      };
      return NextResponse.json({errorResponse },
      {status: 500})
    }
  }