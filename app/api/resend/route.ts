import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest){

  const { email, verification_token, verification_code } = await request.json();

  try {
    const emailContent = `
      Your verification link is http://localhost:3000/api/verify?verification_token=${encodeURIComponent(verification_token)}
      Verification code: ${verification_code}
    `;

    const data = await resend.emails.send({
      from: 'aijoke@semjjonline.xyz',
      to: [email],
      subject: 'Verification Email',
      text: emailContent,
    });

       //Returning the response
       return NextResponse.json({
        message: "verification code sent successfully",
        success: true,
    })
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ error: error.message },
      {status: 500})
  }
};