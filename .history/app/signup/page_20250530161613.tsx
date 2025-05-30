'use client';

import ClientSignupForm from "../components/ClientSignupForm";
import Link from 'next/link';
import Image from 'next/image'; // For logo
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure keys are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        console.error('Error signing up:', error);
      } else if (data?.user) {
        // Handle successful signup (e.g., redirect to email verification page)
        router.push('/check-email'); // Example redirect
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Unexpected error during signup:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/">
            <Image 
              className="mx-auto h-16 w-auto rounded-full shadow-lg border-2 border-cyan-500" 
              src="/images/avatars/raf_profile.jpg" // Using Raf's profile as logo for now
              alt="Boase Logo"
              width={64}
              height={64}
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Client Onboarding
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Let's get your project started. Please fill out the form below.
          </p>
        </div>
        <ClientSignupForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account or project? <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 