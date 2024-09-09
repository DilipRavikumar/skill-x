import React, { useState } from "react";
import "./Login.css";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { app } from "./firebaseConfig";
import loginImage from "./assets/login.png"; // Ensure this path is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User logged in:", user);
      // Handle remember me functionality if needed
      navigate("/");
    } catch (error) {
      setError("Invalid username or password");
      console.error("Login error:", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in with Google:", user);
      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="glass-panel">
          <h2 className="panel-text">
            Welcome back! Log in to continue exploring Skill X 💯
            <span className="emoji"></span>
          </h2>
          <img
            src={loginImage}
            alt="3D Illustration"
            className="auth-illustration"
          />
        </div>
      </div>
      <div className="auth-right">
        <h2>Login 👋</h2>
        <p>Login to your account to explore.</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="text-input"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="input-label">Password</label>
            <input
              type="password"
              className="text-input"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          {error && <div className="error-text">{error}</div>}
          <div className="auth-actions">
            <label>
              <Link to="/SignUp">New here?</Link>
            </label>
          </div>
          <button className="auth-button" type="submit">
            Login
          </button>
          <div className="auth-divider">
            <span className="divider-line vertical"></span>
            <span className="divider-label">Or Login with</span>
            <span className="divider-line vertical"></span>
          </div>
        </form>
        <button className="google-button" onClick={handleGoogleLogin}>
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google"
          />
          Login with Google
        </button>
        <div className="register-prompt">
          <p>
            Do you have already an account? <Link to="/sign-in">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
