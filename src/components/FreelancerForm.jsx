import React, { useState, useEffect } from "react";
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./FreelancerForm.css"; // Import the CSS file

const FreelancerForm = () => {
  const { profile, setProfile } = useProfile();
  const [formValues, setFormValues] = useState({
    ...profile,
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    bio: profile.bio || "",
  });
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState(null);
  const [logo, setLogo] = useState(profile.profileImage || null);
  const [logoFile, setLogoFile] = useState(null);
  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage(); // Firebase Storage
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
          setFormValues((prevState) => ({
            ...docSnap.data(),
            skills: Array.isArray(docSnap.data().skills)
              ? docSnap.data().skills
              : [],
            bio: docSnap.data().bio || "",
          }));
          setLogo(docSnap.data().profileImage || null);
        }
      } else {
        setUser(null);
        setFormValues({ skills: [], bio: "" }); // Initialize fields
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
          { profileImage: null },
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
    let profileImageUrl = logo;

    try {
      if (logoFile) {
        // Upload the logo to Firebase Storage
        const logoRef = ref(storage, `logos/${user.uid}`);
        await uploadBytes(logoRef, logoFile);

        // Get the download URL
        profileImageUrl = await getDownloadURL(logoRef);
      }

      // Update Firestore with form values
      await setDoc(
        doc(firestore, "users", user.uid),
        {
          ...formValues,
          profileImage: profileImageUrl,
        },
        { merge: true }
      );

      setProfile({
        ...formValues,
        profileImage: profileImageUrl,
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="title">Update Profile</h2>
      <div className="logo-container">
        {logo ? (
          <>
            <img src={logo} alt="Profile Logo" className="logo" />
            <button
              className="change-button"
              onClick={() => document.getElementById("logoInput").click()}
            >
              Change Logo
            </button>
            <button className="remove-button" onClick={handleRemoveLogo}>
              Remove Logo
            </button>
          </>
        ) : (
          <>
            <button
              className="upload-button"
              onClick={() => document.getElementById("logoInput").click()}
            >
              <svg
                aria-hidden="true"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-width="2"
                  stroke="#fffffff"
                  d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                ></path>
                <path
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  stroke="#fffffff"
                  d="M17 15V18M17 21V18M17 18H14M17 18H20"
                ></path>
              </svg>
              Upload Logo
            </button>
          </>
        )}
        <input
          type="file"
          id="logoInput"
          className="file-input"
          accept="image/*"
          onChange={handleLogoChange}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="bio" className="label">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formValues.bio}
            onChange={handleInputChange}
            className="textarea"
            rows="4"
          />
        </div>
        <div className="form-field">
          <label htmlFor="skills" className="label">
            Skills
          </label>
          <input
            id="skills"
            name="skills"
            type="text"
            value={inputValue}
            onChange={handleSkillInputChange}
            onKeyDown={handleSkillKeyPress}
            placeholder="Press Enter to add skills"
            className="input"
          />
          <div className="tag-list">
            {formValues.skills.map((skill, index) => (
              <div key={index} className="tag">
                {skill}
                <span
                  className="remove-tag"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  x
                </span>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-button-freelancer-profile">
          <div class="svg-wrapper-1">
            <div class="svg-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="30"
                height="30"
                class="icon"
              >
                <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
              </svg>
            </div>
          </div>
          <span>Save</span>
        </button>
      </form>
    </div>
  );
};

export default FreelancerForm;
