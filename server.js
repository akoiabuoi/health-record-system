import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Models
import User from "./models/user.js";
import Record from "./models/Record.js";     // FIXED: added correct record model import
import Patient from "./models/Patient.js";   // optional, if you need separate patient model

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// -------------------- AUTH ROUTES --------------------

// REGISTER
app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    res.json({ success: false, message: "Username already exists" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ success: false, message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ success: false, message: "Incorrect password" });

  res.json({
    success: true,
    message: "Login successful",
    role: user.role,
    username: user.username
  });
});


// -------------------- PATIENT RECORDS --------------------

// SAVE patient record
app.post("/api/record", async (req, res) => {
  try {
    const record = new Record(req.body);
    await record.save();
    res.json({ success: true, message: "Record saved!" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// GET all records
app.get("/api/records", async (req, res) => {
  const records = await Record.find();
  res.json(records);
});


// -------------------- PATIENT CRUD (OPTIONAL) --------------------
// -------------------- PATIENT CRUD --------------------

// GET all patients
app.get("/patients", async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

// ADD patient
app.post("/patients", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.json({ success: true, message: "Patient added!" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// DELETE patient
app.delete("/patients/:id", async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// UPDATE patient
app.put("/patients/:id", async (req, res) => {
  const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});


// -------------------- START SERVER --------------------
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
