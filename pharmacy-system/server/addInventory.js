const axios = require('axios');

// Define the inventory items to add
const inventoryItemsToAdd = [
  { name: 'Vitamin D3 2000 IU', quantity: 100, expiryDate: '2028-12-31', batchNumber: 'VD3-BATCH-001' },
  { name: 'Omega-3 Fish Oil 1000mg', quantity: 150, expiryDate: '2027-11-15', batchNumber: 'OMEGA3-BATCH-002' },
  { name: 'Probiotic 50 Billion CFU', quantity: 80, expiryDate: '2026-09-01', batchNumber: 'PROBIO-BATCH-003' },
  { name: 'Magnesium Citrate Powder', quantity: 120, expiryDate: '2029-05-20', batchNumber: 'MAGCIT-BATCH-004' },
  { name: 'Turmeric Curcumin Capsules', quantity: 90, expiryDate: '2028-07-10', batchNumber: 'TURMER-BATCH-005' },
  { name: 'Multivitamin', quantity: 200, expiryDate: '2027-03-01', batchNumber: 'MULTI-BATCH-006' },
  { name: 'Amoxicillin 500mg Capsule', quantity: 300, expiryDate: '2025-10-01', batchNumber: 'AMOX-BATCH-010' },
  { name: 'Lisinopril 10mg Tablet', quantity: 250, expiryDate: '2026-01-15', batchNumber: 'LISI-BATCH-011' },
  { name: ' metformin 500 mg oral tablet ', quantity: 400, expiryDate: '2025-08-20', batchNumber: 'MET-BATCH-012' },
  { name: 'Atorvastatin 20mg Tablet', quantity: 180, expiryDate: '2027-04-10', batchNumber: 'ATOR-BATCH-013' },
  { name: 'Amlodipine Besylate 5mg Tablet', quantity: 220, expiryDate: '2026-06-01', batchNumber: 'AMLO-BATCH-014' },
  { name: ' ibuprofen 200 mg oral tablet ', quantity: 350, expiryDate: '2025-12-01', batchNumber: 'IBU-BATCH-015' },
];

const addInventoryItem = async (item, medicationMap) => {
  try {
    const medication = medicationMap[item.name];
    if (!medication) {
      console.warn(`Medication not found for ${item.name}, skipping inventory addition.`);
      return;
    }

    const inventoryPayload = {
      medicationId: medication._id,
      quantity: item.quantity,
      expiryDate: item.expiryDate,
      batchNumber: item.batchNumber,
    };

    const response = await axios.post('http://localhost:5001/api/inventory/add-stock', inventoryPayload);
    console.log(`Successfully added inventory for ${item.name} (Batch: ${item.batchNumber}): ${response.data.message}`);
  } catch (error) {
    console.error(`Failed to add inventory for ${item.name} (Batch: ${item.batchNumber}):`, error.message);
  }
};

const addAllInventoryItems = async () => {
  console.log('Fetching medications...');
  let medications = [];
  try {
    const response = await axios.get('http://localhost:5001/api/medications');
    medications = response.data;
    console.log(`Fetched ${medications.length} medications.`);
  } catch (error) {
    console.error('Failed to fetch medications:', error.message);
    return;
  }

  // Create a map from medication name to medication object for easy lookup
  const medicationMap = medications.reduce((map, med) => {
    map[med.name] = med;
    return map;
  }, {});

  console.log('Starting to add inventory items...');
  for (const item of inventoryItemsToAdd) {
    await addInventoryItem(item, medicationMap);
  }
  console.log('Finished adding inventory items.');
};

addAllInventoryItems(); 