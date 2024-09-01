import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll'; // For smooth scrolling
import { useNavigate } from 'react-router-dom'; // For navigation
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Adjust path as needed
import './Navbar.css'; // Import your CSS file

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showSearch, setShowSearch] = useState(false);
  const [user, setUser] = useState(null); // Track user authentication state
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowSearch(scrollPosition > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to the register page
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Navigate to home or any other page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleProfileClick = () => {
    navigate('/freelancer-profile'); // Navigate to freelancer profile page
  };

  const navbarStyle = {
    position: 'fixed',
    top: '0',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.5)',
    color: '#333',
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    zIndex: '1000'
  };

  const containerStyle = {
    display: 'flex',
    width: '100%',
    maxWidth: '1200px',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    position: 'relative'
  };

  const logoStyle = {
    fontSize: '24px',
    margin: '0',
    color: '#333'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '20px',
    flex: '1',
    justifyContent: 'flex-end'
  };

  const linkStyle = {
    color: '#333',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '5px',
    fontWeight: '500',
    position: 'relative',
    display: 'inline-block',
    transition: 'color 0.3s ease'
  };

  const activeLinkStyle = {
    color: 'rgb(1, 11, 231)'
  };

  const registerLinkStyle = {
    color: 'rgb(1, 11, 231)',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '5px',
    fontWeight: '500',
    marginLeft: '10px',
    transition: 'color 0.3s ease'
  };

  return (
    <div style={navbarStyle}>
      <div style={containerStyle}>
        <h1 style={logoStyle}>Skill-X</h1>
        <div className={`search-container ${showSearch ? 'show' : ''}`}>
          <input
            type="text"
            placeholder="Search for services..."
            className="search-bar"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
        <nav style={navLinksStyle}>
          {['home', 'about', 'services', 'contact'].map((section) => (
            <ScrollLink
              key={section}
              to={section}
              smooth={true}
              duration={500}
              style={{ 
                ...linkStyle, 
                ...(activeSection === section ? activeLinkStyle : {}) 
              }}
              onSetActive={() => setActiveSection(section)}
              spy={true}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </ScrollLink>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
          {user ? (
            <>
              <img
                src={user.photoURL || '/default-profile.png'}
                alt="Profile"
                style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
                onClick={handleProfileClick} // Navigate to freelancer profile on click
              />
              <button className="btn-18" onClick={handleLogoutClick}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn-17" onClick={handleLoginClick}>
                Login
              </button>
              <a href="/register" style={registerLinkStyle}>
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
