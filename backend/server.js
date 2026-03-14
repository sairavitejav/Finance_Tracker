const express = require('express')
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const authRoutes = require('./routes/authRoute')
const transactionsRoutes = require('./routes/transactionRoutes')
const profileRoutes = require('./routes/profileRoute')

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionsRoutes)
app.use('/api/profile', profileRoutes)

// app.get('/', (req, res) => {
//     res.send("From GET Request")
// })

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is Running at ${PORT}`)
})