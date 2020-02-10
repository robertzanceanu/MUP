const mongoose = require('mongoose')
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const partiesRoute = require('./routes/parties')
const statsRoute = require('./routes/stats')
const { initSpotify, getRecommandations } = require('./global-functions/spotify')
// const WebSocket= require('websocket');

// const WebSocket=require('ws');

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
app.use('/api/statistics',statsRoute)

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


const io=require("socket.io");
const server=io.listen(8000);

server.on("connection",(socket)=>{
  console.info(`Client connected [id=${socket.id}]`)

  socket.on("disconnect", () => {
    console.info(`Client gone [id=${socket.id}]`);
  });
  socket.on("semnal",(message)=>{
    socket.emit("new",'new');
    console.info(message);
  });

  socket.on("newsong",(message)=>{
    socket.emit("new_song",'new_song');
  });

});


// var WebSocketServer = require('websocket').server;
// var http = require('http');

// var server = http.createServer(function(request, response) {});
// server.listen(app.listen(8081), function() {
//     console.log('Server is listening on port 8081');
//  });

// wsServer = new WebSocketServer({
//   httpServer: server
// });


// wsServer.on('request', function(request) {
//     var clients=[];
//     var connection = request.accept(null, request.origin);

//     console.log('connection accepted');

//   connection.on('message', function(message) {
//     if (message.type === 'utf8') {
//       console.log('received message: %s',message);
//       if (message==='new'){
//           clients.forEach(function(client) {
//             client.send(message);
//             console.log('am trimis');
//           });
//         }
//         }
//     });

//   connection.on('close', function(connection) {
//     console.log('conexiunea websocket s-a terminat');
//   });
// });


// const server=new WebSocket.Server({server:app.listen(8081)});

// server.on('connection', socket => {
//   socket.on('message', message => {
//     console.log(`received from a client: ${message}`);
//   });
//   socket.send('Hello world!');
// });