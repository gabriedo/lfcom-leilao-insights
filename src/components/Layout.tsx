
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useBreakpoint } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  className?: string;
  removeHeaderSpace?: boolean;
}

export default function Layout({ children, hideFooter = false, className = "", removeHeaderSpace = false }: LayoutProps) {
  const breakpoint = useBreakpoint();
  const location = useLocation();
  const [isDarkHeader, setIsDarkHeader] = useState(false);
  
  useEffect(() => {
    // Set dark header for specific pages
    setIsDarkHeader(location.pathname === '/assessoria');
  }, [location.pathname]);
  
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      <Navbar isDarkMode={isDarkHeader} />
      <main className={`flex-grow ${removeHeaderSpace ? '' : (breakpoint === 'mobile' ? 'pt-20' : 'pt-24')}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
