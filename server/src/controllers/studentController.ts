import { Request, Response } from "express";
import Student from "../models/Student.js";
import { generateToken } from "../utils/generateToken.js";
import { enc } from "crypto-js";
import { decrypt, encrypt } from "../utils/crypto.js";

export const studentRegister = async(req: Request, res: Response) => {
  try{
    const { fullName, email, phoneNumber, DOB, gender, address, course, password } = req.body;
    const newStudent = new Student({
      fullName:encrypt(fullName),
      email:encrypt(email),
      phoneNumber:encrypt(phoneNumber),
      DOB:encrypt(DOB),
      gender:encrypt(gender),
      address:encrypt(address),
      course:encrypt(course),
      password:encrypt(password)
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully", student: newStudent });  

  }catch(error){
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const studentLogin = async(req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email);
    try {
      console.log("Encrypted email for login:", encrypt(email));
      const student = await Student.findOne({ email: encrypt(email) });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      if (student.password !== encrypt(password)){
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(student._id.toString());
      res.json({ message: "Login successful", student, token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error" });
    } 
  }

export const getAllStudents = async(req: Request, res: Response) => {
  try{
    const students = await Student.find();
    // decrypt the student data before sending it to client
    const decryptedStudents = students.map(student => ({
      ...student.toObject(),
      fullName: decrypt(student.fullName),
      email: decrypt(student.email),
      phoneNumber: decrypt(student.phoneNumber),
      DOB: decrypt(student.DOB),
      gender: decrypt(student.gender),
      address: decrypt(student.address),
      course: decrypt(student.course),
    }));
    res.json(decryptedStudents);
  }catch(error){
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getStudentProfile = async(req: Request, res: Response) => {
  try{
    const studentId = req.params.id; // Get student ID from URL parameters
    const student = await Student.findById(studentId);
    if(!student){
      return res.status(404).json({ message: "Student not found" });
    }
    const decryptedStudent = {
      ...student.toObject(),
      fullName: decrypt(student.fullName),
      email: decrypt(student.email),
      phoneNumber: decrypt(student.phoneNumber),
      DOB: decrypt(student.DOB),
      gender: decrypt(student.gender),
      address: decrypt(student.address),
      course: decrypt(student.course),
    };
    res.json(decryptedStudent);
  }catch(error){
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const updateStudentProfile = async(req: Request, res: Response) => {
  try{
    const studentId = req.params.id; // Assuming userId is set in auth middleware
    const updates = req.body;
    // Encrypt the updated fields before saving
    const encryptedUpdates = {
      ...updates,
      fullName: updates.fullName ? encrypt(updates.fullName) : undefined,
      email: updates.email ? encrypt(updates.email) : undefined,
      phoneNumber: updates.phoneNumber ? encrypt(updates.phoneNumber) : undefined,
      DOB: updates.DOB ? encrypt(updates.DOB) : undefined,
      gender: updates.gender ? encrypt(updates.gender) : undefined,
      address: updates.address ? encrypt(updates.address) : undefined,
      course: updates.course ? encrypt(updates.course) : undefined,
    };
    const updatedStudent = await Student.findByIdAndUpdate(studentId, encryptedUpdates, { new: true });
    if(!updatedStudent){
      return res.status(404).json({ message: "Student not found" });
    }
    const decryptedUpdatedStudent = {
      ...updatedStudent.toObject(),
      fullName: decrypt(updatedStudent.fullName),
      email: decrypt(updatedStudent.email),
      phoneNumber: decrypt(updatedStudent.phoneNumber),
      DOB: decrypt(updatedStudent.DOB),
      gender: decrypt(updatedStudent.gender),
      address: decrypt(updatedStudent.address),
      course: decrypt(updatedStudent.course),
    };  
    res.json({ message: "Profile updated successfully", student: decryptedUpdatedStudent });
  }catch(error){
    console.error("Error updating student profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const deleteStudentProfile = async(req: Request, res: Response) => {
  try{
    const studentId = req.params.id; // Assuming userId is set in auth middleware
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if(!deletedStudent){
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Profile deleted successfully" });
  }catch(error){
    console.error("Error deleting student profile:", error);
    res.status(500).json({ message: "Server error" });
  }
} 