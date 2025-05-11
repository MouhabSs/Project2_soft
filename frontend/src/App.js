import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import PatientList from "./pages/PatientList";
import AddPatient from "./pages/AddPatient";
import PatientView from "./pages/PatientView";
import { useAuth } from "./auth/AuthProvider";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/patients" element={<PrivateRoute><PatientList /></PrivateRoute>} />
        <Route path="/patients/add" element={<PrivateRoute><AddPatient /></PrivateRoute>} />
        <Route path="/patients/:id" element={<PrivateRoute><PatientView /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;