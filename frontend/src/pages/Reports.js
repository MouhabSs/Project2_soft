import React from "react";
import NavBar from "./NavBar";
import { FaChartBar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Reports() {
  return (
    <>
      <NavBar />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "none",
        paddingTop: 48
      }}>
        <div style={{
          width: "100%",
          maxWidth: 1100,
          display: "flex",
          gap: 32,
          justifyContent: "center"
        }}>
          {/* Left: Chart Section */}
          <div style={{
            flex: 1.2,
            background: "#23272f",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
            padding: "2.5rem 2rem",
            color: "#e0eafc",
            minWidth: 340
          }}>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <FaChartBar size={36} color="#4ea8de" style={{ marginBottom: 8 }} />
              <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e0eafc", margin: 0 }}>Reports</h1>
              <p style={{ color: "#b6c6e3", marginTop: 8, marginBottom: 0 }}>
                Generate or view reports related to patients here.
              </p>
            </div>
            <div style={{ background: "#20232a", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.12)", padding: "1.5rem 1rem", marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#e0eafc" }}>Appointment Statistics</div>
              <div style={{ color: "#b6c6e3", fontSize: 15 }}>Trends and analytics for appointments.</div>
              <div style={{ marginTop: 16, background: "#232b36", borderRadius: 12, padding: 12 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={[
                    { name: "Jan", Appointments: 22, Completed: 18 },
                    { name: "Feb", Appointments: 25, Completed: 20 },
                    { name: "Mar", Appointments: 28, Completed: 24 },
                    { name: "Apr", Appointments: 30, Completed: 27 },
                    { name: "May", Appointments: 32, Completed: 29 },
                    { name: "Jun", Appointments: 35, Completed: 31 }
                  ]} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Appointments" fill="#4ea8de" radius={[8,8,0,0]} />
                    <Bar dataKey="Completed" fill="#82ca9d" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <button style={{
                background: "#23272f",
                color: "#4ea8de",
                border: "1px solid #4ea8de",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer"
              }}>Export All</button>
            </div>
          </div>
          {/* Right: Report Cards Section */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            minWidth: 320
          }}>
            <div style={{
              background: "#20232a",
              borderRadius: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              padding: "1.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "#e0eafc" }}>Monthly Patient Summary</div>
                  <div style={{ color: "#b6c6e3", fontSize: 15 }}>Overview of patient activity, new registrations, and retention trends.</div>
                </div>
                <button style={{
                  background: "#4ea8de",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer"
                }}>View</button>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 16, marginBottom: 8 }}>
                <div style={{ flex: 1, background: "#232b36", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#4ea8de" }}>220</div>
                  <div style={{ color: "#b6c6e3", fontSize: 14 }}>Total Patients</div>
                </div>
                <div style={{ flex: 1, background: "#232b36", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#82ca9d" }}>34</div>
                  <div style={{ color: "#b6c6e3", fontSize: 14 }}>New This Month</div>
                </div>
                <div style={{ flex: 1, background: "#232b36", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#e0eafc" }}>89%</div>
                  <div style={{ color: "#b6c6e3", fontSize: 14 }}>Retention Rate</div>
                </div>
              </div>
              <div style={{ marginTop: 8, background: "#232b36", borderRadius: 12, padding: 12 }}>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={[
                    { name: "Jan", Patients: 10, New: 3 },
                    { name: "Feb", Patients: 13, New: 4 },
                    { name: "Mar", Patients: 15, New: 2 },
                    { name: "Apr", Patients: 17, New: 5 },
                    { name: "May", Patients: 20, New: 6 },
                    { name: "Jun", Patients: 22, New: 4 }
                  ]} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Patients" fill="#4ea8de" radius={[8,8,0,0]} />
                    <Bar dataKey="New" fill="#82ca9d" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}