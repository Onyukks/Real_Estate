const { AddResidency, GetResidencies, GetSingleResidency, DeleteResidency, SaveResidency } = require('../controllers/residency.controller')
const { protectedRoute } = require('../middleware/protectedRoute')

const router = require('express').Router()

router.post('/add',protectedRoute,AddResidency)
router.get('/all',GetResidencies)
router.get('/single/:id',GetSingleResidency)
router.delete('/single/:id',protectedRoute,DeleteResidency)
router.post('/save',protectedRoute,SaveResidency)

module.exports = router