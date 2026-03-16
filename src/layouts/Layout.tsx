import Footer from '@/components/UI/Footer';
import Header from '@/components/UI/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16"> {/* pt-16 to offset fixed header */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;