import React from 'react';

import aboutImage from '../assets/about.jpg'; // Add your image here

const AboutSection = () => {
  const aboutContainerStyle = {
    padding: '60px 20px',
    background: '#f4f4f4',
    color: '#333',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    opacity: '0',
    animation: 'fadeIn 1s forwards'
  };

  const imgStyle = {
    width: '100%',
    height: 'auto',
    maxWidth: '600px',
    borderRadius: '10px',
    marginLeft: '40px',
    transform: 'translateX(-50px) rotate(5deg)', // Slight rotation for effect
    animation: 'slideInLeft 1s forwards, zoomIn 1s forwards'
  };

  const textStyle = {
    marginRight: '40px',
    maxWidth: '600px',
    transform: 'translateX(50px)',
    animation: 'slideInRight 1s forwards, zoomIn 1s forwards',
    transition: 'text-shadow 0.3s ease-in-out',
  };

  const headingStyle = {
    fontSize: '2em', // Larger heading font size
    marginBottom: '20px',
    color: '#333'
  };

  const paragraphStyle = {
    fontSize: '1em', // Larger paragraph font size
    lineHeight: '1.6',
    color: '#555'
  };

  return (
    <div style={aboutContainerStyle} id="about">
      <img src={aboutImage} alt="About Skill-X" style={imgStyle} />
      <div style={textStyle}>
        <h2 style={headingStyle}>About Skill-X</h2>
        <p style={paragraphStyle}>
          Skill-X is dedicated to connecting talented freelancers with high-quality projects. 
          Our platform offers a seamless experience for both freelancers and clients, providing 
          tools and resources to ensure successful collaborations. We focus on delivering top-notch 
          opportunities in various fields including technology, design, and marketing. 
          Our user-friendly interface and dedicated support team are here to help you at every step, 
          ensuring that both freelancers and clients achieve their goals. Explore our diverse range of 
          services and find your next opportunity today with Skill-X.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
