import { createContext, useState } from "react";
import axios from 'axios'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState( null);

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  const checkAuth = async()=>{
     try {
      const {data} = await axios.get('/api/auth/checkAuth',{
          withCredentials:true
      })
      setCurrentUser(data.user)
     } catch (error) {
      setCurrentUser(null)
     }
  }

  return (
    <AuthContext.Provider value={{ currentUser,updateUser,checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};