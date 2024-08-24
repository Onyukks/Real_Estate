require('dotenv').config()
const express = require('express')
const authroutes = require('./routes/auth.routes')
const userroutes = require('./routes/user.route')
const residencyroutes = require('./routes/residency.route')
const chatroute = require('./routes/chat.route')
const messageroute = require('./routes/message.route')
const cookieParser = require('cookie-parser')
const { protectedRoute } = require('./middleware/protectedRoute')
const path = require('path')

const app = express()

const NODE_ENV = process.env.NODE_ENV

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authroutes)
app.use('/api/user',protectedRoute,userroutes)
app.use('/api/residency',residencyroutes)
app.use('/api/chat',protectedRoute,chatroute)
app.use('/api/message',protectedRoute,messageroute)


if(NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'../frontend/dist', 'index.html'))
    })
}


const PORT = process.env.PORT
const server = app.listen(PORT,()=>console.log(`Server is up and running on ${PORT}`))

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{
        origin:'http://localhost:5173'
    }
})

let onlineUsers = []

const addUser = (userId,socketId)=>{
    const userExists = onlineUsers.find(user=>user.userId === userId)
    if(!userExists){
        onlineUsers.push({userId,socketId})
    }
}

const getUser = (userId)=>{
    return onlineUsers.find(user=>user.userId === userId)
}

const removeUser = (socketId)=>{
    onlineUsers = onlineUsers.filter(user=>user.socketId !== socketId)
}

io.on('connection',socket=>{
    socket.on('newUser',userId=>{
        addUser(userId,socket.id)
    })

    socket.on('sendMessage',({receiverId,data})=>{
        const receiver = getUser(receiverId)
        io.to(receiver.socketId).emit("getMessage",data)
    })

    socket.on('disconnect',()=>{
        removeUser(socket.id)
    })
})


