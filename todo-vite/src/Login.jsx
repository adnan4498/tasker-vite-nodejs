import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [triggerSignUpApi, setTriggerSignUpApi] = useState(false);

  const location = useLocation();
  const email = location.state?.email;

  const [loginData, setLoginData] = useState({
    email: email || "",
    password: "",
  });

  const [loginResponse, setLoginResponse] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    let handleSignUpApi = async () => {
      let loginUser = await fetch("http://localhost:3003/login", {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(loginData),
      });
      let res = await loginUser.json();
      setLoginResponse(res);
    };

    triggerSignUpApi && handleSignUpApi();
    setTriggerSignUpApi(false);
  }, [loginData, triggerSignUpApi]);

  useEffect(() => {
    if (loginResponse?.status == 200) {
      navigate("/home", {
        state : { userInfo : loginResponse }
      });
    }
  }, [loginResponse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTriggerSignUpApi(true);
  };

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
            {loginResponse?.emailNotFound && (
            <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
              {loginResponse?.emailNotFound}
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
           {loginResponse?.incorrectPassword && (
            <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
              {loginResponse?.incorrectPassword}
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
