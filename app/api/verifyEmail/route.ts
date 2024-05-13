
import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '../../../lib/mongodb';
import User from '../../../models/user';

export  async function POST(request: NextRequest) {
    try {
      const { email, verification_code } = await request.json();
      
      if (!email || !verification_code) {
        return NextResponse.json({message: 'Email and verification code are required.'},
        {status: 400})
      }

      await connectMongoDB();
      const user = await User.findOne({ email });

      if (!user) {
        return NextResponse.json({message: 'User not found'},
        {status: 404})
      }

      if (user.verified) {
        return NextResponse.json({message: 'User is already verified.'},
        {status: 200})
      }

      if (user.verification_code === verification_code) {
        user.verified = true;
        await user.save();
        return NextResponse.json({message: 'Email verified successfully.'},
        {status: 200}) 
      } else {
        return NextResponse.json({message: 'Invalid verification code.'},
        {status: 400})  
      }
    } catch (error: any) {
      console.error('An error occurred while verifying the email:', error);
      return NextResponse.json({error: error.message},
      {status: 500})  
    }
  }
