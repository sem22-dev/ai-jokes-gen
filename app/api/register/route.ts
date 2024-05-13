import bcrypt from 'bcryptjs';
import User from '../../../models/user'; // Importing userSchema from the User model
import { connectMongoDB } from '../../../lib/mongodb';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

function generateVerificationToken() {
  const randomBytes = crypto.randomBytes(32);
  const verificationToken = randomBytes.toString('hex');
  return verificationToken;
}

function generateVerificationCode() {
  // Generate 6 digit code using Math.random
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

export  async function POST(request: NextRequest) {
    try {
      const { name, email, password } = await request.json();
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = generateVerificationToken();
      const verificationCode = generateVerificationCode();

      await connectMongoDB();
      await User.create({
        name,
        email,
        password: hashedPassword,
        verification_token: verificationToken,
        verification_code: verificationCode,
        verified: false,
        balance :0,
        phone : null,
        image:null,
      });

         //Returning the response
         return NextResponse.json({
            message: "User created successfully",
            verification_token: verificationToken,
            verification_code: verificationCode, 
            success: true,
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message },
            {status: 500})
    }
}
