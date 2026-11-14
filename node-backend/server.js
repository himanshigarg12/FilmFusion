const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '.env') })

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// Check if MONGO_URI is loaded
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found ✅' : 'Not found ❌')

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'FilmFusion Backend is running! 🎬',
    status: 'success'
  })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!')
  })
  .catch((error) => {
    console.log('❌ MongoDB Connection Failed:', error.message)
  })

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})