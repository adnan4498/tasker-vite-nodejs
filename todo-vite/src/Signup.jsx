import React, { useEffect, useState } from "react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [triggerSignUpApi, setTriggerSignUpApi] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let handleSignUpApi = async () => {
      let toSingup = await fetch("http://localhost:3003/signup", {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(signUpData),
      });
      let res = await toSingup.json();
      console.log(res, "res")
    };

    triggerSignUpApi && handleSignUpApi();
    setTriggerSignUpApi(false);
  }, [signUpData, triggerSignUpApi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
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
          type="text"
          name="name"
          placeholder="Name"
          value={signUpData.name}
          onChange={handleChange}
          // required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signUpData.email}
          onChange={handleChange}
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={signUpData.password}
          onChange={handleChange}
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={signUpData.confirmPassword}
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

export default Signup;
