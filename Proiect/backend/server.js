const mongoose = require('mongoose')
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const partiesRoute = require('./routes/parties')
const { initSpotify, getRecommandations } = require('./global-functions/spotify')

var cors = require('cors')

dotenv.config()

mongoose
  .connect("mongodb://localhost/MusicPartyChooser", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB...", err))

app.use(cors())
app.use(express.json())
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/parties', partiesRoute)

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');


const port = process.env.PORT || 3000
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Documentation API',
      description: '',
      servers: 'http://localhost:3000'
    }
  },
  apis: ["./routes/*.js"],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};


const swaggerDocs = swaggerJsDoc(swaggerOptions)


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(port, () => console.log(`Listening on port ${port}`))