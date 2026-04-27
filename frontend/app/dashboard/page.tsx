'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Home } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated() || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark/95 to-dark/90">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-dark/95 backdrop-blur-md border-b border-primary/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
              <span className="text-2xl font-bold gradient-text hidden sm:inline">
                InstaPilot AI
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.full_name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Welcome back, {user.full_name}!</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Your Instagram automation dashboard is ready to use.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Connected Accounts', value: '0', icon: '📱' },
            { label: 'Scheduled Posts', value: '0', icon: '📅' },
            { label: 'This Month\'s Reach', value: '0', icon: '👥' },
          ].map((stat, index) => (
            <div key={index} className="bg-dark/50 border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              title: 'Create Post',
              description: 'Generate and schedule Instagram posts powered by AI',
              icon: '✨',
              href: '#',
            },
            {
              title: 'Connect Account',
              description: 'Link your Instagram account to manage content',
              icon: '🔗',
              href: '#',
            },
            {
              title: 'Analytics',
              description: 'View detailed insights about your posts',
              icon: '📊',
              href: '#',
            },
            {
              title: 'Settings',
              description: 'Manage your account preferences and billing',
              icon: '⚙️',
              href: '#',
            },
          ].map((feature, index) => (
            <a
              key={index}
              href={feature.href}
              className="group bg-dark/50 border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition cursor-pointer"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </a>
          ))}
        </div>

        {/* Empty State CTA */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-6">
            Connect your first Instagram account and start creating amazing content with AI.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:shadow-lg transition btn-glow">
            Connect Instagram Account
          </button>
        </div>
      </div>
    </div>
  );
}
