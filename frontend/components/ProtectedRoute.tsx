'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
