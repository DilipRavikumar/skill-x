import React,{ useState } from "react";
import "./Login.css";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login error:', error.message);
    }
  };

  const navigateToSignUp = () => {
    navigate('/SignUp');
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in with Google:', user);
      navigate('/Dashboard');
    } catch (error) {
      setError(error.message);
      console.error('Google sign-in error:', error.message);
    }
  };

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
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="error-message">{error}</div>}
          <div className="login-options">
            <label>
            <a href="/register">New here?</a>
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>
          <button className="button1" type="submit">Login</button>
          <div className="login-divider">or</div>
          </form>
          <button className="google-login" onClick={handleGoogleLogin}>
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google"
            />
            Sign in with Google
          </button>
      </div>
    </div>
  );
};

export default Login;
