import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  padding: 60px 20px;
  background: #f4f4f4;  /* Light background for the container */
  color: #333;          /* Dark text color */
  text-align: center;

  h2 {
    margin-bottom: 20px;
    font-size: 2.5rem;
    color: #000;  /* Dark text color for the heading */
  }

  .contact-card {
    background: rgba(255, 255, 255, 0.2);  /* Transparent white background */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 30px;
    max-width: 500px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    backdrop-filter: blur(12px);  /* Glass effect */
    border: 1px solid rgba(255, 255, 255, 0.3);  /* Subtle border for depth */
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
      color: #000;  /* Dark label color */
    }

    .form-group input,
    .form-group textarea {
      width: calc(100% - 20px);
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #000;  /* Black border */
      border-radius: 5px;
      background: #fff;       /* White background */
      color: #000;            /* Black text color */
    }

    button {
      background: #000;  /* Black button background */
      color: #fff;       /* White button text color */
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.3s ease;
    }

    button:hover {
      background: #333;  /* Dark gray on hover */
    }

    .error-message {
      color: #ff6f6f;
      margin: 10px 0;
    }
  }
`;

const ContactSection = () => {
  return (
    <ContactContainer id="contact">
      <h2>Contact Us</h2>
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
          <button type="submit">Send Message</button>
        </form>
        {/* Display error messages if needed */}
        {/* <div className="error-message">Please fill out all required fields.</div> */}
      </div>
    </ContactContainer>
  );
};

export default ContactSection;
