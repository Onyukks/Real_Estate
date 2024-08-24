const prisma = require("../lib/prisma")

module.exports.AddMessage = async(req,res)=>{
    const {chatId} = req.params
    
    try {
        const chat = await prisma.chat.findUnique({
            where:{
                id:chatId,
                userIDs:{
                    hasSome:[req.user.id]
                }
            }
        })
        if(!chat) return res.status(404).json("Chat not found")
        const message = await prisma.message.create({
        data:{
            chatId,
            userId:req.user.id,
            text:req.body.text
        }
    })
    await prisma.chat.update({
        where:{
           id:chatId 
        },
        data:{
            seenBy:[req.user.id],
            lastMessage:req.body.text
        }
    })
    res.status(200).json(message);
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}