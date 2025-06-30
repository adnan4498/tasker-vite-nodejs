import React, { useEffect, useState } from "react";

const OTPValidation = () => {
  const [otp, setOtp] = useState("");
  const [isDisable, setIsDisable] = useState(false);

  const handleSubmit = (e) => {
    setOtp(e);
    setIsDisable(true)
  };

  // useEffect(() => {
  //   try {
  //     fetch("http://localhost:3003/OTPValidation", {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       method: "GET",
  //       body : JSON.stringify({otpSubmitted: otp}),
  //       credentials: "include",
  //     })
  //       .then((res) => res.json())
  //       .then((res) => setToHome(res));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);
  

  return (
    <div className="otp-container">
      <div>
        <h2>Enter OTP</h2>
        <input
          type="text"
          className="otp-input"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          disabled={isDisable}
        />
      </div>
      <div>
        <button className="otp-button" onClick={() => handleSubmit(otp)}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default OTPValidation;
