const config = require('config')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const usersRoute = require('./routes/userRoute')

if (!config.get("myprivatekey")) {
    console.error("FATAL ERROR: myprivatekey is not defined.");
    process.exit(1);
}

mongoose
  .connect("mongodb://localhost/MusicPartyChooser", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...",err))

app.use(express.json())
app.use('/api/user', usersRoute)


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))