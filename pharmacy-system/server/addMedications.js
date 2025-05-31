const axios = require('axios');

const medicationsToAdd = [
  // Supplements from the nutrition clinic frontend - Using SNOMED CT system
  { name: 'Vitamin D3 2000 IU', code: 'VITD', system: 'http://snomed.info/sct' },
  { name: 'Omega-3 Fish Oil 1000mg', code: 'OMEGA3', system: 'http://snomed.info/sct' },
  { name: 'Probiotic 50 Billion CFU', code: 'PROBIO', system: 'http://snomed.info/sct' },
  { name: 'Magnesium Citrate Powder', code: 'MAGCIT', system: 'http://snomed.info/sct' },
  { name: 'Turmeric Curcumin Capsules', code: 'TURMER', system: 'http://snomed.info/sct' },
  { name: 'Multivitamin', code: 'MULTI', system: 'http://snomed.info/sct' },

  // Additional common medications
  { name: 'Amoxicillin 500mg Capsule', code: '834064', system: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  { name: 'Lisinopril 10mg Tablet', code: '841689', system: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  { name: ' metformin 500 mg oral tablet ', code: '860907', system: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  { name: 'Atorvastatin 20mg Tablet', code: '833672', system: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  { name: 'Amlodipine Besylate 5mg Tablet', code: '833023', system: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  { name: ' ibuprofen 200 mg oral tablet ', code: '856196', system: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
];

const addMedication = async (medication) => {
  try {
    // Add a simple fhirId if not already present (script-generated)
    const medicationWithId = { ...medication };
    if (!medicationWithId.fhirId) {
      // Create a simple ID from the name, replacing spaces and converting to lowercase
      const simpleName = medicationWithId.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      medicationWithId.fhirId = `med-script-${simpleName}`;
    }

    const response = await axios.post('http://localhost:5001/api/', medicationWithId);
    console.log(`Successfully added ${medication.name} (FHIR ID: ${medicationWithId.fhirId}): ${response.data.message}`);
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.warn(`Medication already exists, skipping: ${medication.name}`);
    } else {
      console.error(`Failed to add ${medication.name}:`, error.message);
    }
  }
};

const addAllMedications = async () => {
  console.log('Starting to add medications...');
  for (const medication of medicationsToAdd) {
    await addMedication(medication);
  }
  console.log('Finished adding medications.');
};

addAllMedications(); 