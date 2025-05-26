import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { FaFileAlt, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { reportApi } from "../services/api";
import { toast } from "react-toastify";
import "../styles/global.css";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportApi.getAll();
      setReports(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch reports";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateReport = async () => {
    try {
      const response = await reportApi.create({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      setReports(prev => [response.data, ...prev]);
      toast.success("Report generated successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to generate report";
      toast.error(errorMessage);
    }
  };

  const handleExportReport = async (reportId) => {
    try {
      await reportApi.export(reportId);
      toast.success("Report exported successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to export report";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
            Loading reports...
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
            {error}
          </div>
        </div>
      </div>
    );
  }

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
            <h1 style={{ color: "var(--primary-color)" }}>Reports</h1>
          </div>

          {/* Date Range Filter */}
          <div style={{
            backgroundColor: "var(--background-secondary)",
            padding: "var(--spacing-lg)",
            borderRadius: "var(--border-radius)",
            marginBottom: "var(--spacing-lg)"
          }}>
            <h3 style={{ margin: "0 0 var(--spacing-md) 0" }}>Generate New Report</h3>
            <div style={{
              display: "flex",
              gap: "var(--spacing-md)",
              alignItems: "flex-end"
            }}>
              <div>
                <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  style={{ width: "200px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "var(--spacing-xs)" }}>
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  style={{ width: "200px" }}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handleGenerateReport}
                disabled={!dateRange.startDate || !dateRange.endDate}
              >
                Generate Report
              </button>
            </div>
          </div>

          {reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--spacing-xl)", color: "var(--text-secondary)" }}>
              No reports available
            </div>
          ) : (
            <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
              {reports.map(report => (
                <div key={report.id} className="card" style={{
                  padding: "var(--spacing-lg)"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "var(--spacing-md)"
                  }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{report.title}</h3>
                      <p style={{
                        color: "var(--text-secondary)",
                        margin: "var(--spacing-xs) 0 0 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-xs)"
                      }}>
                        <FaCalendarAlt />
                        {new Date(report.generatedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      className="btn"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-xs)",
                        color: "var(--primary-color)"
                      }}
                      onClick={() => handleExportReport(report.id)}
                    >
                      <FaDownload /> Export
                    </button>
                  </div>
                  <div style={{
                    backgroundColor: "var(--background-secondary)",
                    padding: "var(--spacing-md)",
                    borderRadius: "var(--border-radius)"
                  }}>
                    <h4 style={{ margin: "0 0 var(--spacing-sm) 0" }}>Summary</h4>
                    <p style={{ margin: 0 }}>{report.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}