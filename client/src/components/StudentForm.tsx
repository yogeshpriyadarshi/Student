import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../utils/crypto";
import toast from "react-hot-toast";

function StudentForm() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    DOB: "",
    gender: "",
    address: "",
    course: "",
    password: "",
  });
  const [encrptedStudent, setEncrptedStudent] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",  
    DOB: "",
    gender: "",
    address: "",
    course: "",
    password: "",
  });
  const [viewPassword, setViewPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target as { name: string; value: string };
    value = encrypt(value);

    setStudent({ ...student, [name]: e.target.value });
    setEncrptedStudent({ ...encrptedStudent, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(student);
    try {  
      const response: any = await axios.post(`http://localhost:5001/api/register`, encrptedStudent);
      console.log(response.data);
      toast.success("Student registered successfully!");
      navigate("/students");
    } catch (error) {
      console.error("Error registering student:", error);
      alert("Failed to register student. Please try again.");
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Student Registration
        </h2>

        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={student.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your email"
          />
        </div>
        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={student.phoneNumber}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your phone number"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block mb-1 font-medium">Date of Birth</label>
          <input
            type="date"
            name="DOB"
            value={student.DOB}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={student.gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            name="address"
            value={student.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter address"
          />
        </div>

     {/* Course */}
        <div>
          <label className="block mb-1 font-medium">Course</label>
          <select
            name="course"
            value={student.course}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Course</option>
            <option value="javascript">Javascript</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type={viewPassword ? "text" : "password"}
            name="password"
            value={student.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={() => setViewPassword(!viewPassword)}
            className="mt-1 text-sm text-blue-600 hover:underline"
          >
            {viewPassword ? "Hide Password" : "Show Password"}
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default StudentForm;