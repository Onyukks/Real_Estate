import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast'
import axios from 'axios'
import { useState } from "react";


const Register = () => {
  const navigate = useNavigate()
  const [loading,Setloading] = useState(false)
  const handleSubmit = async(e)=>{
    e.preventDefault()

    const formData = new FormData(e.target)
   const username = formData.get('username')
   const email = formData.get('email')
   const password = formData.get('password')
   Setloading(true)
   try {
    await axios.post('/api/auth/register',{username,email,password})
    toast.success('Registration Successful. Login to proceed')
    navigate('/login')
   } catch (error) {
    toast.error(error.response.data)
    Setloading(false)
   }

  }
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username"  required/>
          <input name="email" type="email" placeholder="Email" required/>
          <input name="password" type="password" placeholder="Password" required/>
          <button type="submit" disabled={loading}>Register</button>
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;