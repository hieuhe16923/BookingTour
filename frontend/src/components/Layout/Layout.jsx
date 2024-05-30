import React from 'react';
import Header from './../Header/Header';
import Routers from '../../router/Routers';
import Footer from './../Footer/Footer';
import ScrollUpButton from '../Scrollup/Scrollup';
const Layout = () => {
   return (
      <>
         <Header />
         <Routers />
         <Footer />
         <ScrollUpButton /> {/* Include the ScrollUpButton component */}
      </>
   );
};

export default Layout;
