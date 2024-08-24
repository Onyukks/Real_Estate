const jwt = require('jsonwebtoken')
const env = process.env
const prisma = require('../lib/prisma')

const protectedRoute = async(req,res,next)=>{
    try {
        const token = req.cookies['token']

        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized - No token provided"})
        }

        const decoded = jwt.verify(token,env.SECRET_KEY)
        if(!decoded){
            return res.status(401).json({success:false,message:"Unauthorized - Invalid token"})
        }

        const user = await prisma.user.findUnique(
            {
                where:{
                    id:decoded.id
                },select:{
                    id:true,
                    email:true,
                    username:true,
                    avatar:true,
                    posts:true,
                    savedPosts:true,
                    chats:true,
                    chatIDs:true
                }
            } )
        if(!user){
            return res.status(404).json({success:false,message:"User not found"})
        }

        req.user = user
        next()

    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}

module.exports={
    protectedRoute
}