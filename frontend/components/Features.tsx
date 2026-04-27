'use client';

import { Zap, Brain, Calendar, BarChart3, Lock, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Content Generation',
    description: 'Generate compelling Instagram captions and hashtags using advanced AI models.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Schedule posts at optimal times for maximum engagement and reach.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance metrics and gain insights into your audience behavior.',
  },
  {
    icon: Zap,
    title: 'One-Click Publishing',
    description: 'Post directly to Instagram with a single click from our platform.',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Enterprise-grade security with full encryption and privacy compliance.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Manage your Instagram campaigns on the go with our mobile app.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Powerful Features for
            <br />
            <span className="gradient-text">Content Creators</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to manage your Instagram presence professionally.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-lg card-hover bg-gradient-to-br from-primary/5 to-secondary/5"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
