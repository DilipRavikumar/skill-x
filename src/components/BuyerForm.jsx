import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const BuyerForm = () => {
  const [formValues, setFormValues] = useState({
    bio: "",
    preferredLocations: [],
    languagesKnown: [],
  });
  const [preferredLocationInput, setPreferredLocationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const firestore = getFirestore();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userEmail = currentUser.email;

        const q = query(
          collection(firestore, "users"),
          where("email", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setFormValues(docSnap.data());
        }
      } else {
        setUser(null);
        setFormValues({
          bio: "",
          preferredLocations: [],
          languagesKnown: [],
        });
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handlePreferredLocationInputChange = (e) => {
    setPreferredLocationInput(e.target.value);
  };

  const handleLanguageInputChange = (e) => {
    setLanguageInput(e.target.value);
  };

  const handleTagKeyPress = (e, field) => {
    if (
      e.key === "Enter" &&
      (field === "preferredLocations"
        ? preferredLocationInput.trim()
        : languageInput.trim())
    ) {
      e.preventDefault();
      setFormValues((prevState) => ({
        ...prevState,
        [field]: Array.isArray(prevState[field])
          ? [
              ...prevState[field],
              field === "preferredLocations"
                ? preferredLocationInput.trim()
                : languageInput.trim(),
            ]
          : [
              field === "preferredLocations"
                ? preferredLocationInput.trim()
                : languageInput.trim(),
            ],
      }));
      if (field === "preferredLocations") {
        setPreferredLocationInput("");
      } else {
        setLanguageInput("");
      }
    }
  };

  const handleRemoveTag = (field, tagToRemove) => {
    setFormValues((prevState) => ({
      ...prevState,
      [field]: Array.isArray(prevState[field])
        ? prevState[field].filter((tag) => tag !== tagToRemove)
        : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const userEmail = user.email;

        const q = query(
          collection(firestore, "users"),
          where("email", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = doc(firestore, "users", querySnapshot.docs[0].id);
          await setDoc(docRef, formValues, { merge: true });
          navigate('/');
        } else {
          console.error("No matching employer document found");
        }
      } catch (error) {
        console.error("Error saving employer data: ", error);
      }
    } else {
      console.error("No user is signed in");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Employer Profile</h1>
      <div className="form-field">
        <label htmlFor="bio" className="form-label">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          rows="4"
          value={formValues.bio || ""}
          onChange={handleInputChange}
          className="form-textarea"
        />
      </div>
      <div className="form-field">
        <label htmlFor="preferredLocations" className="form-label">Preferred Locations:</label>
        <div className="tag-list">
          {formValues.preferredLocations?.map((location, index) => (
            <div key={index} className="tag">
              {location}
              <span
                className="remove-tag"
                onClick={() => handleRemoveTag("preferredLocations", location)}
              >
                &times;
              </span>
            </div>
          ))}
          <input
            type="text"
            placeholder="Type a location and press Enter"
            value={preferredLocationInput}
            onChange={handlePreferredLocationInputChange}
            onKeyDown={(e) => handleTagKeyPress(e, "preferredLocations")}
            className="form-input"
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="languagesKnown" className="form-label">Languages Known:</label>
        <div className="tag-list">
          {formValues.languagesKnown?.map((language, index) => (
            <div key={index} className="tag">
              {language}
              <span
                className="remove-tag"
                onClick={() => handleRemoveTag("languagesKnown", language)}
              >
                &times;
              </span>
            </div>
          ))}
          <input
            type="text"
            placeholder="Type a language and press Enter"
            value={languageInput}
            onChange={handleLanguageInputChange}
            onKeyDown={(e) => handleTagKeyPress(e, "languagesKnown")}
            className="form-input"
          />
        </div>
      </div>
      <button type="submit" onClick={handleSubmit} className="submit-button">
        Save Changes
      </button>
    </div>
  );
};

export default BuyerForm;
