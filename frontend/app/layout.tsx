import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InstaPilot AI - AI-Powered Instagram Automation',
  description: 'Create, schedule, and optimize Instagram posts with AI-powered content generation.',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23E1306C"/><text x="50" y="60" font-size="60" font-weight="bold" text-anchor="middle" fill="white">A</text></svg>',
        sizes: 'any',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark">{children}</body>
    </html>
  );
}
