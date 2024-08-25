import React from "react";
import styled from "styled-components";

// Import images
import homeImage1 from "../assets/home1.jpg";
import homeImage2 from "../assets/home2.jpg";
import homeImage3 from "../assets/home3.webp";
import homeImage4 from "../assets/home4.jpg";
import homeImage5 from "../assets/home5.jpg";

const HeroContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(244, 244, 244);
  color: #000;
  text-align: left;
  padding-left: 20px;
  position: relative;
  overflow: hidden;

  .text-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    margin-left: 100px;
    font-size: 4rem;
    font-weight: bold;
    line-height: 1.2;
  }

  h1 span {
    display: block;
  }

  p {
    font-size: 1.5rem;
    margin-left: 100px;
  }

  .button-container {
    margin-top: 20px;
    display: flex;
    gap: 20px;
    margin-left: 100px;
  }

  .button {
    padding: 0.8em 1.6em;
    border: none;
    border-radius: 100px;
    font-weight: bold;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    color: rgb(0, 123, 255);
    transition: all 1000ms;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    outline: 2px solid rgb(0, 123, 255);
  }

  .button:hover {
    color: #ffffff;
    transform: scale(1.1);
    outline: 2px solid rgb(0, 123, 255);
    box-shadow: 4px 5px 17px -4px #268391;
  }

  .button::before {
    content: "";
    position: absolute;
    left: -50px;
    top: 0;
    width: 0;
    height: 100%;
    background-color: rgb(0, 123, 255);
    transform: skewX(45deg);
    z-index: -1;
    transition: width 1000ms;
  }

  .button:hover::before {
    width: 250%;
  }

  .image-container {
  margin-left:450px;
      position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image {
    position: absolute;
    border-radius: 50%;
    border: 5px solid #ffffff;
    object-fit: cover;
  }

  .image1 {
    width: 240px;
    height: 240px;
    z-index: 5; /* Bring this image on top */
    top: -240px;
    left: -60px;
  }

  .image2 {
    width: 200px;
    height: 200px;
    z-index: ;
    top: -20px;
    left: -80px;
  }

  .image3 {
    width: 140px;
    height: 140px;
    z-index: 4;
    top: 140px;
    left: 20px;
  }

  .image4 {
    width: 160px;
    height: 160px;
    z-index: 2;
    top: 40px;
    left: 100px;
  }

  .image5 {
    width: 220px;
    height: 220px;
    z-index: 1;
    top: -140px;
    left: 90px;
  }
`;

const HeroSection = () => {
  return (
    <HeroContainer id="home">
      <div className="text-container">
        <h1>
          <span>Welcome to</span>
          <span>Skill-X.</span>
        </h1>
        <p>Your gateway to top freelance opportunities.</p>
        <div className="button-container">
          <button className="button">Hire</button>
          <button className="button">Work</button>
        </div>
      </div>
      <div className="image-container">
        <img className="image image1" src={homeImage1} alt="Home Image 1" />
        <img className="image image2" src={homeImage2} alt="Home Image 2" />
        <img className="image image3" src={homeImage3} alt="Home Image 3" />
        <img className="image image4" src={homeImage4} alt="Home Image 4" />
        <img className="image image5" src={homeImage5} alt="Home Image 5" />
      </div>
    </HeroContainer>
  );
};

export default HeroSection;
