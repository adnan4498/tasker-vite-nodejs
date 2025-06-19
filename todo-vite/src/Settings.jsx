import React from 'react';
import './App.css';

const Settings = () => {
  const userProfile = {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=3", // sample avatar
    email: "john.doe@example.com",
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <div className="settings-header">
          <img src={userProfile.avatar} alt="Avatar" className="settings-avatar" />
          <h2 className="settings-name">{userProfile.name}</h2>
        </div>
        <div className="settings-section">
          <div className="settings-item">
            <label>Email</label>
            <span>{userProfile.email}</span>
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
