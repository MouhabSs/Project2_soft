const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data store
let patients = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    age: 30,
    gender: 'male',
    medicalHistory: 'None',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    age: 25,
    gender: 'female',
    medicalHistory: 'Allergies',
    createdAt: new Date().toISOString()
  }
];

let appointments = [
  {
    _id: '1',
    patientId: '1',
    patientName: 'John Doe',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    status: 'scheduled',
    notes: 'Initial consultation',
    createdAt: new Date().toISOString()
  }
];

let nutritionPlans = [
  {
    _id: '1',
    patientId: '1',
    patientName: 'John Doe',
    planType: 'Weight Loss',
    mealPlan: 'Breakfast: Oatmeal with fruits\nLunch: Grilled chicken salad\nDinner: Baked fish with vegetables',
    notes: 'Follow strictly for best results',
    createdAt: new Date().toISOString()
  }
];

let reports = [
  {
    _id: '1',
    title: 'Monthly Patient Report',
    type: 'Patient Statistics',
    summary: 'Total patients: 2\nNew patients this month: 1\nActive appointments: 1',
    generatedAt: new Date().toISOString()
  }
];

let users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  }
];

let messages = [
  { _id: '1', content: 'Welcome to the Nutrition Clinic Management System!' },
  { _id: '2', content: 'Your appointment is scheduled for tomorrow at 10:00 AM.' }
];

// Helper function to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  await delay(500);
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  res.json({
    token: 'mock-jwt-token',
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

app.post('/api/auth/register', async (req, res) => {
  await delay(500);
  const { username, password } = req.body;
  
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  
  const newUser = {
    id: uuidv4(),
    username,
    password,
    role: 'user'
  };
  
  users.push(newUser);
  res.status(201).json({
    token: 'mock-jwt-token',
    user: {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    }
  });
});

app.post('/api/auth/logout', async (req, res) => {
  await delay(500);
  res.status(200).json({ message: 'Logged out successfully' });
});

// Patient routes
app.get('/api/patients', async (req, res) => {
  await delay(500);
  res.json(patients);
});

app.post('/api/patients', async (req, res) => {
  await delay(500);
  const newPatient = {
    _id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

app.get('/api/patients/:id', async (req, res) => {
  await delay(500);
  const patient = patients.find(p => p._id === req.params.id);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  res.json(patient);
});

app.put('/api/patients/:id', async (req, res) => {
  await delay(500);
  const index = patients.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  patients[index] = { ...patients[index], ...req.body };
  res.json(patients[index]);
});

app.delete('/api/patients/:id', async (req, res) => {
  await delay(500);
  const index = patients.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }
  patients.splice(index, 1);
  res.status(204).send();
});

// Appointment routes
app.get('/api/appointments', async (req, res) => {
  await delay(500);
  res.json(appointments);
});

app.post('/api/appointments', async (req, res) => {
  await delay(500);
  const newAppointment = {
    _id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.get('/api/appointments/:id', async (req, res) => {
  await delay(500);
  const appointment = appointments.find(a => a._id === req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  res.json(appointment);
});

app.put('/api/appointments/:id', async (req, res) => {
  await delay(500);
  const index = appointments.findIndex(a => a._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  appointments[index] = { ...appointments[index], ...req.body };
  res.json(appointments[index]);
});

app.delete('/api/appointments/:id', async (req, res) => {
  await delay(500);
  const index = appointments.findIndex(a => a._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  appointments.splice(index, 1);
  res.status(204).send();
});

// Nutrition plan routes
app.get('/api/nutrition-plans', async (req, res) => {
  await delay(500);
  const { patientId } = req.query;
  let plans = nutritionPlans;
  if (patientId) {
    plans = plans.filter(plan => plan.patientId === patientId);
  }
  res.json(plans);
});

app.post('/api/nutrition-plans', async (req, res) => {
  await delay(500);
  const newPlan = {
    _id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  nutritionPlans.push(newPlan);
  res.status(201).json(newPlan);
});

app.get('/api/nutrition-plans/:id', async (req, res) => {
  await delay(500);
  const plan = nutritionPlans.find(p => p._id === req.params.id);
  if (!plan) {
    return res.status(404).json({ message: 'Nutrition plan not found' });
  }
  res.json(plan);
});

app.put('/api/nutrition-plans/:id', async (req, res) => {
  await delay(500);
  const index = nutritionPlans.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Nutrition plan not found' });
  }
  nutritionPlans[index] = { ...nutritionPlans[index], ...req.body };
  res.json(nutritionPlans[index]);
});

app.delete('/api/nutrition-plans/:id', async (req, res) => {
  await delay(500);
  const index = nutritionPlans.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Nutrition plan not found' });
  }
  nutritionPlans.splice(index, 1);
  res.status(204).send();
});

// Nutrition Plan History route
app.get('/api/nutrition-plan-history/:patientId', async (req, res) => {
  await delay(500);
  const history = nutritionPlans.filter(plan => plan.patientId === req.params.patientId);
  res.json({
    success: true,
    data: history
  });
});

// Report routes
app.get('/api/reports', async (req, res) => {
  await delay(500);
  const { start, end } = req.query;
  let filteredReports = reports;
  
  if (start && end) {
    filteredReports = reports.filter(report => {
      const reportDate = new Date(report.generatedAt);
      return reportDate >= new Date(start) && reportDate <= new Date(end);
    });
  }
  
  res.json(filteredReports);
});

app.post('/api/reports', async (req, res) => {
  await delay(500);
  const newReport = {
    _id: uuidv4(),
    ...req.body,
    generatedAt: new Date().toISOString()
  };
  reports.push(newReport);
  res.status(201).json(newReport);
});

app.get('/api/reports/:id', async (req, res) => {
  await delay(500);
  const report = reports.find(r => r._id === req.params.id);
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  res.json(report);
});

app.get('/api/reports/:id/export', async (req, res) => {
  await delay(500);
  const report = reports.find(r => r._id === req.params.id);
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  
  // Mock PDF generation
  const mockPdf = Buffer.from('Mock PDF content');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.pdf`);
  res.send(mockPdf);
});

// Messages route
app.get('/api/messages', async (req, res) => {
  await delay(500);
  res.json({
    success: true,
    data: messages
  });
});

// Start server
app.listen(port, () => {
  console.log(`Mock server running on port ${port}`);
}); 