import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  padding: 60px 20px;
  background: #f4f4f4; /* Light background for the container */
  color: #333; /* Dark text color */
  min-height: 100vh; /* Ensures the container covers the full viewport height */
  box-sizing: border-box; /* Includes padding in the element's total width and height */
  display: flex; /* Flexbox for layout */
  justify-content: space-between; /* Distribute space between the items */
  align-items: flex-start; /* Align items at the start of the container */
  gap: 20px; /* Space between the text and the card */
  
  .contact-info {
    margin-top:100px;
    margin-left:150px;
    flex: 1; /* Grow to fill available space */
    max-width: 600px; /* Maximum width for the text section */
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center items vertically */
    text-align: left;
    
    p {
      font-size: 1.2rem;
      color: #333;
    }

    .contact-info-item {
      margin-bottom: 15px;
    }

    .quote {
      font-style: italic;
      margin-top: 30px;
      font-size: 1.5rem;
      color: #555;
    }

    .cta {
      margin-top: 20px;
      font-size: 1.2rem;
      font-weight: bold;
      color: #007bff; /* Primary color for CTA */
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .contact-card {
    margin-top:100px;
    margin-right:150px;
    flex: 0 0 300px; /* Fixed width for the contact card */
    background: #fff; /* White background */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 30px;
    border: 1px solid rgba(255, 255, 255, 0.3); /* Subtle border for depth */
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;

    .form-group {
      width: 100%;
      margin: 10px 0;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #000; /* Dark label color */
    }

    .form-group input,
    .form-group textarea {
      width: calc(100% - 20px);
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #000; /* Black border */
      border-radius: 5px;
      background: #fff; /* White background */
      color: #000; /* Black text color */
    }

    button.contact-send {
      padding: 0.8em 1.6em;
      border: none;
      border-radius: 5px;
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

    button.contact-send:hover {
      color: #ffffff;
      transform: scale(1.1);
      outline: 2px solid rgb(1, 11, 231);
      box-shadow: 4px 5px 17px -4px #268391;
    }

    button.contact-send::before {
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

    button.contact-send:hover::before {
      width: 250%;
    }

    .error-message {
      color: #ff6f6f;
      margin: 10px 0;
    }
  }

  /* Media Queries */
  @media (max-width: 768px) {
    flex-direction: column; /* Stack vertically on smaller screens */
    padding: 40px 10px;

    .contact-info,
    .contact-card {
      width: 100%;
      margin: 0 auto;
    }

    .contact-card {
      margin-top: 20px; /* Add space above contact card */
      margin-left: 0; /* Reset left margin for smaller screens */
      flex: none; /* Remove flex properties for smaller screens */
    }

    .contact-info {
      margin-right: 0; /* Reset right margin for smaller screens */
    }
  }
`;

const ContactSection = () => {
  return (
    <ContactContainer id="contact">
      <div className="contact-info">
        <h1>Contact Us</h1>
        <p className="quote">"We are here to assist you with any inquiries you may have."</p>

        <div className="contact-info-item">
          <p><strong>Phone:</strong> +91 9944937333</p>
        </div>
        <div className="contact-info-item">
          <p><strong>Email:</strong> contact@skillx.com</p>
        </div>
        <div className="cta">Get in Touch</div>
      </div>
      <div className="contact-card">
        <form>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea id="message" placeholder="Your Message" rows="5" required></textarea>
          </div>
          <button type="submit" className="contact-send">Send Message</button>
        </form>
        {/* Display error messages if needed */}
        {/* <div className="error-message">Please fill out all required fields.</div> */}
      </div>
    </ContactContainer>
  );
};

export default ContactSection;
