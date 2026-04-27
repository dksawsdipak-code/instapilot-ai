'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, setError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setError(null);
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
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
              <span className="gradient-text">Sign In</span>
            </h1>
            <p className="text-gray-400">Welcome back to InstaPilot AI</p>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {displayError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link href="#" className="text-sm text-primary hover:text-secondary transition">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-white hover:shadow-lg transition disabled:opacity-50 btn-glow"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-primary/20"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-primary/20"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-400 mb-2">Don't have an account?</p>
            <Link
              href="/auth/signup"
              className="text-primary hover:text-secondary transition font-semibold"
            >
              Create one now
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>By signing in, you agree to our <Link href="#" className="text-primary hover:text-secondary">Terms of Service</Link></p>
        </div>
      </div>
    </div>
  );
}
