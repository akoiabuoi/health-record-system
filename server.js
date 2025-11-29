import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Patient from "./models/Patient.js";  // your model

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// CRUD routes
app.get("/patients", async (req, res) => res.json(await Patient.find()));
app.post("/patients", async (req, res) => res.json(await new Patient(req.body).save()));
app.delete("/patients/:id", async (req, res) => res.json(await Patient.findByIdAndDelete(req.params.id)));
app.put("/patients/:id", async (req, res) => res.json(await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
