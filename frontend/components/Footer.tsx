'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="docs" className="border-t border-primary/20 mt-20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
              <span className="font-bold gradient-text">InstaPilot AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered Instagram automation for creators and businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-400 mb-4">Get in touch with our team.</p>
            <Link href="#features" className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary rounded-lg hover:bg-primary/30 transition text-sm cursor-pointer">
              <Mail size={16} />
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary/20 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 InstaPilot AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
