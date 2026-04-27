'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm text-primary">Powered by Advanced AI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
          <span className="gradient-text">Automate Your</span>
          <br />
          <span className="gradient-text">Instagram Success</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Create, schedule, and optimize Instagram posts with AI-powered content generation.
          Boost engagement, save time, and grow your audience effortlessly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="#features" className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold flex items-center gap-2 btn-glow">
            Start Free Trial
            <ArrowRight size={20} />
          </Link>
          <Link href="#pricing" className="px-8 py-4 border border-primary/50 rounded-lg font-semibold hover:bg-primary/10 transition cursor-pointer">
            Watch Demo
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-12 border-y border-primary/20">
          <div>
            <p className="text-3xl font-bold gradient-text">10K+</p>
            <p className="text-gray-400 text-sm">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold gradient-text">500K+</p>
            <p className="text-gray-400 text-sm">Posts Created</p>
          </div>
          <div>
            <p className="text-3xl font-bold gradient-text">4.9★</p>
            <p className="text-gray-400 text-sm">User Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
