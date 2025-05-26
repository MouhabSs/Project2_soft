import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { FaChartBar, FaUserInjured, FaCalendarAlt, FaUser } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Reports() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsTotal: 0,
    newPatientsThisMonth: 0,
    retentionRate: 0
  });
  const [appointmentChartData, setAppointmentChartData] = useState([]);
  const [patientChartData, setPatientChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        // Fetch patients and appointments
        const patientsRes = await fetch("/api/patients");
        const appointmentsRes = await fetch("/api/appointments");

        if (!patientsRes.ok || !appointmentsRes.ok) {
          throw new Error("Failed to fetch reports data");
        }

        const patientsData = await patientsRes.json();
        const appointmentsData = await appointmentsRes.json();

        // --- Calculate Statistics ---
        const totalPatients = patientsData.data.length;
        const appointmentsTotal = appointmentsData.length;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // For now, let's use a placeholder or assume a field like 'createdAt'
        const newPatientsThisMonth = patientsData.data.filter(patient => {
          // Placeholder: Replace with actual date check if available
          // const creationDate = new Date(patient.createdAt);
          // return creationDate.getMonth() === currentMonth && creationDate.getFullYear() === currentYear;
          return false; // Replace with actual logic
        }).length;

        // Retention Rate - This is a complex metric, using a placeholder
        const retentionRate = "N/A"; // Replace with actual calculation

        setStats({
          totalPatients,
          appointmentsTotal,
          newPatientsThisMonth,
          retentionRate
        });

        // --- Generate Chart Data ---

        // Monthly Appointment Data (for the last 6 months)
        const monthlyAppointmentData = Array(6).fill().map((_, i) => {
          const date = new Date();
          date.setMonth(now.getMonth() - (5 - i));
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          const year = date.getFullYear();

          const monthAppointments = appointmentsData.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate.getMonth() === date.getMonth() && aptDate.getFullYear() === year;
          }).length;

          // Assuming a 'completed' status for appointments (you might need to add this)
          const completedAppointments = appointmentsData.filter(apt => {
            // Placeholder: Replace with actual status check if available
            // return apt.status === 'completed' && new Date(apt.date).getMonth() === date.getMonth() && new Date(apt.date).getFullYear() === year;
             return false; // Replace with actual logic
          }).length;

          return {
            name: monthName,
            Appointments: monthAppointments,
            Completed: completedAppointments
          };
        });
        setAppointmentChartData(monthlyAppointmentData);

        // Monthly Patient Data (for the last 6 months)
         const monthlyPatientData = Array(6).fill().map((_, i) => {
          const date = new Date();
          date.setMonth(now.getMonth() - (5 - i));
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          const year = date.getFullYear();

          const totalPatientsThisMonth = patientsData.data.filter(patient => {
             // Placeholder: Count patients existing by the end of this month
             // This requires patient creation dates
             return true; // Replace with actual logic based on creation date
          }).length;

           const newPatientsThisMonth = patientsData.data.filter(patient => {
             // Placeholder: Count patients created this month
             // This requires patient creation dates
             return false; // Replace with actual logic based on creation date
          }).length;

          return {
            name: monthName,
            Patients: totalPatientsThisMonth,
            New: newPatientsThisMonth
          };
        });
        setPatientChartData(monthlyPatientData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
            Loading reports data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "var(--spacing-xl)", color: "var(--error-color)" }}>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "none",
        paddingTop: "var(--spacing-xl)"
      }}>
        <div style={{
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gridTemplateColumns: "1fr 1fr", // Use grid for layout
          gap: "var(--spacing-lg)", // Use spacing variable
          justifyContent: "center"
        }}>
          {/* Left: Chart Section */}
          <div className="card" style={{
            background: "#23272f", // Use defined color
            borderRadius: "var(--radius-lg)", // Use defined radius
            boxShadow: "var(--shadow-lg)", // Use defined shadow
            padding: "var(--spacing-xl)", // Use defined padding
            color: "var(--text-primary)", // Use defined color
            minWidth: 340
          }}>
            <div style={{ marginBottom: "var(--spacing-lg)", textAlign: "center" }}>
              <FaChartBar size={40} color="var(--primary-color)" style={{ marginBottom: "var(--spacing-sm)" }} />
              <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Reports</h1>
              <p style={{ color: "var(--text-secondary)", marginTop: "var(--spacing-sm)", marginBottom: 0 }}>
                Statistical overview of patient and appointment data.
              </p>
            </div>
            <div style={{ background: "var(--secondary-color)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", padding: "var(--spacing-lg)", marginBottom: "var(--spacing-xl)" }}>
              <div style={{ fontSize: "var(--font-size-xl)", fontWeight: 600, color: "var(--text-primary)" }}>Appointment Statistics</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-base)" }}>Trends and analytics for appointments.</div>
              <div style={{ marginTop: "var(--spacing-md)", background: "#232b36", borderRadius: "var(--radius-md)", padding: "var(--spacing-md)" }}>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={appointmentChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Appointments" fill="var(--primary-color)" radius={[8,8,0,0]} />
                    <Bar dataKey="Completed" fill="var(--success-color)" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
             <div style={{ textAlign: "center" }}>
               {/* Future: Add export functionality */}
               {/* <button className="btn btn-secondary">Export All Data</button> */}
            </div>
          </div>
          {/* Right: Report Cards Section */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-lg)", // Use spacing variable
            minWidth: 320
          }}>
            <div className="card" style={{
              background: "var(--secondary-color)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-sm)",
              padding: "var(--spacing-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)" // Use spacing variable
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "var(--font-size-xl)", fontWeight: 600, color: "var(--text-primary)" }}>Overall Statistics</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-base)" }}>Key metrics from your data.</div>
                </div>
                 {/* Future: Add view report button */}
                 {/* <button className="btn btn-primary">View Report</button> */}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "var(--spacing-md)", marginTop: "var(--spacing-md)", marginBottom: "var(--spacing-sm)" }}>
                <div style={{ background: "#232b36", borderRadius: "var(--radius-sm)", padding: "var(--spacing-md)", textAlign: "center" }}>
                  <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--primary-color)" }}>{stats.totalPatients}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Total Patients</div>
                </div>
                <div style={{ background: "#232b36", borderRadius: "var(--radius-sm)", padding: "var(--spacing-md)", textAlign: "center" }}>
                  <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--success-color)" }}>{stats.appointmentsTotal}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Total Appointments</div>
                </div>
                 <div style={{ background: "#232b36", borderRadius: "var(--radius-sm)", padding: "var(--spacing-md)", textAlign: "center" }}>
                  <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--warning-color)" }}>{stats.newPatientsThisMonth}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>New This Month</div>
                </div>
                 <div style={{ background: "#232b36", borderRadius: "var(--radius-sm)", padding: "var(--spacing-md)", textAlign: "center" }}>
                  <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--text-primary)" }}>{stats.retentionRate}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-sm)" }}>Retention Rate</div>
                </div>
              </div>
            </div>

             {/* Monthly Patient Chart */}
             <div className="card" style={{
              background: "var(--secondary-color)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-sm)",
              padding: "var(--spacing-lg)",
            }}>
               <div style={{ fontSize: "var(--font-size-xl)", fontWeight: 600, color: "var(--text-primary)" }}>Monthly Patient Trends</div>
               <div style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-base)", marginBottom: "var(--spacing-md)" }}>Patient growth and new registrations over time.</div>
                <div style={{ background: "#232b36", borderRadius: "var(--radius-md)", padding: "var(--spacing-md)" }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={patientChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Patients" fill="var(--primary-color)" radius={[8,8,0,0]} />
                      <Bar dataKey="New" fill="var(--success-color)" radius={[8,8,0,0]} />
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