import React from "react";
import NavBar from "./NavBar";

export default function Messages() {
  return (
    <>
      <NavBar />
      <div className="dashboard-container">
      <h2>Messages</h2>
      <div className="dashboard-card">
        <p>This is your notifications/messages center.</p>
        <ul>
          <li>New appointment scheduled for Alice Smith.</li>
          <li>Bob Johnson updated his nutrition plan.</li>
        </ul>
      </div>
    </div>
    </>
  );
}