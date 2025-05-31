const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const Medication = require('../models/Medication'); // We might need this to link inventory items to medications

// Route to get all inventory items
router.get('/inventory', async (req, res) => {
  try {
    const inventoryItems = await InventoryItem.find().populate('medication'); // Populate medication details
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to add to stock (create or update inventory item)
router.post('/inventory/add-stock', async (req, res) => {
  try {
    const { medicationId, quantity, expiryDate, batchNumber } = req.body;

    // Basic validation
    if (!medicationId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Medication ID and a positive quantity are required' });
    }

    // Find if an inventory item with the same medication and batch exists
    let inventoryItem = await InventoryItem.findOne({ medication: medicationId, batchNumber: batchNumber });

    if (inventoryItem) {
      // If exists, update the quantity
      inventoryItem.quantity += quantity;
      // Optionally update expiryDate if provided and newer
      if (expiryDate && (!inventoryItem.expiryDate || new Date(expiryDate) > new Date(inventoryItem.expiryDate))) {
         inventoryItem.expiryDate = expiryDate;
      }
    } else {
      // If not exists, create a new inventory item
      const medication = await Medication.findById(medicationId);
      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }

      inventoryItem = new InventoryItem({
        medication: medicationId,
        quantity,
        expiryDate,
        batchNumber
      });
    }

    await inventoryItem.save();

    res.status(200).json({ message: 'Stock updated successfully', item: inventoryItem });
  } catch (error) {
    console.error('Error adding/updating stock:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to decrement stock (for dispensing) - we will implement this later
/*
router.post('/inventory/dispense', async (req, res) => {
  try {
    const { inventoryItemId, quantity } = req.body;

    if (!inventoryItemId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Inventory item ID and a positive quantity are required' });
    }

    const inventoryItem = await InventoryItem.findById(inventoryItemId);

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    inventoryItem.quantity -= quantity;
    await inventoryItem.save();

    res.status(200).json({ message: 'Stock decremented successfully', item: inventoryItem });
  } catch (error) {
    console.error('Error dispensing stock:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/

// Add routes for other inventory operations (e.g., deleting an item if quantity becomes 0)

// DELETE /api/inventory/:id
router.delete('/inventory/:id', async (req, res) => {
  try {
    const inventoryItem = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory Item not found' });
    }
    res.json({ message: 'Inventory Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 