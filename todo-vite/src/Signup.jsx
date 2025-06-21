import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [triggerSignUpApi, setTriggerSignUpApi] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signUpMsg, setSignUpMsg] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    let handleSignUpApi = async () => {
      try {
        let toSingup = await fetch("http://localhost:3003/signup", {
          headers: { "content-type": "application/json" },
          method: "POST",
          body: JSON.stringify(signUpData),
        });

        console.log(toSingup, "toSingup")

        let res = await toSingup.json();
        console.log(res, "res")
        setSignUpMsg(res);
      } catch (error) {
        console.log(error);
      }
    };

    triggerSignUpApi && handleSignUpApi();
    setTriggerSignUpApi(false);
  }, [signUpData, triggerSignUpApi]);

  useEffect(() => {
    if (signUpMsg?.success) {
      setTimeout(() => {
        navigate("/login", {
          state: { email: signUpData.email },
        });
      }, 1000);
    }
  }, [signUpMsg]);

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
        <h2>Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={signUpData.name}
          onChange={handleChange}
          // required
        />
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signUpData.email}
            onChange={handleChange}
            required
            style={{
              borderColor: signUpMsg?.error ? "red" : "#ccc",
              borderWidth: "1px",
              borderStyle: "solid",
              width: "92%",
            }}
          />
          {signUpMsg?.error && (
            <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
              {signUpMsg?.error}
            </p>
          )}
        </div>

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
        <button
          type="submit"
          style={{ background: signUpMsg?.success && "green" }}
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;