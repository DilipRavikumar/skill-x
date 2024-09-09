import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";

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

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin: 10px 0;
`;

const UserTypeSelection = () => {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setUserType] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [uid, setUid] = useState(null); // State to store user ID
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setUid(user.uid); // Store the user's UID
      } else {
        console.log("User is not signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNextStep = () => {
    if (step === 0 && !displayName) {
      setError("Display Name cannot be empty.");
      return;
    } else if (step === 1 && !username) {
      setError("Username cannot be empty.");
      return;
    } else if (step === 2 && !role) {
      setError("Please select a user type.");
      return;
    }
    setError("");
    setStep((prevStep) => prevStep + 1);
  };

  const handleSelection = (type) => {
    setUserType(type);
    handleNextStep();
  };

  const handleSubmit = async () => {
    if (!displayName || !username || !role) {
      setError("Please complete all fields before submitting.");
      return;
    }

    try {
      // Update the existing user document in Firestore
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, {
        displayName,
        username,
        role,
        email: userEmail,
      });

      if (role === "freelancer") {
        navigate("/freelancer-form", {
          state: { displayName, username, role, email: userEmail },
        });
      } else if (role === "employer") {
        navigate("/employer-form", {
          state: { displayName, username, role, email: userEmail },
        });
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <SelectionContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
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
          <Button
            onClick={() => handleSelection("freelancer")}
            style={{
              backgroundColor:
                role === "freelancer" ? "#0056b3" : "#007bff",
            }}
          >
            Freelancer
          </Button>
          <Button
            onClick={() => handleSelection("employer")}
            style={{
              backgroundColor: role === "employer" ? "#0056b3" : "#007bff",
            }}
          >
            Employer
          </Button>
        </div>
      )}
      {step === 3 && <Button onClick={handleSubmit}>Submit</Button>}
    </SelectionContainer>
  );
};

export default UserTypeSelection;
