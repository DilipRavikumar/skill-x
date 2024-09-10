import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

// Import the images
import mainImage from "../assets/Home.png";
import cubeImage from "../assets/cube.png"; // Replace with your cube image path
import spiralImage from "../assets/spiral.png"; // Replace with your spiral image path
import crushImage from "../assets/crush.png"; // Replace with your crush image path

const HeroContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(244, 244, 244);
  color: #000;
  text-align: left;
  padding: 20px;
  position: relative;
  overflow: hidden;
  animation: fadeIn 1.5s ease-out;

  .text-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start; /* Align items to the start on larger screens */
    text-align: left; /* Align text to the left */
    position: relative;
    z-index: 2;
    animation: slideInLeft 1.5s ease-out;
  }

  h1 {
    margin-left:80px;
    font-size: 4rem;
    font-weight: bold;
    line-height: 1.2;
    animation: zoomIn 1.5s ease-out;
  }

  p {
    font-size: 1.5rem;
    margin-left:80px;
    margin-top: 20px;
    animation: zoomIn 1.5s ease-out;
  }

  .button-container {
    margin-left:80px;
    margin-top: 20px;
    display: flex;
    gap: 20px;
    justify-content: flex-start; /* Align buttons to the start on larger screens */
    position: relative;
    z-index: 3;
  }

  .button {
    padding: 0.8em 1.6em;
    border: none;
    border-radius: 100px;
    font-weight: bold;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    color: rgb(1, 11, 231);
    transition: all 1000ms;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    outline: 2px solid rgb(1, 11, 231);
  }

  .button:hover {
    color: #ffffff;
    transform: scale(1.1);
    outline: 2px solid rgb(1, 11, 231);
    box-shadow: 4px 5px 17px -4px #268391;
  }

  .button::before {
    content: "";
    position: absolute;
    left: -50px;
    top: 0;
    width: 0;
    height: 100%;
    background-color: rgb(1, 11, 231);
    transform: skewX(45deg);
    z-index: -1;
    transition: width 1000ms;
  }

  .button:hover::before {
    width: 250%;
  }

  .search-container1 {
    margin-left:80px;
    position: relative;
    margin-top: 20px;
    display: flex;
    align-items: center;
    animation: slideInRight 1.5s ease-out;
  }

  .search-bar1 {
    background-color: rgb(244, 244, 244);
    width: 300px;
    padding: 0.8em 2.5em 0.8em 1em;
    border: 2px solid rgb(1, 11, 231);
    border-radius: 50px;
    font-size: 14px;
    outline: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
  }

  .search-icon-container {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: rgb(1, 11, 231);
    font-size: 18px;
    transition: transform 0.3s;
  }

  .search-icon-container:hover {
    transform: translateY(-50%) scale(1.2);
  }

  .image-container {
    margin-left: 450px;
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .mainImage {
    margin-right: 200px;
    margin-top: 50px;
    width: 500px;
    height: 500px;
    z-index: 5;
    animation: zoomIn 1.5s ease-out;
  }

  .elementImage {
    position: absolute;
    animation: fadeIn 1.5s ease-out, rotate 20s linear infinite;
  }

  .crush {
    top: 10%;
    left: -200px;
    width: 100px;
  }

  .cube {
    top: -20px;
    right: 10px;
    width: 100px;
  }

  .spiral {
    bottom: -30px;
    right: 120px;
    width: 100px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-50px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(50px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes zoomIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Media Queries for Responsiveness */
  @media (max-width: 768px) {
    .text-container {
      align-items: center; /* Center items horizontally on mobile */
      text-align: center; /* Center text on mobile */
    }

    .button-container {
      flex-direction: column; /* Stack buttons vertically on mobile */
      gap: 10px;
      align-items: center; /* Center buttons horizontally on mobile */
    }

    .search-container1 {
      width: 100%;
      justify-content: center; /* Center search bar on mobile */
      margin-top: 20px;
    }

    .search-bar1 {
      width: 80%; /* Adjust width for mobile */
    }

    .image-container {
      display: none; /* Hide image container on mobile */
    }

    .elementImage {
      width: 80px; /* Adjust size of elements for mobile */
    }

    .crush {
      top: 15%;
      left: 0;
    }

    .cube {
      top: 0;
      right: 0;
    }

    .spiral {
      bottom: 0;
      right: 0;
    }
  }
`;

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleSearch = () => {
    navigate('/login'); // Navigate to the /login page
  };

  return (
    <HeroContainer id="home">
      <div className="text-container">
        <h1>
          <span>Welcome to </span>
          <span>Skill-X.</span>
        </h1>
        <p>Your gateway to top freelance opportunities.</p>
        <div className="button-container">
          <button className="button" onClick={() => navigate('/login')}>Hire</button>
          <button className="button" onClick={() => navigate('/login')}>Work</button>
        </div>
        <div className="search-container1">
          <input
            className="search-bar1"
            type="text"
            placeholder="Search for Services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <div className="search-icon-container" onClick={handleSearch}>
            <FaSearch />
          </div>
        </div>
      </div>
      <div className="image-container">
        <img src={mainImage} alt="Main" className="mainImage" />
        <img src={cubeImage} alt="Cube" className="elementImage cube" />
        <img src={spiralImage} alt="Spiral" className="elementImage spiral" />
        <img src={crushImage} alt="Crush" className="elementImage crush" />
      </div>
    </HeroContainer>
  );
};

export default HeroSection;
