import { useContext, useState } from "react";
import "./ProfileUpdate.scss";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/UploadWidget/UploadWidjet";

const ProfileUpdate =()=> {
  const {currentUser,updateUser} = useContext(AuthContext)
  const [avatar, setAvatar] = useState([]);
  const [loading,Setloading] = useState(false)
  const navigate = useNavigate()
  
  const handleUpdate = async(e)=>{
    e.preventDefault()
    const formData = new FormData(e.target)
   const {username,email,password} = Object.fromEntries(formData)
   Setloading(true)
   try {
    const {data} = await axios.put(`/api/user/updateuser/${currentUser.id}`,{username,email,password,avatar:avatar[0]})
    updateUser(data)
    toast.success("Profile Updated Successfully")
    navigate('/profile')
   } catch (error) {
      toast.error(error.response.data)
      console.log(error)
      Setloading(false)
   }
  }

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleUpdate}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button type="submit" disabled={loading}>Update</button>
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar[0] || currentUser.avatar || '/noavatar.jpg'} alt="" className="avatar" />
        <UploadWidget uwConfig={{
          cloudName:`${process.env.VITE_CLOUD_NAME}`,
          uploadPreset:`${process.env.VITE_CLOUD_PRESET}`,
          multiple:false,
          maxImageFileSize:2000000,
          folder:"avatars"
        }}
          setState={setAvatar}
          condition={"Upload Image"}
         />
      </div>
    </div>
  );
}

export default ProfileUpdate;