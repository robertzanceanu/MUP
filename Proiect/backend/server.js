const mongoose = require('mongoose')
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
var cors = require('cors')

dotenv.config()

mongoose
  .connect("mongodb://localhost/MusicPartyChooser", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...",err))

app.use(cors())
app.use(express.json())
app.use('/api/user', authRoute)
app.use('/api/posts',postRoute)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))