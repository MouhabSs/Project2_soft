import React from "react";
import NavBar from "./NavBar";

export default function Settings() {
  return (
    <>
      <NavBar />
      <div className="dashboard-container">
        <h2>Settings</h2>
        <div className="dashboard-card">
          <p>Manage your user account settings here.</p>
          <ul>
            <li>Change password</li>
            <li>Update email</li>
            <li>Notification preferences</li>
          </ul>
        </div>
      </div>
    </>
  );
}