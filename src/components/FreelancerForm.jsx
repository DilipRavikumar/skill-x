import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useProfile } from "./ProfileContext";
import {
  getFirestore,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  collection,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #007bff;
  margin-bottom: 20px;
  cursor: pointer;
`;

const FreelancerForm = () => {
  const { profile, setProfile } = useProfile();
  const [formValues, setFormValues] = useState({
    ...profile,
    skills: Array.isArray(profile.skills) ? profile.skills : [],
  });
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(profile.profileImage || '/default-profile.png'); // Default profile image
  const auth = getAuth();
  const firestore = getFirestore();
  const navigate = useNavigate();

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
          setProfileImage(docSnap.data().profileImage || '/default-profile.png');
        }
      } else {
        setUser(null);
        setFormValues({ skills: [] });
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSkillInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      setFormValues((prevState) => ({
        ...prevState,
        skills: Array.isArray(prevState.skills)
          ? [...prevState.skills, inputValue.trim()]
          : [inputValue.trim()],
      }));
      setInputValue("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormValues((prevState) => ({
      ...prevState,
      skills: Array.isArray(prevState.skills)
        ? prevState.skills.filter((skill) => skill !== skillToRemove)
        : [],
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you would handle the file upload logic
      // For now, just preview the selected file
      setProfileImage(URL.createObjectURL(file));
    }
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
          await setDoc(docRef, { ...formValues, profileImage }, { merge: true });
          setProfile({ ...formValues, profileImage });
          navigate("/Dashboard");
        } else {
          console.error("No matching user document found");
        }
      } catch (error) {
        console.error("Error saving profile data: ", error);
      }
    } else {
      console.error("No user is signed in");
    }
  };

  return (
    <FormContainer>
      <Title>Freelancer Profile</Title>
      <ProfileImage
        src={profileImage}
        alt="Profile"
        onClick={() => document.getElementById('profile-image-input').click()}
      />
      <input
        type="file"
        id="profile-image-input"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleProfileImageChange}
      />
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
        <Label htmlFor="skills">Skills:</Label>
        <TagList>
          {formValues.skills?.map((skill, index) => (
            <Tag key={index}>
              {skill}
              <RemoveTag onClick={() => handleRemoveSkill(skill)}>
                &times;
              </RemoveTag>
            </Tag>
          ))}
          <Input
            type="text"
            placeholder="Type a skill and press Enter"
            value={inputValue}
            onChange={handleSkillInputChange}
            onKeyDown={handleSkillKeyPress}
          />
        </TagList>
      </FormField>
      <FormField>
        <Label htmlFor="category">Category:</Label>
        <select
          id="category"
          name="category"
          value={formValues.category || ""}
          onChange={handleInputChange}
        >
          <option value="">Select a category</option>
          <option value="Websites_IT_Software">Websites, IT & Software</option>
          <option value="Writing_Content">Writing & Content</option>
          <option value="Design_Media_Architecture">
            Design, Media & Architecture
          </option>
          <option
