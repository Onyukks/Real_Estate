const { GetChats, GetChat, AddChat, ReadChat } = require('../controllers/chat.controller')

const router = require('express').Router()

router.get('/allchats',GetChats)
router.get('/singlechat/:chatId',GetChat)
router.post('/addchat',AddChat)
router.put('/readchat/:chatId',ReadChat)


module.exports=router