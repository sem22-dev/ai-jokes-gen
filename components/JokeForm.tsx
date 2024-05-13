"use client"

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { generateJoke } from '@/lib/generateJoke';
import Loader from './loader';

const JokeForm = () => {
  const [joke, setJoke] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError('Please enter a topic for the joke.');
    } else {
      setLoading(true);
      const { joke: generatedJoke, error: jokeError } = await generateJoke(inputValue);
      setJoke(generatedJoke);
      setError(jokeError);
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center max-h-screen bg-white text-gray-900'>
    <form
      className=' w-full lg:w-1/2 px-4 my-24'
      onSubmit={handleSubmit}
    >
      <Input
        placeholder='Give us a theme to make a joke from...'
        className=' max-w-full mb-4 py-6 text-black'
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setError('');
        }}
      />
      <Button
        type='submit'
        className='w-full bg-cyan-300 button2'
      >
        Generate Joke
      </Button>
    </form>
    {loading && (
    <Loader />
    )}
    {joke && !loading && (
  <div className='mt-4 p-4 md:p-6 max-w-screen-lg w-full bg-[#01FFFF] text-gray-800 rounded-md shadow-lg'>
    <div className="text-center mb-4">
      <h2 className="text-2xl font-bold">Here's Your Joke:</h2>
    </div>
    <div className="p-4 bg-white rounded-md">
      <p className="text-lg">{joke}</p>
    </div>
  </div>
)}

  </div>
  );
};

export default JokeForm;
