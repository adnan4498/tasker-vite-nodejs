import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contextAPI/AuthContext";
// import './LoginSignupPage.css'

const LoginSignupPage = () => {
  const navigate = useNavigate();
  const { loginInfo, setLoginInfo } = useAuth();

  console.log(loginInfo, "loginInfo in loginSignupPage");



  return (
    <div className="login-signup-container">
      <div className="login-signup-box">
        <h1 className="login-signup-title">Welcome to Our Platform</h1>

        <div className="login-signup-buttons">
          <button onClick={() => navigate("/login")} className="btn login-btn">
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="btn signup-btn"
          >
            New User? Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;
