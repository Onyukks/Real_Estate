import { useContext, useState } from "react";
import "./Login.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [loading,Setloading] = useState(false)
  const {updateUser} = useContext(AuthContext)
  const handleSubmit = async(e)=>{
    e.preventDefault()
    const formData = new FormData(e.target)
   const email = formData.get('email')
   const password = formData.get('password')
   
   Setloading(true)
   try {
   const {data} = await axios.post('/api/auth/login',{email,password})
   console.log(data)
    toast.success('Login Successful')
    updateUser(data)
   } catch (error) {
    toast.error(error.response.data)
    Setloading(false)
    updateUser(null)
   }
  }

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="email" type="email" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button type="submit" disabled={loading}>Login</button>
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;