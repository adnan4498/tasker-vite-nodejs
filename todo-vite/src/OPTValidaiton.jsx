import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OPTValidaiton = () => {
  // useEffect(() => {
  //   const handleSettingsRoute = async () => {
  //     try {
  //       let toSettings = await fetch(`http://localhost:3003/api/settings`, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       let res = await toSettings.json();
  //       setSettingResponse(res);
  //       console.log(res, "res");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   triggerSettingsRoute && handleSettingsRoute();
  //   setTriggerSettingsRoute(false);
  // }, [triggerSettingsRoute]);




  let location = useLocation()
  console.log(location?.state)


  useEffect(() => {
    try {
      fetch("http://localhost:3003/OTPValidation", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => setToHome(res));
    } catch (err) {
      setToHome(err);
    }
  }, []);

  return (
    <div>
      <div>asd</div>
    </div>
  );
};

export default OPTValidaiton;
