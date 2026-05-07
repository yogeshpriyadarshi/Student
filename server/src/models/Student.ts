import mongoose  from "mongoose";

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  DOB: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  course: { type: String, required: true },
  password: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;