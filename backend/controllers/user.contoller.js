const validator = require('validator')
const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')

module.exports.UpdateUser = async(req,res)=>{
    const {id} = req.params
    if(id!==req.user.id) return res.status(404).json("Not Authorized")
    const {password,avatar,...inputs} = req.body
     let hash = null
   if(password){
     const isPasswordValid = validator.isStrongPassword(password)
     if(!isPasswordValid) return res.status(400).json("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character")

      const salt = await bcrypt.genSalt(10)
      hash = await bcrypt.hash(password,salt)
   }
    try {
        const updatedUser = await prisma.user.update({
            where:{id:req.user.id},
            data:{
                ...inputs,
                ...(hash && {password:hash}),
                ...(avatar && {avatar})
            }
        })
        const {password:userPassword,...userwithoutpassword} = updatedUser
        res.status(200).json(userwithoutpassword)
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}

module.exports.DeleteUser = async(req,res)=>{
    const {id} = req.params
    if(id!==req.user.id) return res.status(404).json("Not Authorized")

    try {
        await prisma.user.delete({
            where:{id:req.user.id}
        })
     res.status(200).json("Deleted Successfully")
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}

module.exports.GetUserResidencies = async(req,res)=>{
    try {
       const userResidencies = await prisma.residency.findMany({
        where:{
            userId:req.user.id
        }
       }) 
       const saved = await prisma.savedResidency.findMany({
          where:{
            userId:req.user.id
          },
          include:{
            residency:true
          }
       })
       const savedResidencies = saved.map(item=>item.residency)
       res.status(200).json({userResidencies,savedResidencies})
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}

module.exports.GetUserNotifications = async(req,res)=>{
    try {
        const number = await prisma.chat.count({
            where:{
               userIDs:{
                hasSome:[req.user.id]
               },
               NOT:{
                seenBy:{
                    hasSome:[req.user.id]
                }
               }
            }
        })
        res.status(200).json(number)
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}