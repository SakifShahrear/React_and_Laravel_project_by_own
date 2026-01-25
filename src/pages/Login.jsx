import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // এখানে authentication logic আসবে
    console.log("Email:", email, "Password:", password);
    navigate("/profile"); // login successful -> profile
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="title">MUST <br />Have to Login</h2>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="links">
            <Link to="/forgot">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="signup-text">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
