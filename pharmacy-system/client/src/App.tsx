import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MedicationRequestList from './components/MedicationRequestList';
import InventoryPage from './pages/InventoryPage';
import MedicationListPage from './pages/MedicationListPage';
import PatientListPage from './pages/PatientListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Pharmacy System</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Medication Requests</Link>
              </li>
              <li>
                <Link to="/inventory">Inventory</Link>
              </li>
              <li>
                <Link to="/medications">Medications</Link>
              </li>
              <li>
                <Link to="/patients">Patients</Link>
              </li>
              {/* Add links for other pages here later */}
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<MedicationRequestList />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/medications" element={<MedicationListPage />} />
            <Route path="/patients" element={<PatientListPage />} />
            {/* Add routes for other pages here later */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
