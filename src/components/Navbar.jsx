import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showSearch, setShowSearch] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowSearch(scrollPosition > 800);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleProfileClick = () => {
    navigate('/freelancer-profile');
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
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
    zIndex: '1000',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    padding: '0 20px',
    position: 'relative',
  };

  const logoStyle = {
    fontSize: '24px',
    color: '#333',
    flex: '1',
    margin: '0 auto', // Center the logo horizontally
    textAlign: isMobile ? 'center' : 'left',
    marginLeft: isMobile ? '100px' : '0',
    whiteSpace: 'nowrap', // Prevent text from wrapping
    textOverflow: 'ellipsis', // Add ellipsis if text overflows
    width: isMobile ? '100%' : 'auto',
  };

  const searchContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    visibility: showSearch ? 'visible' : 'hidden',
    width: isMobile ? '100%' : 'auto',
    marginBottom: isMobile ? '10px' : '0',
  };

  const searchBarStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '50px',
    outline: 'none',
    fontSize: '12px',
    width: showSearch ? '250px' : '0',
    opacity: showSearch ? '1' : '0',
    transform: showSearch ? 'scale(1)' : 'scale(0.8)',
    transition: 'width 0.5s ease, opacity 0.5s ease, transform 0.5s ease',
  };

  const searchIconStyle = {
    position: 'absolute',
    right: '10px',
    color: '#333',
    fontSize: '18px',
    pointerEvents: 'none',
  };

  const navLinksStyle = {
    display: isMobile ? (showMenu ? 'flex' : 'none') : 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '20px',
    flex: '1',
    justifyContent: 'center',
    width: isMobile ? '100%' : 'auto',
  };

  const navLinkStyle = {
    color: '#333',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '5px',
    fontWeight: '500',
    position: 'relative',
    display: 'inline-block',
    transition: 'color 0.3s ease',
  };

  const activeLinkStyle = {
    color: 'rgb(1, 11, 231)',
  };

  const authButtonsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginLeft: isMobile ? '0' : '20px',
    marginTop: isMobile ? '10px' : '0',
    width: isMobile ? '100%' : 'auto',
    justifyContent: 'space-between',
  };

  const profileImgStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
  };

  const menuToggleStyle = {
    display: isMobile ? 'block' : 'none',
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#333',
  };

  const btnStyle = {
    border: '0 solid',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: 'rgb(1, 11, 231)',
    cursor: 'pointer',
    fontFamily: `'Montserrat', sans-serif`,
    fontSize: '0.7em',
    fontWeight: '300',
    lineHeight: '30px',
    textTransform: 'uppercase',
    borderRadius: '25px',
    border: '2px solid rgb(1, 11, 231)',
    padding: '0.5rem 1.5rem',
    position: 'relative',
    transition: 'all 0.3s',
  };

  const btnHoverStyle = {
    backgroundColor: 'rgb(1, 11, 231)',
    color: '#fff',
    fontSize: '0.8em',
  };

  const btnActiveStyle = {
    backgroundColor: 'rgb(1, 11, 231)',
    borderColor: 'rgb(1, 11, 231)',
  };

  return (
    <div style={navbarStyle}>
      <div style={containerStyle}>
        <button style={menuToggleStyle} onClick={handleMenuToggle}>
          <i className="fas fa-bars"></i>
        </button>
        <h1 style={logoStyle}>Skill-X</h1>
        <div style={searchContainerStyle}>
          <input type="text" placeholder="Search for services..." style={searchBarStyle} />
          <i className="fas fa-search" style={searchIconStyle}></i>
        </div>
        <nav style={navLinksStyle}>
          {['home', 'about', 'services', 'contact'].map((section) => (
            <ScrollLink
              key={section}
              to={section}
              smooth={true}
              duration={500}
              style={{ 
                ...navLinkStyle, 
                ...(activeSection === section ? activeLinkStyle : {}) 
              }}
              onSetActive={() => setActiveSection(section)}
              spy={true}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </ScrollLink>
          ))}
        </nav>
        <div style={authButtonsStyle}>
          {user ? (
            <>
              <button
                className="btn btn-17"
                style={btnStyle}
                onClick={handleProfileClick}
              >
                Profile
              </button>
              <button
                className="btn btn-18"
                style={btnStyle}
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-17"
                style={btnStyle}
                onClick={handleLoginClick}
              >
                Login
              </button>
              {!isMobile && (
                <button
                  className="btn btn-18"
                  style={btnStyle}
                  onClick={handleRegisterClick}
                >
                  Register
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
