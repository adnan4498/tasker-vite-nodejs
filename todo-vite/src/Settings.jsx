import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";

const Settings = () => {
  const location = useLocation();
  const userInfo = location?.state?.userInfo;

  const { name, id, email } = userInfo.user;
  const [editingEmail, setEditingEmail] = useState(email);
  const [isEditEmail, setIsEditEmail] = useState(false);

  const userProfile = {
    name: name,
    avatar: "https://i.pravatar.cc/150?img=3",
    email: email,
  };

  const handleEditEmail = (e) => {
    setEditingEmail(e.target.value);
  };

  const handleSubmitEmail = () => {
    setIsEditEmail(false);

    let updateEmail = () => {
      try {
        fetch(`http://localhost:3003/api/emailUpdate/${id}`, {
          headers: { "content-type": "application/json" },
          method: "POST",
          body: JSON.stringify(signUpData),
        });
      } catch (error) {}
    };

    updateEmail();
  };

  const handleCancelEmailEdit = () => {
    setEditingEmail(email);
    setIsEditEmail(false);
  };

  return (
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
                  <button onClick={handleSubmitEmail}>Submit</button>
                  <button onClick={handleCancelEmailEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  {editingEmail}
                  <span
                    className="edit-email"
                    style={{ cursor: "pointer", color: "blue", paddingLeft : "10px" }}
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
    </div>
  );
};

export default Settings;
