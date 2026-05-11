import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { decrypt, encrypt } from "../utils/crypto";
import toast from "react-hot-toast";

function StudentList() {
 
  const [students, setStudents] = useState([
    { _id:"", fullName: "", email: "", course: " ",gender: "",DOB: "", address: "", phoneNumber: "" },
  ]);
  const [decryptedStudents, setDecryptedStudents] = useState([
    { _id:"", fullName: "", email: "", course: " ",gender: "",DOB: "", address: "", phoneNumber: "" },
  ]); 
  const [updatedData, setUpdatedData] = useState({
    _id: "",
    fullName: "",
    email: "",
    course: "",
    gender: "" ,
    DOB: "",
    address: "",
    phoneNumber: ""
  });

  const [crptedUpdatedData, setCrptedUpdatedData] = useState({
    _id: "",
    fullName: "",
    email: "",
    course: "",
    gender: "" ,
    DOB: "",
    address: "",
    phoneNumber: ""
  });

  const [isOpen, setIsOpen] = useState(false);  

     const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/students`);
        // decrypt the student data before setting it to state
        const decryptedStudents = response.data.map((student: any) => ({
          ...student,
          fullName: decrypt(student.fullName),
          email: decrypt(student.email),
          phoneNumber: decrypt(student.phoneNumber),
          DOB: decrypt(student.DOB),
          gender: decrypt(student.gender),
          address: decrypt(student.address),
          course: decrypt(student.course),
        }));
        setDecryptedStudents(decryptedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

  useEffect(() => {
 
    fetchStudents();
  
  }, []);

  const setUpdated = (data: any) => {
    setUpdatedData({
      _id: data._id,
      fullName: data.fullName,
      email: data.email,
      course: data.course,
      gender: data.gender,
      DOB: data.DOB,
      address: data.address,
      phoneNumber: data.phoneNumber
    });
    setCrptedUpdatedData({
      _id: data._id,
      fullName: encrypt(data.fullName),
      email: encrypt(data.email),
      course: encrypt(data.course),
      gender: encrypt(data.gender),
      DOB: encrypt(data.DOB),
      address: encrypt(data.address),
      phoneNumber: encrypt(data.phoneNumber)
    });
  }

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting student with ID:", id);
      await axios.delete(`http://localhost:5001/api/student/${id}`);
      setDecryptedStudents(decryptedStudents.filter(student => student._id !== id));
      toast.success("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student.");
    }
  };
  

  const handleUpdate = async (id: string) => {
    // Implement update logic here, e.g., navigate to an update form or open a modal
    console.log("Update student with ID:", id);
    try { 
      await axios.put(`http://localhost:5001/api/student/${id}`, crptedUpdatedData);
      toast.success("Student updated successfully!");
      fetchStudents();
      setUpdatedData({
        _id: "",
        fullName: "",
        email: "",
        course: "",
        gender: "",
        DOB: "",
        address: "",
        phoneNumber: ""
      });
      setStudents(students.map(student => (student._id === id ? { ...student, ...updatedData } : student)));
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/register" className="mb-4 inline-block fixed top-10 right-10 font-bold text-blue-500 hover:underline">
        Add New Student
      </Link>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Student List
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {decryptedStudents.map((student) => (
          <div
            key={student._id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {student.fullName}
            </h2>

            <p className="text-gray-600 mt-2">
              📧 {student.email}
            </p>

            <p className="text-gray-600">
              🎓 {student.course}
            </p>
              <p className="text-gray-600"> 
              📞 {student.phoneNumber}
            </p>
             <p className="text-gray-600">
              🎂 {student.DOB}
            </p>
             <p className="text-gray-600">
              📍 {student.address}
            </p>
            <div className="flex space-x-2 mt-4">
            <button
              onClick={() => { setUpdated(student); setIsOpen(true);}}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              update
            </button>
            <button 
            onClick={() => handleDelete(student._id)}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
              delete
            </button>
            </div>
          </div>
        ))}
      </div>
        {/* Update Modal */}  
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Student</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={updatedData.fullName}
              onChange={(e) => 
              {
                setUpdatedData({ ...updatedData, fullName: e.target.value })
                setCrptedUpdatedData({ ...crptedUpdatedData, fullName: encrypt(e.target.value) })
              }
              }
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={updatedData.email}
              onChange={(e) => {
                setUpdatedData({ ...updatedData, email: e.target.value });
                setCrptedUpdatedData({ ...crptedUpdatedData, email: encrypt(e.target.value) });
              }}
              className="w-full mb-3 p-2 border rounded"
            />
            <select
              value={updatedData.course}
              onChange={(e) => {
                setUpdatedData({ ...updatedData, course: e.target.value });
                setCrptedUpdatedData({ ...crptedUpdatedData, course: encrypt(e.target.value) });
              }}
              className="w-full mb-3 p-2 border rounded"
            >
              <option value="">Select Course</option>
              <option value="B.Tech">Java</option>
              <option value="M.Tech">Javascript</option>
            </select>
      
            <select
              value={updatedData.gender}
              onChange={(e) => {
                setUpdatedData({ ...updatedData, gender: e.target.value });
                setCrptedUpdatedData({ ...crptedUpdatedData, gender: encrypt(e.target.value) });
              }}
              className="w-full mb-3 p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
  
            <input
              type="date"
              placeholder="Date of Birth"
              value={updatedData.DOB}
              onChange={(e) => {
                setUpdatedData({ ...updatedData, DOB: e.target.value });
                setCrptedUpdatedData({ ...crptedUpdatedData, DOB: encrypt(e.target.value) });
              }}  
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={updatedData.address}
              onChange={(e) => {
                setUpdatedData({ ...updatedData, address: e.target.value });
                setCrptedUpdatedData({ ...crptedUpdatedData, address: encrypt(e.target.value) });
              }}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={updatedData.phoneNumber}
              onChange={(e) => {
                setUpdatedData({ ...updatedData, phoneNumber: e.target.value });
                setCrptedUpdatedData({ ...crptedUpdatedData, phoneNumber: encrypt(e.target.value) });
              }}
              className="w-full mb-3 p-2 border rounded"
            />      
            <button
              onClick={() => {
                // Call handleUpdate with the appropriate student ID
                // For demonstration, using a hardcoded ID. Replace with actual ID as needed.
                handleUpdate(updatedData._id);
                setIsOpen(false);
              }}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}  
    </div>
  );
}

export default StudentList;