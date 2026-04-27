'use client';

import Link from 'next/link';
import { BarChart, Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'Summer Vibes',
    likes: 1234,
    comments: 89,
    shares: 45,
    date: '2 days ago',
    status: 'published',
  },
  {
    id: 2,
    title: 'Beach Day',
    likes: 2456,
    comments: 234,
    shares: 123,
    date: '5 days ago',
    status: 'published',
  },
  {
    id: 3,
    title: 'New Product Launch',
    likes: 0,
    comments: 0,
    shares: 0,
    date: 'Today',
    status: 'scheduled',
  },
];

export default function Dashboard() {
  return (
    <section id="pricing" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">
          Your <span className="gradient-text">Dashboard</span>
        </h2>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Posts', value: '24', icon: TrendingUp },
            { label: 'Total Likes', value: '12.5K', icon: Heart },
            { label: 'Engagement', value: '8.5%', icon: BarChart },
            { label: 'Followers', value: '5.2K', icon: MessageCircle },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-lg card-hover bg-gradient-to-br from-primary/5 to-secondary/5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <Icon className="text-primary" size={32} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Posts */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6 card-hover">
          <h3 className="text-2xl font-bold mb-6">Recent Posts</h3>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-dark/50 rounded-lg border border-primary/10 hover:border-primary/30 transition"
              >
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{post.title}</h4>
                  <p className="text-sm text-gray-400">{post.date}</p>
                </div>

                <div className="flex items-center gap-6 mr-4">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-primary" />
                    <span className="text-sm">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={18} className="text-secondary" />
                    <span className="text-sm">{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 size={18} className="text-accent" />
                    <span className="text-sm">{post.shares}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.status === 'published'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <Link href="#features" className="px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold btn-glow">
            Create New Post
          </Link>
        </div>
      </div>
    </section>
  );
}
