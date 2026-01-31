// Import necessary hooks and utilities
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api";
import "../css/Login.css";

export default function Login() {
  const navigate = useNavigate();

  // State for form inputs
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await auth.login(form.email, form.password);
      console.log('Login success:', response.data);
      
      // Save the tokens
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      alert('Login Successful!');
      
      // Navigate to profile
      navigate('/profile');
      
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      alert(error.response?.data?.message || 'Login failed');
    }
  };
  return (
    <div className="login-screen">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="title">Must <br />You Have to Log In</h2>

          {/* Email input */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password input */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Submit button */}
          <button className="login-btn">Login</button>

          {/* Sign up link */}
          <div className="signup-text">
            Don't have an account? <a href="/signup">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
}

