import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  condition: String
});

export default mongoose.model("Patient", PatientSchema);
