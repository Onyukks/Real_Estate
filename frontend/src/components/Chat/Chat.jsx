import { useContext, useEffect, useRef, useState } from "react";
import "./Chat.scss";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "timeago.js";
import { useNotificationStore } from "../../lib/notificationStore";

const Chat = ({chats,chat: initialChat  }) => {
  const [chat, setChat] = useState(initialChat || null);
  const {currentUser} = useContext(AuthContext)
  const {socket} = useContext(SocketContext)

   useEffect(() => {
    if (initialChat) {
      setChat(initialChat);
    }
  }, [initialChat]);

  const messageEndRef = useRef()

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async(id,receiver)=>{
      try {
        const {data} = await axios.get(`/api/chat/singlechat/${id}`)
        if (!data.seenBy.includes(currentUser.id)) {
          decrease();
        }
        setChat({...data,receiver})
      } catch (error) {
        toast.error("Failed to get messages")
        console.log(error)
      }
  }

  const handleSubmit = async(e)=>{
      e.preventDefault()
      try {
        const formData = new FormData(e.target);
        const text = formData.get("text");
    
        if (!text) return;

        const {data} = await axios.post(`/api/message/${chat.id}`,{text})
        setChat(prev=>({...prev,messages:[...prev.messages,data]}))
        e.target.reset();

        socket.emit('sendMessage',{
          receiverId : chat.receiver.id,
          data
        })

      } catch (error) {
        toast.error('Error sending message')
        console.log(error)
      }
  }

  useEffect(()=>{

      const read = async () => {
        try {
          await axios.put(`/api/chat/readchat/${chat.id}`)
        } catch (error) {
          console.log(error)
        }
      }

      if(chat && socket){
        socket.on("getMessage",data=>{
            if(chat.id===data.chatId) {
              setChat(prev=>({...prev,messages:[...prev.messages,data]}))
              read()
            }
        })
      }
      return () => {
        socket.off("getMessage");
      };
  },[socket,chat])


  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
       {
        chats?.map(c=>(
          <div className="message" 
          key={c.id}
          style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
          onClick={()=>handleOpenChat(c.id,c.receiver)}
          >
          <img
            src={c.receiver.avatar || '/noavatar.jpg'}
            alt=""
          />
          <span>{c.receiver.username}</span>
          <p>{c.lastMessage?.split(' ').slice(0, 10).join(' ')}...</p>
        </div>
        ))
       }
        
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver.avatar || '/noavatar.jpg'}
                alt=""
              />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={()=>setChat(null)}>X</span>
          </div>
          <div className="center">
          {chat.messages?.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;