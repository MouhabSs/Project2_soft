const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const medicationRequestsRouter = require('./routes/medicationRequests');
const inventoryRouter = require('./routes/inventory');
const medicationsRouter = require('./routes/medications');
const patientsRouter = require('./routes/patients');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use medication requests route
app.use('/api', medicationRequestsRouter);

// Use inventory routes
app.use('/api', inventoryRouter);

// Use medication routes
app.use('/api', medicationsRouter);

// Use patient routes
app.use('/api', patientsRouter);

// Basic Route
app.get('/', (req, res) => {
  res.send('Pharmacy System Backend');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 