import { Route, Routes } from 'react-router-dom'
import './App.css'
import StudentForm from './components/StudentForm'
import LoginForm from './components/LoginForm'
import StudentList from './components/StudentList'


function App() {

  return (
    <>
      <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<StudentForm />} />
      <Route path="/students" element={<StudentList />} />
    </Routes>
    </>
  )
}

export default App
