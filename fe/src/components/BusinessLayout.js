import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BusinessNavBar from './BusinessNavBar';


const BusinessLayout = () => {
  return (
    <div>
      <Header />
      <BusinessNavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default BusinessLayout;
