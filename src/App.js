import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import Login from './components/Login';
import FreelancerProfile from './components/FreelancerProfile';
import FreelancerForm from './components/FreelancerForm';
import UserTypeSelection from './components/UserTypeSelection'; // Ensure this matches your component name
import './index.css';
import Register from './components/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} /> {/* Ensure this matches the route and component */}
        <Route path="/user-type-select" element={<UserTypeSelection />} /> {/* Corrected path */}
        <Route path="/freelancer-form" element={<FreelancerForm />} /> {/* Ensure this matches your component name */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <HeroSection />
              <AboutSection />
              <ServicesSection />
              <ContactSection />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
