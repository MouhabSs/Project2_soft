import mongoose from "mongoose";
import dotenv from "dotenv";
import Patient from "../models/Patient.js";

dotenv.config();

const testPatients = [
  {
    name: "John Smith",
    age: 45,
    gender: "Male",
    email: "john.smith@gmail.com",
    phone: "12345678901",
    dietaryRestrictions: ["Gluten-Free", "Lactose-Free"],
    physicalActivityLevel: "Moderate",
    medicalConditions: ["Hypertension", "High Cholesterol"],
    notes: "Regular check-ups every 3 months"
  },
  {
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    email: "sarah.j@gmail.com",
    phone: "23456789012",
    dietaryRestrictions: ["Vegetarian"],
    physicalActivityLevel: "High",
    medicalConditions: ["Thyroid Disorder"],
    notes: "Athletic, training for marathon"
  },
  {
    name: "Michael Brown",
    age: 58,
    gender: "Male",
    email: "m.brown@yahoo.com",
    phone: "34567890123",
    dietaryRestrictions: ["No restrictions"],
    physicalActivityLevel: "Low",
    medicalConditions: ["Diabetes", "Kidney Disease"],
    notes: "Needs regular blood sugar monitoring"
  },
  {
    name: "Emily Davis",
    age: 28,
    gender: "Female",
    email: "emily.d@yahoo.com",
    phone: "45678901234",
    dietaryRestrictions: ["Vegan", "Nut-Free"],
    physicalActivityLevel: "Moderate",
    medicalConditions: ["Celiac Disease"],
    notes: "Allergic to nuts, follows strict vegan diet"
  },
  {
    name: "Robert Wilson",
    age: 65,
    gender: "Male",
    email: "r.wilson@gmail.com",
    phone: "56789012345",
    dietaryRestrictions: ["Halal"],
    physicalActivityLevel: "Low",
    medicalConditions: ["Hypertension", "Obesity"],
    notes: "Needs dietary counseling for weight management"
  },
  {
    name: "Lisa Anderson",
    age: 41,
    gender: "Female",
    email: "l.anderson@yahoo.com",
    phone: "67890123456",
    dietaryRestrictions: ["Kosher"],
    physicalActivityLevel: "Moderate",
    medicalConditions: ["High Cholesterol"],
    notes: "Regular exercise routine, follows kosher diet"
  },
  {
    name: "David Martinez",
    age: 36,
    gender: "Male",
    email: "d.martinez@gmail.com",
    phone: "78901234567",
    dietaryRestrictions: ["No restrictions"],
    physicalActivityLevel: "High",
    medicalConditions: [],
    notes: "Professional athlete, needs performance nutrition plan"
  },
  {
    name: "Jennifer Taylor",
    age: 52,
    gender: "Female",
    email: "j.taylor@yahoo.com",
    phone: "89012345678",
    dietaryRestrictions: ["Gluten-Free"],
    physicalActivityLevel: "Moderate",
    medicalConditions: ["Diabetes"],
    notes: "Recently diagnosed with diabetes, needs dietary guidance"
  },
  {
    name: "James Thompson",
    age: 47,
    gender: "Male",
    email: "j.thompson@gmail.com",
    phone: "90123456789",
    dietaryRestrictions: ["Lactose-Free"],
    physicalActivityLevel: "Low",
    medicalConditions: ["Hypertension"],
    notes: "Sedentary lifestyle, needs exercise recommendations"
  },
  {
    name: "Patricia Garcia",
    age: 39,
    gender: "Female",
    email: "p.garcia@yahoo.com",
    phone: "01234567890",
    dietaryRestrictions: ["Vegetarian", "Gluten-Free"],
    physicalActivityLevel: "High",
    medicalConditions: ["Thyroid Disorder"],
    notes: "Active lifestyle, needs thyroid-specific nutrition plan"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing patients
    await Patient.deleteMany({});
    console.log("Cleared existing patients");

    // Insert test patients
    const result = await Patient.insertMany(testPatients);
    console.log(`Successfully added ${result.length} test patients`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 