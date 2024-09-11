import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "./HeroSection.css"; // Import the external CSS file

// Import the images
import mainImage from "../assets/Home.png";
import cubeImage from "../assets/cube.png"; // Replace with your cube image path
import spiralImage from "../assets/spiral.png"; // Replace with your spiral image path
import crushImage from "../assets/crush.png"; // Replace with your crush image path

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleSearch = () => {
    navigate('/login'); // Navigate to the /login page
  };

  return (
    <div className="hero-container" id="home">
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
        <img src={mainImage} className="main-image" alt="Main Illustration" />
        <img src={crushImage} className="element-image crush" alt="Crush Element" />
        <img src={cubeImage} className="element-image cube" alt="Cube Element" />
        <img src={spiralImage} className="element-image spiral" alt="Spiral Element" />
      </div>
    </div>
  );
};

export default HeroSection;
