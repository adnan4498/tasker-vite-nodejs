import React, { useEffect, useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [triggerSignUpApi, setTriggerSignUpApi] = useState(false);
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let handleSignUpApi = async () => {
      let loginUser = await fetch("http://localhost:3003/login", {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(loginData),
      });
      let res = await loginUser.json();
      console.log(res, "res");
    };

    triggerSignUpApi && handleSignUpApi();
    setTriggerSignUpApi(false);
  }, [loginData, triggerSignUpApi]);

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
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          required
        />
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
