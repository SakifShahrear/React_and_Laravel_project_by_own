import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api"; // এইটা তোমার api.js এ define করতে হবে
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone validation
    if (formData.phone.length !== 11) {
      alert("Phone number must be exactly 11 digits!");
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      alert("Password does not match!");
      return;
    }

    try {
      // FormData for Laravel multipart/form-data
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("occupation", formData.occupation);
      data.append("password", formData.password);
      
      // Append image if uploaded, otherwise send empty string
      // ইমেজ আপলোড করলে পাঠানো হবে, না করলে খালি স্ট্রিং পাঠানো হবে
      data.append("image", formData.image || "");

      // API call
      const response = await signupUser(data);
      console.log(response.data.client); // response থেকে client data
      alert(response.data.message);

      // Redirect to login after success
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Signup failed!");
      }
    }
  };

  return (
    <div className="signup-screen">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className="signup-title">Create Account</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (11 digits)"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 11) setFormData({ ...formData, phone: value });
            }}
            required
          />

          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            onChange={handleChange}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

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
