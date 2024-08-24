const validator = require('validator')
const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')
const jwt = require('jsonwebtoken')

const env = process.env

module.exports.RegisterUser = async(req,res)=>{
    const {password,email,username} = req.body
    if(!email || !password || !username) return res.status(400).json("All fields are required")
    const isPasswordValid = validator.isStrongPassword(password)
    const isEmailValid = validator.isEmail(email)

    if(!isEmailValid) return res.status(400).json("Email is not valid")
 
    if(username.length < 3) return res.status(400).json("Username must be at least 3 characters")
 
    if(!isPasswordValid) return res.status(400).json("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character")
   
       const existingEmail = await prisma.user.findUnique({where:{email}})
       if(existingEmail) return res.status(409).json("Email already exists")
    
       const existingUsername = await prisma.user.findUnique({where:{username}})
       if(existingUsername) return res.status(409).json("Username already exists")
      
        try {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password,salt)
            const newUser = await prisma.user.create({
                data:{
                    email,
                    username,
                    password:hash
                }
            })
            const { password:userpassword, ...userWithoutPassword } = newUser
            res.status(201).json(userWithoutPassword)
        } catch (error) {
            console.log(error)
            res.status(500).json('Internal Server Error')
        }
}

module.exports.LoginUser = async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password ) return res.status(400).json("All fields are required")
   try {
    const user = await prisma.user.findUnique({where:{email}})
    if(!user) return res.status(404).json('Incorrect Email or Password')
    const validPassword = await bcrypt.compare(password,user.password)
    if(!validPassword) return res.status(404).json('Incorrect Email or Password')
    
    const { password:userpassword, ...userWithoutPassword } = user
    
    const age = 1000 * 60 * 60 * 24 * 7
    const token = jwt.sign({
        id:user.id
    },process.env.SECRET_KEY,{
        expiresIn:age
    })
    res.cookie('token',token,{
        httpOnly: true,
        sameSite : "strict",
        secure: env.NODE_ENV !== 'development',
        maxAge:age
    })
    res.status(200).json(userWithoutPassword)
   } catch (error) {
    console.log(error)
    res.status(500).json('Internal Server Error')
   }
}

module.exports.LogoutUser = async(req,res)=>{
    try {
        res.clearCookie("token")
        res.status(200).json('Logged out successfully')
      } catch (error) {
        console.log(error)
        res.status(500).json("Internal Server Error")
      }
}

module.exports.checkAuth = (req,res)=>{
    try {
       res.status(200).json({success:true,user:req.user})
    } catch (error) {
       console.log(error)
       res.status(500).json({success:false,message:"Internal Server Error"})
    }
 }