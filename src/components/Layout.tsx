
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useBreakpoint } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  className?: string;
}

export default function Layout({ children, hideFooter = false, className = "" }: LayoutProps) {
  const breakpoint = useBreakpoint();
  
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      <Navbar />
      <main className={`flex-grow ${breakpoint === 'mobile' ? 'pt-16' : 'pt-20'}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
