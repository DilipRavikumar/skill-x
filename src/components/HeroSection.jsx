import React from "react";
import styled from "styled-components";
import heroImage from "../assets/intro-bg.jpg"; // Add your image here

const HeroContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url(${heroImage}) no-repeat center center/cover;
  color: #fff;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  h1 {
    position: relative;
    z-index: 2;
    font-size: 4rem;
    margin: 0;
  }

  p {
    position: relative;
    z-index: 2;
    font-size: 1.5rem;
    margin: 20px 0; /* Add some spacing between the text and button */
  }
`;

const Button = styled.button`
  position: relative;
  overflow: hidden;
  border: 1px solid #18181a;
  color: #18181a;
  display: inline-block;
  font-size: 15px;
  line-height: 15px;
  padding: 18px 18px 17px;
  text-decoration: none;
  cursor: pointer;
  background: #fff;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  margin: 10px; /* Add margin to separate buttons */
  
  span:first-child {
    position: relative;
    transition: color 600ms cubic-bezier(0.48, 0, 0.12, 1);
    z-index: 10;
  }

  span:last-child {
    color: white;
    display: block;
    position: absolute;
    bottom: 0;
    transition: all 500ms cubic-bezier(0.48, 0, 0.12, 1);
    z-index: 100;
    opacity: 0;
    top: 50%;
    left: 50%;
    transform: translateY(225%) translateX(-50%);
    height: 14px;
    line-height: 13px;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -50%;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    transform-origin: bottom center;
    transition: transform 600ms cubic-bezier(0.48, 0, 0.12, 1);
    transform: skewY(9.3deg) scaleY(0);
    z-index: 50;
  }

  &:hover:after {
    transform-origin: bottom center;
    transform: skewY(9.3deg) scaleY(2) translateY(-10%);
  }

  &:hover span:last-child {
    transform: translateX(-50%) translateY(-50%);
    opacity: 1;
    transition: all 900ms cubic-bezier(0.48, 0, 0.12, 1);
  }
`;

const HeroSection = () => {
  return (
    <HeroContainer id="home">
      <h1>Welcome to Skill-X</h1>
      <p>Your gateway to top freelance opportunities.</p>
      <Button aria-label="Hire a freelancer">
        <span>Hire a Freelancer</span>
        <span>Hire it !</span>
      </Button>
      <Button aria-label="Earn money freelancing">
        <span>Earn Money Freelancing</span>
        <span>Earn It !</span>
      </Button>
    </HeroContainer>
  );
};

export default HeroSection;
