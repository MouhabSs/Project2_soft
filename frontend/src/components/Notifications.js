import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("notification", (msg) => {
      setNotifications((prev) => [msg, ...prev]);
      setTimeout(() => {
        setNotifications((prev) => prev.slice(0, -1));
      }, 5000);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
      {notifications.map((msg, idx) => (
        <div key={idx} style={{ background: "#222", color: "#4ea8de", padding: "12px 24px", marginBottom: 10, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", minWidth: 220 }}>
          {msg}
        </div>
      ))}
    </div>
  );
}