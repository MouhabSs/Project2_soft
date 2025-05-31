const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication', // Reference to the Medication model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date
  },
  batchNumber: {
    type: String
  },
  // Add other relevant inventory fields as needed
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema); 