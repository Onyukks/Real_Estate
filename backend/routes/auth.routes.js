const { RegisterUser, LoginUser, LogoutUser, checkAuth } = require('../controllers/auth.controller')
const {protectedRoute} = require('../middleware/protectedRoute')
const router = require('express').Router()

router.post('/register',RegisterUser)
router.post('/login',LoginUser)
router.post('/logout',LogoutUser)
router.get('/checkAuth',protectedRoute,checkAuth)

module.exports = router