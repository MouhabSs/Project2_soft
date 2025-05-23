import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import PatientList from "./pages/PatientList";
import AddPatient from "./pages/AddPatient";
import PatientView from "./pages/PatientView";
import EditPatient from "./pages/EditPatient";
import Appointments from "./pages/Appointments";
import NutritionPlan from "./pages/NutritionPlan";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import { useAuth } from "./auth/AuthProvider";
import Notifications from "./components/Notifications";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Notifications />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/patients" element={<PrivateRoute><PatientList /></PrivateRoute>} />
        <Route path="/patients/add" element={<PrivateRoute><AddPatient /></PrivateRoute>} />
        <Route path="/patients/:id" element={<PrivateRoute><PatientView /></PrivateRoute>} />
        <Route path="/patients/:id/edit" element={<PrivateRoute><EditPatient /></PrivateRoute>} />
        <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
        <Route path="/nutrition-plan" element={<PrivateRoute><NutritionPlan /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;