import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db,auth } from '../firebaseConfig'; // Import the Firestore database

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
`;

const Button = styled.button`
  background: #007bff;
  color: #fff;
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin: 10px;
  transition: background 0.3s ease;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in-out forwards;

  &:hover {
    background: #0056b3;
  }
`;

const NewUser = () => {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  // Ensure the user's email is fetched correctly using onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        console.log('User is not signed in');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSelection = (type) => {
    setUserType(type);
    handleNextStep();
  };

  const handleSubmit = async () => {
    try {
      // Add the new user to Firestore, including email
      await addDoc(collection(db, 'users'), {
        displayName,
        username,
        userType,
        email: userEmail,
      });

      // Navigate to the respective form based on userType
      if (userType === 'freelancer') {
        navigate('/freelancer-form', { state: { displayName, username, userType, email: userEmail } });
      } else if (userType === 'employer') {
        navigate('/employer-form', { state: { displayName, username, userType, email: userEmail } });
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <SelectionContainer>
      {step === 0 && (
        <div>
          <h1>Enter your display name</h1>
          <Input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button onClick={handleNextStep}>Next</Button>
        </div>
      )}
      {step === 1 && (
        <div>
          <h1>Enter your username</h1>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onClick={handleNextStep}>Next</Button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h1>Are you a freelancer or an employer?</h1>
          <Button onClick={() => handleSelection('freelancer')} style={{ backgroundColor: userType === 'freelancer' ? '#0056b3' : '#007bff' }}>
            Freelancer
          </Button>
          <Button onClick={() => handleSelection('employer')} style={{ backgroundColor: userType === 'employer' ? '#0056b3' : '#007bff' }}>
            Employer
          </Button>
        </div>
      )}
      {step === 3 && (
        <Button onClick={handleSubmit}>
          Submit
        </Button>
      )}
    </SelectionContainer>
  );
};

export default NewUser;