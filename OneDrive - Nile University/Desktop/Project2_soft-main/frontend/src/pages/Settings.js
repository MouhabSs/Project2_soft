import React, { useState } from "react";
import NavBar from "./NavBar";
import { FaUser, FaBell, FaLock, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/global.css";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: "",
    notifications: {
      appointments: true,
      reports: true,
      updates: false
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      // TODO: Implement password change API call
      toast.success("Password updated successfully");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (err) {
      toast.error("Failed to update password");
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement email change API call
      toast.success("Email updated successfully");
    } catch (err) {
      toast.error("Failed to update email");
    }
  };

  const handleNotificationSave = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement notification preferences API call
      toast.success("Notification preferences updated successfully");
    } catch (err) {
      toast.error("Failed to update notification preferences");
    }
  };

  return (
    <>
      <NavBar />
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--spacing-lg)"
          }}>
            <h1 style={{ color: "var(--primary-color)" }}>Settings</h1>
          </div>

          <div style={{
            display: "flex",
            gap: "var(--spacing-lg)",
            marginBottom: "var(--spacing-lg)"
          }}>
            <button
              className={`btn ${activeTab === "profile" ? "btn-primary" : ""}`}
              onClick={() => setActiveTab("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)"
              }}
            >
              <FaUser /> Profile
            </button>
            <button
              className={`btn ${activeTab === "notifications" ? "btn-primary" : ""}`}
              onClick={() => setActiveTab("notifications")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)"
              }}
            >
              <FaBell /> Notifications
            </button>
          </div>

          {activeTab === "profile" && (
            <div style={{ display: "grid", gap: "var(--spacing-xl)" }}>
              {/* Password Change Form */}
              <div style={{
                backgroundColor: "var(--background-secondary)",
                padding: "var(--spacing-lg)",
                borderRadius: "var(--border-radius)"
              }}>
                <h3 style={{
                  margin: "0 0 var(--spacing-md) 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)"
                }}>
                  <FaLock /> Change Password
                </h3>
                <form onSubmit={handlePasswordChange} style={{
                  display: "grid",
                  gap: "var(--spacing-md)"
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Password
                  </button>
                </form>
              </div>

              {/* Email Change Form */}
              <div style={{
                backgroundColor: "var(--background-secondary)",
                padding: "var(--spacing-lg)",
                borderRadius: "var(--border-radius)"
              }}>
                <h3 style={{
                  margin: "0 0 var(--spacing-md) 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)"
                }}>
                  <FaEnvelope /> Change Email
                </h3>
                <form onSubmit={handleEmailChange} style={{
                  display: "grid",
                  gap: "var(--spacing-md)"
                }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                      New Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{ width: "100%" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update Email
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div style={{
              backgroundColor: "var(--background-secondary)",
              padding: "var(--spacing-lg)",
              borderRadius: "var(--border-radius)"
            }}>
              <h3 style={{
                margin: "0 0 var(--spacing-md) 0",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)"
              }}>
                <FaBell /> Notification Preferences
              </h3>
              <form onSubmit={handleNotificationSave} style={{
                display: "grid",
                gap: "var(--spacing-md)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)"
                }}>
                  <input
                    type="checkbox"
                    id="appointments"
                    name="appointments"
                    checked={formData.notifications.appointments}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="appointments">
                    Appointment Reminders
                  </label>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)"
                }}>
                  <input
                    type="checkbox"
                    id="reports"
                    name="reports"
                    checked={formData.notifications.reports}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="reports">
                    Report Generation Notifications
                  </label>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)"
                }}>
                  <input
                    type="checkbox"
                    id="updates"
                    name="updates"
                    checked={formData.notifications.updates}
                    onChange={handleNotificationChange}
                  />
                  <label htmlFor="updates">
                    System Updates and Announcements
                  </label>
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Preferences
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}