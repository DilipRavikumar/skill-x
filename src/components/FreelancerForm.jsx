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

const LogoContainer = styled.div`
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ChangeButton = styled.button`
  background: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

const RemoveButton = styled.button`
  background: #ff4d4d;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #cc0000;
  }
`;

const CategorySelect = styled.select`
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

const FreelancerForm = () => {
  const { profile, setProfile } = useProfile();
  const [formValues, setFormValues] = useState({
    ...profile,
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    bio: profile.bio || "",
    about: profile.about || "",
    category: profile.category || "",
    hourlyRate: profile.hourlyRate || "",
    portfolio: profile.portfolio || "",
    socialMediaLinks: profile.socialMediaLinks || "",
    availability: profile.availability || "",
  });
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState(null);
  const [logo, setLogo] = useState(profile.logo || null);
  const [logoFile, setLogoFile] = useState(null);
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
          console.log("Fetched Document Data: ", docSnap.data()); // Log data to check structure
          setFormValues((prevState) => ({
            ...docSnap.data(),
            skills: Array.isArray(docSnap.data().skills) ? docSnap.data().skills : [],
            bio: docSnap.data().bio || "",
            about: docSnap.data().about || "",
            category: docSnap.data().category || "",
            hourlyRate: docSnap.data().hourlyRate || "",
            portfolio: docSnap.data().portfolio || "",
            socialMediaLinks: docSnap.data().socialMediaLinks || "",
            availability: docSnap.data().availability || "",
          }));
          setLogo(docSnap.data().logo || null);
        }
      } else {
        setUser(null);
        setFormValues({ skills: [], bio: "", about: "", category: "", hourlyRate: "", portfolio: "", socialMediaLinks: "", availability: "" }); // Initialize fields
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setLogoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      if (logo) {
        // Code to remove the logo from Firebase Storage (if applicable)
        // const storage = getStorage();
        // const logoRef = ref(storage, `logos/${profile.email}`);
        // await deleteObject(logoRef);
        
        // Update Firestore document to remove the logo URL
        await setDoc(
          doc(firestore, "users", user.uid),
          { logo: null },
          { merge: true }
        );
        setLogo(null);
      }
    } catch (error) {
      console.error("Error removing logo: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(
        doc(firestore, "users", user.uid),
        {
          ...formValues,
          logo: logo || null,
        },
        { merge: true }
      );
      setProfile(formValues);
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <FormContainer>
      <Title>Freelancer Profile</Title>
      <LogoContainer>
        {logo ? (
          <>
            <Logo src={logo} alt="Profile Logo" />
            <ChangeButton>
              <label htmlFor="logo-upload">Change Logo</label>
              <input
                type="file"
                id="logo-upload"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleLogoChange}
              />
            </ChangeButton>
            <RemoveButton onClick={handleRemoveLogo}>Remove Logo</RemoveButton>
          </>
        ) : (
          <label htmlFor="logo-upload">
            <input
              type="file"
              id="logo-upload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleLogoChange}
            />
            <ChangeButton>Add Logo</ChangeButton>
          </label>
        )}
      </LogoContainer>

      <form onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formValues.name || ""}
            onChange={handleInputChange}
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formValues.email || ""}
            onChange={handleInputChange}
            required
            readOnly
          />
        </FormField>

        <FormField>
          <Label htmlFor="bio">Bio</Label>
          <TextArea
            id="bio"
            name="bio"
            rows="4"
            value={formValues.bio || ""}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="about">About</Label>
          <TextArea
            id="about"
            name="about"
            rows="4"
            value={formValues.about || ""}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="category">Category</Label>
          <CategorySelect
            id="category"
            name="category"
            value={formValues.category || ""}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            <option value="web-development">Web Development</option>
            <option value="graphic-design">Graphic Design</option>
            <option value="digital-marketing">Digital Marketing</option>
            {/* Add more categories as needed */}
          </CategorySelect>
        </FormField>

        <FormField>
          <Label htmlFor="hourlyRate">Hourly Rate</Label>
          <Input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            value={formValues.hourlyRate || ""}
            onChange={handleInputChange}
            step="0.01"
          />
        </FormField>

        <FormField>
          <Label htmlFor="portfolio">Portfolio URL</Label>
          <Input
            type="url"
            id="portfolio"
            name="portfolio"
            value={formValues.portfolio || ""}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="socialMediaLinks">Social Media Links</Label>
          <Input
            type="text"
            id="socialMediaLinks"
            name="socialMediaLinks"
            value={formValues.socialMediaLinks || ""}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="availability">Availability</Label>
          <Input
            type="text"
            id="availability"
            name="availability"
            value={formValues.availability || ""}
            onChange={handleInputChange}
          />
        </FormField>

        <FormField>
          <Label htmlFor="skills">Skills</Label>
          <Input
            type="text"
            id="skills"
            value={inputValue}
            onChange={handleSkillInputChange}
            onKeyDown={handleSkillKeyPress}
            placeholder="Press Enter to add skills"
          />
          <TagList>
            {formValues.skills.map((skill, index) => (
              <Tag key={index}>
                {skill}
                <RemoveTag onClick={() => handleRemoveSkill(skill)}>x</RemoveTag>
              </Tag>
            ))}
          </TagList>
        </FormField>

        <SubmitButton type="submit">Save Profile</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default FreelancerForm;
