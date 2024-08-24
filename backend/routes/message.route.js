const { AddMessage } = require('../controllers/message.controller')

const router = require('express').Router()

router.post('/:chatId',AddMessage)

module.exports=router