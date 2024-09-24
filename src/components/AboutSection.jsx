import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import aboutImage from "../assets/About.webp"; // Add your image here

const AboutContainer = styled.div`
  padding: 5% 3%; /* Adjusted padding */
  background: #f4f4f4;
  color: #333;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two columns layout */
  gap: 3%; /* Adjusted gap between image and text */
  opacity: 0; /* Initially hidden */
  transform: translateY(5%); /* Start slightly lower */
  transition: opacity 1s ease-out, transform 1s ease-out; /* Smooth transition */

  &.visible {
    opacity: 1;
    transform: translateY(0); /* Reset position when visible */
  }

  img {
    width: 100%;
    height: auto;
    max-width: 550px; /* Reduced max-width */
    border-radius: 5%; /* Slightly rounded corners */
    opacity: 0;
    transform: translateX(-10%) rotate(5deg); /* Slight rotation for effect */
    transition: opacity 1s ease-out, transform 1s ease-out;
  }

  &.visible img {
    opacity: 1;
    transform: translateX(0) rotate(0); /* Slide-in and zoom-in when visible */
  }

  .text-container {
    max-width: 100%;
    opacity: 0;
    transform: translateX(10%);
    transition: opacity 1s ease-out, transform 1s ease-out;
  }

  &.visible .text-container {
    opacity: 1;
    transform: translateX(0); /* Slide-in and zoom-in when visible */
  }

  h1 {
    margin: 1% 0 7% 13%;
    margin-bottom: 2%;
    color: #333;
    font-size: 2.5vw; /* Adjusted font size */
  }

  p {
    font-size: 1.2vw; /* Adjusted font size */
    line-height: 1.5; /* Adjusted line-height for readability */
    color: #555;
  }

  /* Media Queries */
  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column layout */
    padding: 4% 2%;
    img {
      max-width: 70%; /* Adjusted max-width for smaller screens */
      margin: 0 auto; /* Center image */
      transform: translateX(0) rotate(0); /* Reset transformation */
    }

    .text-container {
      max-width: 90%; /* Larger max-width for smaller screens */
      margin: 0 auto; /* Center text */
    }

    h1 {
      font-size: 4vw; /* Increased font size for smaller screens */
    }

    p {
      font-size: 2vw; /* Increased font size for smaller screens */
    }
  }

  @media (max-width: 480px) {
    padding: 3% 1%;

    img {
      max-width: 90%; /* Max-width adjusted for very small screens */
    }

    .text-container {
      max-width: 100%; /* Larger max-width for very small screens */
    }

    h1 {
      font-size: 7vw; /* Larger font size for very small screens */
    }

    p {
    
      font-size: 3vw; /* Larger font size for very small screens */
    }
  }
`;

const AboutSection = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          aboutRef.current.classList.add("visible");
          observer.unobserve(entry.target); // Optional: Unobserve after animation to avoid triggering again
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  return (
    <AboutContainer ref={aboutRef} id="about">
      <img src={aboutImage} alt="About Skill-X" />
      <div className="text-container">
        <h1>About Skill-X</h1>
        <p>
          Skill-X is dedicated to connecting talented freelancers with
          high-quality projects. Our platform offers a seamless experience for
          both freelancers and clients, providing tools and resources to ensure
          successful collaborations. We focus on delivering top-notch
          opportunities in various fields including technology, design, and
          marketing. Our user-friendly interface and dedicated support team are
          here to help you at every step, ensuring that both freelancers and
          clients achieve their goals. Explore our diverse range of services and
          find your next opportunity today with Skill-X.
        </p>
      </div>
    </AboutContainer>
  );
};

export default AboutSection;
