import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import aboutImage from "../assets/About.webp"; // Add your image here

const AboutContainer = styled.div`
  padding: 60px 20px;
  background: #f4f4f4;
  color: #333;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  opacity: 0; /* Initially hidden */
  transform: translateY(20px); /* Start slightly lower */
  transition: opacity 1s ease-out, transform 1s ease-out; /* Smooth transition */

  &.visible {
    opacity: 1;
    transform: translateY(0); /* Reset position when visible */
  }

  img {
    width: 100%;
    height: auto;
    max-width: 600px;
    border-radius: 10px;
    margin-left: 40px;
    opacity: 0;
    transform: translateX(-50px) rotate(5deg); /* Slight rotation for effect */
    transition: opacity 1s ease-out, transform 1s ease-out;
  }

  &.visible img {
    opacity: 1;
    transform: translateX(0) rotate(0); /* Slide-in and zoom-in when visible */
  }

  .text-container {
    margin-right: 40px;
    max-width: 600px;
    opacity: 0;
    transform: translateX(50px);
    transition: opacity 1s ease-out, transform 1s ease-out;
  }

  &.visible .text-container {
    opacity: 1;
    transform: translateX(0); /* Slide-in and zoom-in when visible */
  }

  h1 {
    margin: 10px 0;
    margin-bottom: 20px;
    color: #333;
  }

  p {
    font-size: 1em; /* Larger paragraph font size */
    line-height: 1.6;
    color: #555;
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
