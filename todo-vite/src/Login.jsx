import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./contextAPI/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [triggerSignUpApi, setTriggerSignUpApi] = useState(false);

  const location = useLocation();
  const email = location.state?.email;

  const [loginData, setLoginData] = useState({
    email: email || "",
    password: "",
  });

  const navigate = useNavigate();
  const { loginInfo, setLoginInfo } = useAuth();


  useEffect(() => {
    let handleSignUpApi = async () => {
      let loginUser = await fetch("http://localhost:3003/login", {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(loginData),
        credentials: "include",
      });
      let res = await loginUser.json();
      console.log(res, "res in login")
      // setLoginResponse(res);
      setLoginInfo(res);
    };

    triggerSignUpApi && handleSignUpApi();
    setTriggerSignUpApi(false);
  }, [loginData, triggerSignUpApi]);

  useEffect(() => {
    if (loginInfo?.status == 200) {
      navigate("/home", {
        state: { userInfo: loginInfo },
      });
    }
  }, [loginInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTriggerSignUpApi(true);
  };

  console.log(loginInfo, "loginInfo");

  return (
    <div className="login-div">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
          required
        />
        {loginInfo?.emailNotFound && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
            {loginInfo?.emailNotFound}
          </p>
        )}
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          required
        />
        {loginInfo?.incorrectPassword && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
            {loginInfo?.incorrectPassword}
          </p>
        )}
        <label style={{ marginBottom: "1rem" }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />{" "}
          Show Password
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
