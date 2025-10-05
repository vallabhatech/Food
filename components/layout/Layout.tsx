import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import NotificationContainer from '../ui/NotificationContainer';
import ExpirationChecker from '../ExpirationChecker';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      <NotificationContainer />
      <ExpirationChecker />
    </div>
  );
};

export default Layout;