import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
  padding: 60px 20px;
  background: #333;
  color: #fff;
  text-align: center;

  h2 {
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;

    input, textarea {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: none;
      border-radius: 5px;
    }

    button {
      background: #0f0;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
  }
`;

const ContactSection = () => {
  return (
    <ContactContainer id="contact">
      <h2>Contact Us</h2>
      <form>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </ContactContainer>
  );
};

export default ContactSection;
