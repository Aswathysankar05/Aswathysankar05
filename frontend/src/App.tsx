import React from 'react';
import './App.css';
import './layouts/HomePage/HomePageStyles.css';
import { ServicedeskHome } from './layouts/HomePage/ServicedeskHome';
import ServicesPage from './layouts/HomePage/ServicesPage';
import Footer from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';

const App: React.FC = () => {
return (

  <div>
    <div>     
      <Navbar/>
      <ServicedeskHome/>
      <ServicesPage/>
      <Footer/>
    </div>
  </div>
 
 
  );
};

export default App;
