'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { FaGoogle, FaEnvelope, FaLock, FaUserPlus, FaEye, FaEyeSlash, FaGithub, FaTwitter, FaCreditCard, FaEthereum, FaBitcoin } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);

  const showPendingFeatureAlert = () => {
    const availableMethods = "Currently Available Sign-In Methods:\n- Sign in with Email\n- Sign in with Google";
    const pendingMethods = "Coming Soon (This Feature is Not Yet Implemented):\n- Sign in with GitHub\n- Sign in with X.com\n- Sign in with Phantom\n- Sign in with HandCash\n- Sign in with MetaMask";

    const comicalExplanation = `\n\n--- The Epic Saga of Implementation (What Our Devs Are Up To) ---\n\nOh, you clicked one of THOSE buttons! Bless your optimistic heart! You see, making these shiny buttons actually *do* something is less like flipping a switch and more like preparing a seven-course meal for a very picky dragon, during a meteor shower, on a unicycle.\n\nFor 'Sign in with GitHub' and 'Sign in with X.com':\n1. First, we must embark on a perilous journey to their respective Developer Portals, which are usually hidden behind a riddle and three CAPTCHAs that question our very humanity. We'll need to create an 'App', which isn't an app you can use, but more like a magical token-granting shrine.\n2. Then, we offer up our sacred callback URLs to these shrines, praying they are deemed worthy. These URLs are like secret handshakes; get them wrong, and you're cast into the abyss of 'redirect_uri_mismatch'.\n3. We receive mystical 'Client IDs' and 'Client Secrets'. The Secrets are so secret, we're not even sure *we* know them. We whisper them into environment variables, hoping the server doesn't spill the beans.\n4. The user (that's you!) clicks the button, gets whisked away to a land of permissions (often asking for your firstborn or the rights to name your next pet), and if you agree, you're sent back with a temporary 'authorization code'. This code has the lifespan of a mayfly in a hurricane.\n5. Our backend server, armed with this fleeting code and the aforementioned Secret, must then perform a daring high-speed data exchange with GitHub/X.com's servers to get an 'access token'. Think of it as trading a rare Pokémon card for an even rarer one, but the other trader is a grumpy ogre.\n6. ONLY THEN, with this precious access token, can we politely ask, "Excuse me, Mr. GitHub/X.com, who is this delightful user?" And maybe, just maybe, they tell us.\n\nFor the Web3 Wallets (Phantom, HandCash, MetaMask - oh my!):
1. Each wallet is its own unique snowflake, a special digital garden with its own set of tools and incantations. We can't just use one magic Web3 wand; oh no, that would be too easy!\n2. For 'Phantom' (the Solana charmer): We must learn the ancient Solana JSON RPC spells and dance with their SDK. It involves convincing your browser to chat with the Phantom extension, which is like trying to get two cats to willingly share a sunbeam.\n3. For 'HandCash' (the Bitcoin SV stalwart): This requires a deep dive into the HandCash Connect SDK, which is like a very specific IKEA instruction manual, but for digital cash. We'll be wrestling with permissions and user handles, ensuring every satoshi is accounted for, lest we anger the Bitcoin spirits.\n4. For 'MetaMask' (the Ethereum elder): We must interface with the 'window.ethereum' object, a mystical portal that only appears if MetaMask is installed and feeling cooperative. We then send requests like 'eth_requestAccounts' (pretty please, may we see your accounts?) and 'personal_sign' (could you just scrawl your digital autograph on this virtual napkin to prove it's you?). This signature then needs to be verified on our server, which involves arcane cryptographic rituals that make our CPUs sweat.\n5. For ALL wallets, we then need to figure out how to turn a public key or a signed message into a user session in *our* system, without accidentally giving away the keys to the kingdom or your digital socks.\n\nSo, as you can see, it's not just a 'quick fix'. It's a multi-front coding battle against the forces of complexity, API rate limits, and the occasional existential dread that comes with debugging asynchronous JavaScript. Our developers are bravely fighting these battles, fueled by coffee and the sheer audacity of hope. \n\nWe appreciate your pioneering spirit in clicking that button! Please check back later... maybe bring snacks?`;

    alert(`${availableMethods}\n\n${pendingMethods}${comicalExplanation}`);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Determine the base URL for redirection
      // Use NEXT_PUBLIC_SITE_URL if available (for Vercel), otherwise fallback to window.location.origin
      const redirectURLBase = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect to the auth callback handler
          redirectTo: `${redirectURLBase}/auth/callback`,
          queryParams: {
            access_type: 'offline', // Optional: if you need refresh tokens
            prompt: 'select_account',
          },
        },
      });

      if (signInError) {
        console.error('Google Sign-In Error:', signInError);
        setError(`Could not sign in with Google: ${signInError.message}`);
        setIsLoading(false);
      }
    } catch (e: any) {
      console.error('Unexpected Google Sign-In Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting GitHub Sign-In...');
    // Placeholder for GitHub OAuth
    setIsLoading(false);
    showPendingFeatureAlert();
  };

  const handleXSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting X/Twitter Sign-In...');
    // Placeholder for X/Twitter OAuth
    setIsLoading(false);
    showPendingFeatureAlert();
  };

  const handlePhantomSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting Phantom Wallet Sign-In...');
    // Placeholder for Phantom Wallet integration
    setIsLoading(false);
    showPendingFeatureAlert();
  };

  const handleHandCashSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting HandCash Wallet Sign-In...');
    // Placeholder for HandCash Wallet integration
    setIsLoading(false);
    showPendingFeatureAlert();
  };

  const handleMetaMaskSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting MetaMask Wallet Sign-In...');
    // Placeholder for MetaMask Wallet integration
    setIsLoading(false);
    showPendingFeatureAlert();
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignUpMode) return;
    setIsAuthProcessing(true);
    setError(null);
    setSignUpMessage(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Email Sign-In Error:', signInError);
        setError(`Could not sign in: ${signInError.message}`);
      } else {
        // onAuthStateChange will handle redirect if successful
      }
    } catch (e: any) {
      console.error('Unexpected Email Sign-In Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAuthProcessing(true);
    setError(null);
    setRecoveryEmailSent(false);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`
      });

      if (resetError) {
        console.error('Password Reset Error:', resetError);
        setError(`Could not send recovery email: ${resetError.message}`);
      } else {
        setRecoveryEmailSent(true);
        setError(null);
      }
    } catch (e: any) {
      console.error('Unexpected Password Reset Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handleEmailPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSignUpMode) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsAuthProcessing(true);
    setError(null);
    setSignUpMessage(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error('Email Sign-Up Error:', signUpError);
        setError(`Could not sign up: ${signUpError.message}`);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        setSignUpMessage('Sign-up successful. Please check your email to confirm your account if required.');
        setError(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else if (data.user) {
        setSignUpMessage('Sign-up successful! Please check your email to confirm your account.');
        setError(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Sign up did not complete as expected. Please try again.');
      }
    } catch (e: any) {
      console.error('Unexpected Email Sign-Up Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setIsAuthProcessing(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[LoginPage] Auth Event: ${event}`);
      if (event === 'SIGNED_IN' && session) {
        console.log('[LoginPage] SIGNED_IN event, redirecting.');
        const searchParams = new URLSearchParams(window.location.search);
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/profile');
      } else if (event === 'SIGNED_OUT') {
        console.log('[LoginPage] SIGNED_OUT event.');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && window.location.pathname === '/login') {
        console.log('[LoginPage] Initial session exists and user is on /login. Redirecting.');
        const searchParams = new URLSearchParams(window.location.search);
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/profile');
      } else if (!session) {
        console.log('[LoginPage] No initial session found.');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const currentFormHandler = isSignUpMode ? handleEmailPasswordSignUp : (showRecoveryInput ? handlePasswordRecovery : handleEmailPasswordSignIn);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
      <div className="bg-black p-6 md:py-8 md:px-10 border border-gray-800 shadow-2xl rounded-lg text-center max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-white mb-4">{isSignUpMode ? 'Create Account' : 'Login'}</h1>
        <p className="text-gray-400 mb-6">
          {isSignUpMode ? 'Join us to access your profile and tools.' : 'Access your profile and application tools.'}
        </p>

        <form onSubmit={currentFormHandler} className="space-y-4 mb-6">
          {!recoveryEmailSent && (
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                  placeholder="you@example.com"
                  disabled={isAuthProcessing}
                />
              </div>
            </div>
          )}

          {!isSignUpMode && !showRecoveryInput && !recoveryEmailSent && (
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUpMode ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                  placeholder="Password"
                  disabled={isAuthProcessing}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {isSignUpMode && !recoveryEmailSent && (
            <>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                    placeholder="Password"
                    disabled={isAuthProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                    placeholder="Confirm Password"
                    disabled={isAuthProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {!recoveryEmailSent && (
            <div>
              <button
                type="submit"
                disabled={isAuthProcessing || !email || (!isSignUpMode && !showRecoveryInput && !password) || (isSignUpMode && !confirmPassword)}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isAuthProcessing ? (isSignUpMode ? 'Creating Account...' : (showRecoveryInput ? 'Sending Email...' : 'Signing in...')) : (isSignUpMode ? 'Sign Up' : (showRecoveryInput ? 'Send Recovery Email' : 'Sign in with Email'))}
              </button>
            </div>
          )}

          {!isSignUpMode && !showRecoveryInput && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowRecoveryInput(true)}
                className="text-sm font-medium text-sky-400 hover:text-sky-300 focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
          )}

          {recoveryEmailSent && (
            <p className="my-3 text-sm text-green-400 bg-green-900/20 p-2 rounded-md">
              Password recovery email sent. Please check your inbox.
            </p>
          )}

        </form>

        {error && !recoveryEmailSent && (
          <p className="my-3 text-sm text-red-400 bg-red-900/20 p-2 rounded-md">{error}</p>
        )}
        {signUpMessage && !recoveryEmailSent && (
          <p className="my-3 text-sm text-green-400 bg-green-900/20 p-2 rounded-md">{signUpMessage}</p>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-gray-900 text-sm text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-700 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:opacity-50 transition-colors"
          >
            <FaGoogle className="mr-2 -ml-1 w-5 h-5" />
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={handlePhantomSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-700 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:opacity-50 transition-colors"
          >
            <SiSolana className="mr-2 -ml-1 w-5 h-5" />
            Sign in with Phantom
          </button>
          <button
            type="button"
            onClick={handleGitHubSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-700 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:opacity-50 transition-colors"
          >
            <FaGithub className="mr-2 -ml-1 w-5 h-5" />
            Sign in with GitHub
          </button>
          <button
            type="button"
            onClick={handleHandCashSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-700 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:opacity-50 transition-colors"
          >
            <FaCreditCard className="mr-2 -ml-1 w-5 h-5" />
            Sign in with HandCash
          </button>
          <button
            type="button"
            onClick={handleXSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-700 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:opacity-50 transition-colors"
          >
            <FaTwitter className="mr-2 -ml-1 w-5 h-5" />
            Sign in with X.com
          </button>
          <button
            type="button"
            onClick={handleMetaMaskSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-700 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:opacity-50 transition-colors"
          >
            <FaEthereum className="mr-2 -ml-1 w-5 h-5" />
            Sign in with MetaMask
          </button>
        </div>
        <div className="mt-6 text-sm">
          {isSignUpMode ? (
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => { setIsSignUpMode(false); setError(null); setSignUpMessage(null); }}
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={() => { setIsSignUpMode(true); setError(null); setSignUpMessage(null); }}
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
        <div className="mt-8">
          <Link href="/"
            className="text-sky-400 hover:text-sky-300 transition-colors duration-150">
            &larr; Go back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 