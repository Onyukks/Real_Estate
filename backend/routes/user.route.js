const { UpdateUser, DeleteUser, GetUserResidencies, GetUserNotifications } = require('../controllers/user.contoller')


const router = require('express').Router()

router.put('/updateuser/:id',UpdateUser)
router.delete('/deleteuser/:id',DeleteUser)
router.get('/profileresidency',GetUserResidencies)
router.get('/notifications',GetUserNotifications)

module.exports = router