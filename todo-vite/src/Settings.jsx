import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { Spin } from "antd";
import { useAuth } from "./contextAPI/AuthContext";

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginInfo, setLoginInfo } = useAuth();
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if (loginInfo == undefined || loginInfo == null) {
      navigate("/");
    } else {
      setUserInfo(loginInfo.user);
    }
  }, []);

  const { name, id, email } = userInfo || {};
  const [editingEmail, setEditingEmail] = useState(email);
  const [isEditEmail, setIsEditEmail] = useState(false);
  const [triggerEmailFetch, setTriggerEmailFetch] = useState(false);
  const [toOtpPage, setToOtpPage] = useState(null);

  useEffect(() => {
    const updateEmail = async () => {
      setToOtpPage(false);

      try {
        const response = await fetch(`http://localhost:3003/api/emailUpdate`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            userId: id,
            userEmail: email,
            newEmail: editingEmail,
          }),
        });

        const res = await response.json();
        setToOtpPage(res);
      } catch (err) {
        console.log(err);
      }
    };

    if (triggerEmailFetch) {
      updateEmail();
      setIsEditEmail(false);
      setTriggerEmailFetch(false);
    }
  }, [triggerEmailFetch]);

  useEffect(() => {
    if (toOtpPage?.succeed) {
      navigate("/OTPValidation");
    } else if (toOtpPage?.error) {
      alert(toOtpPage.error);
    }
  }, [toOtpPage]);

  const userProfile = {
    name: name,
    avatar: "https://i.pravatar.cc/150?img=3",
    email: email,
  };

  const handleEditEmail = (e) => {
    setEditingEmail(e.target.value);
  };

  const handleCancelEmailEdit = () => {
    setEditingEmail(email);
    setIsEditEmail(false);
  };

  return (
    <>
      {userInfo && (
        <div className="settings-page">
          <div className="settings-card">
            <div className="settings-header">
              <img
                src={userProfile.avatar}
                alt="Avatar"
                className="settings-avatar"
              />
              <h2 className="settings-name">{userProfile.name}</h2>
            </div>
            <div className="settings-section">
              <div className="settings-item">
                <label>Email</label>
                <div>
                  {isEditEmail ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="email"
                        value={editingEmail}
                        onChange={handleEditEmail}
                        required
                        autoFocus
                      />
                      <button onClick={() => setTriggerEmailFetch(true)}>
                        Submit
                      </button>
                      <button onClick={handleCancelEmailEdit}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      {editingEmail}
                      <span
                        className="edit-email"
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          paddingLeft: "10px",
                        }}
                        onClick={() => setIsEditEmail(true)}
                      >
                        edit
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="settings-item">
                <label>Notifications</label>
                <span>Enabled</span>
              </div>
              <div className="settings-item">
                <label>Change Password</label>
                <span>********</span>
              </div>
              <div className="settings-item">
                <label>Theme</label>
                <span>Light</span>
              </div>
            </div>
          </div>

          {toOtpPage === false && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Spin size="large" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Settings;
