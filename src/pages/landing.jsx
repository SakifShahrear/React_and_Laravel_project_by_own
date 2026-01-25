import React from "react";
import { Link } from "react-router-dom";
import "../css/Landing.css";
import keepnotePhoto from "../assets/keepnotephoto.jpg"; // আপনার ছবি path

function Landing() {
  return (
    <div className="landing-screen">
      <div className="landing-container">
        <div className="landing-text">
          <h1 className="landing-title">MyKeepNote</h1>
          <p className="landing-desc">For keep note you need to log in</p>
          <div className="landing-buttons">
            <Link to="/login" className="landing-btn login-btn">
              Login
            </Link>
            <Link to="/signup" className="landing-btn signup-btn">
              Sign Up
            </Link>
          </div>
        </div>
        <div className="landing-image">
          <img src={keepnotePhoto} alt="KeepNote" />
        </div>
      </div>
    </div>
  );
}

export default Landing;
