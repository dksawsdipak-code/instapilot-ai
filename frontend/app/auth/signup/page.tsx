'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error, setError } = useAuthStore();
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setError(null);
    
    // Validation
    if (!full_name || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    try {
      await signup(email, full_name, password);
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setLocalError(errorMessage);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark/95 to-dark/90 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-secondary transition mb-8">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        {/* Card */}
        <div className="bg-dark/50 border border-primary/20 rounded-lg p-8 backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Create Account</span>
            </h1>
            <p className="text-gray-400">Join InstaPilot AI today</p>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {displayError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition"
                required
                disabled={isLoading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-white hover:shadow-lg transition disabled:opacity-50 btn-glow"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-primary/20"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-primary/20"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400 mb-2">Already have an account?</p>
            <Link
              href="/auth/login"
              className="text-primary hover:text-secondary transition font-semibold"
            >
              Sign in here
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>By signing up, you agree to our <Link href="#" className="text-primary hover:text-secondary">Terms of Service</Link></p>
        </div>
      </div>
    </div>
  );
}
