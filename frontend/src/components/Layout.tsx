import { ReactNode } from 'react';
import Navbar from './Navbar';
import HostNationStrip from './HostNationStrip';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell flex flex-col min-h-screen">
      <Navbar />
      <HostNationStrip />
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
