import { Await, Link, useLoaderData, useLocation } from "react-router-dom";
import Chat from "../../components/Chat/Chat";
import List from "../../components/List/List";
import "./Profile.scss";
import { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const {currentUser,updateUser} = useContext(AuthContext)
  const data = useLoaderData();

  const [chat, setChat] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.newChat && location.state?.receiver) {
      setChat({ ...location.state.newChat, receiver: location.state.receiver });
    }
  }, [location.state]);

  const handleLogout = async()=>{
      try {
        await axios.post('/api/auth/logout')
        toast.success('Logout successfull')
        updateUser(null)
      } catch (error) {
        toast.error(error.response.data)
      }
  }

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to={'/update'}><button>Update Profile</button></Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser.avatar || '/noavatar.jpg'}
                alt=""
              />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My Residencies</h1>
          <Link to={'/newpost'}><button>Create New Residency</button></Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List residencies={postResponse.data.userResidencies} />}
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved Residencies</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List residencies={postResponse.data.savedResidencies} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
        <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} chat={chat}/>}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;