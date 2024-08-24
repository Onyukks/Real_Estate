const prisma = require('../lib/prisma')
const jwt = require('jsonwebtoken')
const env = process.env

module.exports.AddResidency = async(req,res)=>{
   try {
    const newResidency = await prisma.residency.create({
        data:{
            ...req.body.postData,
            userId : req.user.id,
            postDetail:{
                create:req.body.postDetail
            }
        }
    })
    res.status(201).json(newResidency)
   } catch (error) {
    console.log(error)
    res.status(500).json('Internal Server Error')
   }    
}
module.exports.GetResidencies = async(req,res)=>{
  const query = req.query
    try {
    const residencies = await prisma.residency.findMany({
      where: {
        city: {
           contains: query.city || undefined,
           mode:'insensitive'
        },
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      }
    })
    res.status(200).json(residencies)
    } catch (error) {
        console.log(error)
        res.status(500).json('Internal Server Error')
    }
}
module.exports.GetSingleResidency = async(req,res)=>{
    const {id} = req.params
    try {
        const residency = await prisma.residency.findUnique({
            where:{id},
            include:{
                postDetail:true,
                user:{
                    select:{
                        id:true,
                        username:true,
                        avatar:true
                    }
                }
            }
        })
        const token = req.cookies['token']
        if(token){
          const decoded = jwt.verify(token,env.SECRET_KEY)
          if(decoded){
            const savedPost = await prisma.savedResidency.findUnique({
              where:{
                userId_postId:{
                  postId:id,
                  userId:decoded.id,
                }
              }
            })
            return res.status(200).json({...residency,isSaved:savedPost? true:false})
          }
        }
        res.status(200).json({...residency,isSaved:false})
        } catch (error) {
            console.log(error)
            res.status(500).json('Internal Server Error')
        }
}
module.exports.DeleteResidency = async (req, res) => {
    const { id } = req.params;
    
    try {
      const residency = await prisma.residency.findUnique({
        where: { id },
        include: { postDetail: true }, // Include postDetail to check if it exists
      });
  
      if (!residency) {
        return res.status(404).json({ message: "Residency not found" });
      }
  
      if (residency.userId !== req.user.id) {
        return res.status(403).json({ message: "Not Authorized!" });
      }

      // Delete related ResidencyDetail if it exists
      if (residency.postDetail) {
        await prisma.residencyDetail.delete({
          where: { id: residency.postDetail.id },
        });
      }
  
      // Delete the Residency
      await prisma.residency.delete({
        where: { id },
      });
  
      res.status(200).json({ message: "Residency deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to delete Residency" });
    }
  };

  module.exports.SaveResidency = async(req,res)=>{
    const {postId} = req.body

    try {
      const savedResidency = await prisma.savedResidency.findUnique({
        where:{
          userId_postId:{
            userId:req.user.id,
            postId
          }
        }
      })
      if(savedResidency){
        await prisma.savedResidency.delete({
          where:{
            id:savedResidency.id
          }
        })
        res.status(200).json('Residency removed from saved lists')
      }else{
        await prisma.savedResidency.create({
          data:{
            userId:req.user.id,
            postId
          }
        })
        res.status(200).json('Residency added to saved lists')
      }
    } catch (error) {
      console.log(error)
       res.status(500).json('Internal Server Error')
    }
  }