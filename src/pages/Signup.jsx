import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Signup.css";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    password: "",
    confirmPassword: "",
    image: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.phone.length !== 11) {
    alert("Phone number must be exactly 11 digits!");
    return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password does not match!");
      return;
    }

    console.log(formData);

    // After successful signup redirect to login
    navigate("/login");
  };

  return (
    <div className="signup-screen">
      <div className="signup-container">

        <form className="signup-form" onSubmit={handleSubmit}>

          <h2 className="signup-title">Create Account</h2>

          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
                type="tel"
                name="phone"
                placeholder="Phone Number (11 digits)"
                value={formData.phone}
                onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // only numbers
                if (value.length <= 11) {
                    setFormData({ ...formData, phone: value });
                }
                }}
                required
            />
            </div>


          <div className="input-group">
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Signup;
