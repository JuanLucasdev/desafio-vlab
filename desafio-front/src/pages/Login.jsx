import React, { useState, useCallback } from "react";
import "../App.css";
import Navbar from "../components/navbar";
import SocialButton from "../components/SocialButton";
import GoogleIcon from "../components/icons/GoogleIcon";
import { Facebook, Apple } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import learning from "../assets/learning.jpg";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !password) {
        setError("Por favor, preencha todos os campos.");
        return;
      }

      const { success, message } = await login(email, password);
      if (success) {
        navigate("/"); 
      } else {
        setError(message);
      }
    },
    [email, password, login, navigate]
  );

  return (
    <div className="app-container">
      <Navbar />

      <div className="login-wrapper">
        <div className="login-content">
          <div className="illustration-wrapper">
            <img src={learning} alt="Learning Illustration" className="illustration-img" />
          </div>

          <div className="form-area">
            <h1 className="form-title">Log in to continue your learning journey</h1>

            <div className="login-options">
              <SocialButton icon={GoogleIcon} label="Continue with Google" onClick={() => {}} />
              <SocialButton icon={Facebook} label="Continue with Facebook" onClick={() => {}} />
              <SocialButton icon={Apple} label="Continue with Apple" onClick={() => {}} />

              <div className="divider">
                <div className="divider-line"></div>
                <span className="divider-text">or</span>
                <div className="divider-line"></div>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="btn-continue">
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
