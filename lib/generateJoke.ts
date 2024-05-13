
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_PRO_API || '');

export async function generateJoke(inputValue: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Craft a witty joke about "${inputValue}" in just a couple of lines.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return { joke: text, error: '', loading: false };
  } catch (error) {
    console.error('Error generating joke:', error);
    return { joke: '', error: 'Error generating joke. Please try again.', loading: false };
  }
}
