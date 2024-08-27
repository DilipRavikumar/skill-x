import React, { useState } from "react";
import "./Register.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { app } from "../firebaseConfig";
import loginImage from "../assets/login.png"; // Ensure this path is correct

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      console.log("User registered:", user);
      navigate("/dashboard");
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
      console.log("User signed in with Google:", user);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="glass-card">
          <h2 className="card-text">
            Join us and start exploring Skill X! 🌟
            <span className="emoji"></span>
          </h2>
          <img
            src={loginImage}
            alt="3D Illustration"
            className="login-illustration"
          />
        </div>
      </div>
      <div className="login-right">
        <h2>Register 👋</h2>
        <p>Create an account to get started.</p>
        <form onSubmit={handleRegister}>
          <div className="coolinput">
            <label className="text">Email</label>
            <input
              type="email"
              className="input"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="text">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="text">Confirm Password</label>
            <input
              type="password"
              className="input"
              placeholder="Confirm Password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button className="button1" type="submit">
            Register
          </button>
          <div className="login-divider">
            <span className="divider-line vertical"></span>
            <span className="divider-text">Or Register with</span>
            <span className="divider-line vertical"></span>
          </div>
        </form>
        <button className="google-login" onClick={handleGoogleRegister}>
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google"
          />
          Register with Google
        </button>
        <div className="register-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
