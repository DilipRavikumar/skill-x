import React, { useState } from "react";
import "./Register.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { app } from "./firebaseConfig";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import loginImage from "./assets/login.png"; // Ensure this path is correct

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // New field for displayName
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const db = getFirestore(app); // Initialize Firestore

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const auth = getAuth(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Optionally update the user profile with display name
      await updateProfile(user, { displayName });

      // Add user document to Firestore
      await setDoc(doc(db, "users", user.uid), {
        displayName: displayName || user.email.split("@")[0],
        email: user.email,
        role: "freelancer", // Default role, can be updated later
        profileImage: "", // Placeholder for now
        createdAt: serverTimestamp(),
        skills: [], // Empty skills array for now
        rating: 0, // Initial rating
        completedOrders: 0, // Initial completed orders
        bio: "", // Empty bio for now
        transactionHistory: [], // Empty transaction history
        balance: 0, // Initial balance
      });

      console.log("User registered:", user);
      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error("Registration error:", error.message);
    }
  };

  const handleGoogleRegister = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Add user document to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: "",
        displayName: user.displayName || user.email.split("@")[0],
        email: user.email,
        role: "user", // Default role, can be updated later
        profileImage: user.photoURL || "", // Google profile image
        createdAt: serverTimestamp(),
        skills: [], // Empty skills array for now
        rating: 0, // Initial rating
        completedOrders: 0, // Initial completed orders
        bio: "", // Empty bio for now
        transactionHistory: [], // Empty transaction history
        balance: 0, // Initial balance
      });

      console.log("User signed in with Google:", user);
      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="glass-card">
          <h2 className="card-heading">
            Join us and start exploring Skill X! 🌟
            <span className="emoji"></span>
          </h2>
          <img
            src={loginImage}
            alt="3D Illustration"
            className="register-illustration"
          />
        </div>
      </div>
      <div className="register-right">
        <h2>Register 👋</h2>
        <p>Create an account to get started.</p>
        <form onSubmit={handleRegister}>
          <div className="input-container">
            <label className="input-label">Display Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Display Name"
              required
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Confirm Password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button className="submit-button" type="submit">
            Register
          </button>
          <div className="register-divider">
            <span className="divider-line vertical"></span>
            <span className="divider-text">Or Register with</span>
            <span className="divider-line vertical"></span>
          </div>
        </form>
        <button className="google-register" onClick={handleGoogleRegister}>
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google"
          />
          Register with Google
        </button>
        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
