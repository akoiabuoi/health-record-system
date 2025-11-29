import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema({
  patientName: String,
  age: Number,
  diagnosis: String,
  doctor: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Record", RecordSchema);
