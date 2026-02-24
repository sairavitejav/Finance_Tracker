const express = require("express")
const {getTransactions, addTransaction} = require("../controllers/transactionsController")
const protectedRoute = require("../middleware/authMiddleware")
const router = express.Router()

router.post('/', protectedRoute, addTransaction)
router.get('/', protectedRoute, getTransactions)

module.exports = router