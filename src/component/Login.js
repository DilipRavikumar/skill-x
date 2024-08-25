import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="glass-card">
          <h1>
            Digital
            <br />
            platform
            <br /> for
            <br />
            <span>Freelancing.</span>
          </h1>
          <p>You will never know everything. But you will know more.</p>
        </div>
      </div>
      <div className="login-right">
        <div className="login-logo">🌐</div>
        <h2>Hey, hello 👋</h2>
        <p>Enter the information you entered while registering.</p>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
          <div className="login-divider">or</div>
          <button className="google-login">
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google"
            />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
