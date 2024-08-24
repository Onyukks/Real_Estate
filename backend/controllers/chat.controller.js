const prisma = require('../lib/prisma')

module.exports.GetChats = async(req,res)=>{
  try {
    const chats = await prisma.chat.findMany({
        where:{
            userIDs:{
                hasSome:[req.user.id]
            }
        }
    })
    for (const chat of chats){
        const receiverId = chat.userIDs.find(id=>id!==req.user.id)
        const receiver = await prisma.user.findUnique({
            where:{
                id:receiverId
            },
            select:{
                id:true,
                username:true,
                avatar:true
            }
        })
        chat.receiver = receiver
    }
    res.status(200).json(chats)
  } catch (error) {
    console.log(error)
    res.status(500).json('Internal Server Error')
  }
}

module.exports.GetChat = async(req,res)=>{
    try {
        const chat = await prisma.chat.findUnique({
            where:{
                id:req.params.chatId,
                userIDs:{
                    hasSome:[req.user.id]
                }
            },
            include:{
                messages: {
                    orderBy:{
                        createdAt:'asc'
                    }
                }
            }
        })
        await prisma.chat.update({
            where:{
                id:req.params.chatId
            },
            data:{
                seenBy:{
                    push:[req.user.id]
                }
            }
        })
        res.status(200).json(chat)
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}

module.exports.AddChat = async(req,res)=>{
    try {
        const existingChat = await prisma.chat.findFirst({
            where:{
                userIDs:{
                    hasEvery:[req.user.id,req.body.receiverID]
                }
            },
            include:{
                messages: {
                    orderBy:{
                        createdAt:'asc'
                    }
                }
            }
        })
        if (existingChat) {
            await prisma.chat.update({
                where:{
                    id:existingChat.id
                },
                data:{
                    seenBy:{
                        push:[req.user.id]
                    }
                }
            })
            return res.status(200).json(existingChat)
        }
       const newChat = await prisma.chat.create({
         data:{
            userIDs:[req.user.id,req.body.receiverID]
         }
       })
       res.status(201).json(newChat)
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}

module.exports.ReadChat = async(req,res)=>{
    try {
        const chat = await prisma.chat.update({
            where:{
                id:req.params.chatId,
                userIDs:{
                    hasSome:[req.user.id]
                }
            },
            data:{
                seenBy:{
                    set:[req.user.id]
                }
            }
        })
        res.status(200).json(chat)
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}