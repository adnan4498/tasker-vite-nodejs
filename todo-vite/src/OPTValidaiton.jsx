import React, { useEffect, useState } from "react";

const OTPValidation = () => {
  const [otp, setOtp] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [isSendOtp, setIsSentOtp] = useState(false)

  const handleSubmit = (e) => {
    setOtp(e);
    setIsDisable(true);
    setIsSentOtp(true)
  };

  useEffect(() => {
    const handleOtpValidation = () => {
      try {
        fetch(`http://localhost:3003/OTPValidation/${otp}`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((res) => console.log(res, "res in otp validation"));
      } catch (err) {
        console.log(err);
      }
    };

    if(otp.length != 0 && isSendOtp) handleOtpValidation()

    setIsSentOtp(false)
  }, [isSendOtp]);

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
