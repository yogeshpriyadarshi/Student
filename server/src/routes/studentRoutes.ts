import express  from "express"
import { deleteStudentProfile, getAllStudents, getStudentProfile, studentLogin, studentRegister, updateStudentProfile } from "../controllers/studentController.js";
import { get } from "node:http";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", studentRegister);

router.post("/login", studentLogin);

router.get("/students", getAllStudents);

router.get("/profile", authMiddleware, getStudentProfile);

router.put("/student/:id" , updateStudentProfile);

router.delete("/student/:id", deleteStudentProfile);

 export default router;