// Import necessary hooks and utilities
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

// API Base URL - Using Vite proxy
const API_URL = '/api';

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
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email: form.email,
          password: form.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('✅ Login Success:', response.data);
      
      // Save the tokens
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      alert('Login Successful!');
      
      // Navigate to profile
      navigate('/profile');
      
    } catch (error) {
      console.error('❌ Login Error:', error);
      
      if (error.response) {
        // Server responded with error
        console.log('Error response:', error.response.data);
        alert(error.response.data.message || 'Login failed');
      } else if (error.request) {
        // Request made but no response
        console.log('No response received');
        alert('Cannot connect to server. Please check if Apache is running.');
      } else {
        console.log('Error:', error.message);
        alert('Login failed. Please try again.');
      }
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

