import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import Login from './Login';
import FreelancerProfile from './components/FreelancerProfile';
import FreelancerForm from './components/FreelancerForm';
import './index.css';
import Register from './Register';
import NewUser from './components/UserTypeSelection';
import BuyerForm from './components/BuyerForm';
import CreateGigPage from './components/CreateGig';
import MainHome from './MainHome';
import FreelancerDashboard from './FreelancerDashboard';
import BuyerDashboard from './BuyerDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/dashboard-freelancer" element={<FreelancerDashboard/>}/>
        <Route path="/dashboard-buyer" element={<BuyerDashboard/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} /> {/* Ensure this matches the route and component */}
        <Route path="/newuser" element={<NewUser />} /> {/* Corrected path */}
        <Route path="/freelancer-form" element={<FreelancerForm />} />
        <Route path="/buyer-form" element={<BuyerForm />} />
        <Route path='/create-gig' element={<CreateGigPage/>} />
        <Route
          path="/Home"
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
