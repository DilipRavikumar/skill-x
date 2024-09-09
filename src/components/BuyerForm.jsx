import React, { useState, useEffect } from "react";
import styled from "styled-components";
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


const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  max-width: 800px;
  margin: 50px auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const FormField = styled.div`
  margin: 15px 0;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.div`
  background-color: #007bff;
  color: #fff;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
`;

const RemoveTag = styled.span`
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: #fff;
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

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
    <FormContainer>
      <Title>Employer Profile</Title>
      <FormField>
        <Label htmlFor="bio">Bio:</Label>
        <TextArea
          id="bio"
          name="bio"
          rows="4"
          value={formValues.bio || ""}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <Label htmlFor="preferredLocations">Preferred Locations:</Label>
        <TagList>
          {formValues.preferredLocations?.map((location, index) => (
            <Tag key={index}>
              {location}
              <RemoveTag
                onClick={() => handleRemoveTag("preferredLocations", location)}
              >
                &times;
              </RemoveTag>
            </Tag>
          ))}
          <Input
            type="text"
            placeholder="Type a location and press Enter"
            value={preferredLocationInput}
            onChange={handlePreferredLocationInputChange}
            onKeyDown={(e) => handleTagKeyPress(e, "preferredLocations")}
          />
        </TagList>
      </FormField>
      <FormField>
        <Label htmlFor="languagesKnown">Languages Known:</Label>
        <TagList>
          {formValues.languagesKnown?.map((language, index) => (
            <Tag key={index}>
              {language}
              <RemoveTag
                onClick={() => handleRemoveTag("languagesKnown", language)}
              >
                &times;
              </RemoveTag>
            </Tag>
          ))}
          <Input
            type="text"
            placeholder="Type a language and press Enter"
            value={languageInput}
            onChange={handleLanguageInputChange}
            onKeyDown={(e) => handleTagKeyPress(e, "languagesKnown")}
          />
        </TagList>
      </FormField>
      <SubmitButton type="submit" onClick={handleSubmit}>
        Save Changes
      </SubmitButton>
    </FormContainer>
  );
};

export default BuyerForm;
