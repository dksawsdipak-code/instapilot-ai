'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-dark/95 backdrop-blur-md border-b border-primary/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
            <span className="text-2xl font-bold gradient-text hidden sm:inline">
              InstaPilot AI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="hover:text-primary transition">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-primary transition">
              Pricing
            </Link>
            <Link href="#docs" className="hover:text-primary transition">
              Docs
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated() ? (
              <>
                <div className="text-right mr-4">
                  <p className="text-sm font-medium">{user?.full_name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="px-6 py-2 border border-primary/50 rounded-lg hover:bg-primary/10 transition cursor-pointer"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg hover:shadow-lg transition btn-glow flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-6 py-2 border border-primary/50 rounded-lg hover:bg-primary/10 transition cursor-pointer">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg hover:shadow-lg transition btn-glow">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-primary/20">
            <Link href="#features" className="block py-2 hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="block py-2 hover:text-primary">
              Pricing
            </Link>
            <Link href="#docs" className="block py-2 hover:text-primary">
              Docs
            </Link>
            <div className="flex gap-2 mt-4">
              {isAuthenticated() ? (
                <>
                  <Link href="/dashboard" className="flex-1 px-4 py-2 border border-primary rounded-lg text-center cursor-pointer">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 bg-primary rounded-lg text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="flex-1 px-4 py-2 border border-primary rounded-lg text-center cursor-pointer">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="flex-1 px-4 py-2 bg-primary rounded-lg text-center cursor-pointer">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
