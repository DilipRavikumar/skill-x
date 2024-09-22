import React, { useState, useEffect } from 'react';
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
import Chat from './Chat'; // Import your Chat component
import Sidebar from './Sidebar'; // Import your Sidebar component
import { getFirestore, collection, query, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import EscrowComponent from './components/Escrowcomponent';

const App = () => {
  const [users, setUsers] = useState([]); // Array of users for the sidebar
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [selectedChat, setSelectedChat] = useState(null); // Currently selected chat

  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const usersQuery = query(collection(firestore, "users"));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, [firestore]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/dashboard-freelancer" element={<FreelancerDashboard />} />
        <Route path="/dashboard-buyer" element={<BuyerDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/freelancer-form" element={<FreelancerForm />} />
        <Route path="/buyer-form" element={<BuyerForm />} />
        <Route path='/create-gig' element={<CreateGigPage />} />
        <Route path='/escrowcomponent' element={<EscrowComponent />} />
        <Route path="/chat/:chatId" element={<Chat selectedChat={selectedChat} />} />
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

      {selectedUser && (
        <div style={{ display: 'flex' }}>
          <Sidebar users={users} onUserClick={setSelectedUser} />
          {selectedChat ? (
            <Chat selectedChat={selectedChat} />
          ) : (
            <div>Select a chat to start messaging</div>
          )}
        </div>
      )}
    </Router>
  );
};

export default App;
