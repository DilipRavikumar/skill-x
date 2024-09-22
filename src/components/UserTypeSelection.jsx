import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import "./UserTypeSelection.css"; // Import the external CSS

const UserTypeSelection = () => {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setUserType] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [uid, setUid] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setUid(user.uid);
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
      } else if (role === "buyer") {
        navigate("/buyer-form", {
          state: { displayName, username, role, email: userEmail },
        });
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="selection-container">
      {error && <p className="error-message">{error}</p>}
      {step === 0 && (
        <div>
          <h1>Enter your display name</h1>
          <input
            className="input"
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <button className="custom-button" onClick={handleNextStep}>Next</button>
        </div>
      )}
      {step === 1 && (
        <div>
          <h1>Enter your username</h1>
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="custom-button" onClick={handleNextStep}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
        <h1>Are you a freelancer or an employer?</h1>
        <div className="option-container">
          <button
            className="option-button"
            onClick={() => handleSelection("freelancer")}
          >
            Freelancer
          </button>
          <button
            className="option-button"
            onClick={() => handleSelection("buyer")}
          >
            Employer
          </button>
        </div>
      </div>
      )}
      {step === 3 && <button className="button" onClick={handleSubmit}>Submit</button>}
    </div>
  );
};

export default UserTypeSelection;
