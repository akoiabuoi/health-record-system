import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    gender: String,
    condition: String
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
