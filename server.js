require("dotenv").config();
const express = require("express");
const formData = require("express-form-data");
const bodyParser = require("body-parser");
const cors = require("cors");
const Routes = require("./src/routes").routers(); 
const ErrorHandler = require("./src/middleware/error-handler"); 
const AuthJWT = require("./src/middleware/auth_jwt"); 
const db = require("./src/use-cases/model");
const expressWs = require('express-ws');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
const Gun = require('gun');
const WebSocket = require('ws');
const port = process.env.PORT || 8086
const app = express();
expressWs(app);
// Azure Web PubSub connection string
const connectionString = 'Endpoint=https://unifiedwebsocket.webpubsub.azure.com;AccessKey=YvED3y9idvJddw8GlMCySPCMpYgNuo67gI6Z83HEUyY=;Version=1.0;';
const hubName = 'web3chat';

// Create a Web PubSub client
const client = new WebPubSubServiceClient(connectionString, hubName);

// Mapping of room IDs to WebSocket clients
const roomClientsMap = {};

app.use(express.static('public'));

app.ws('/api/chat/:roomId/:userId', async (ws, req) => {
  const { roomId, userId } = req.params;

  if (!roomId || !userId) {
    ws.close();
    return;
  }

  if (!roomClientsMap[roomId]) {
    roomClientsMap[roomId] = [];
  }

  const roomClients = roomClientsMap[roomId];
  roomClients.push(ws);

  ws.on('message', async (message) => {
    roomClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ text: message, sender: userId }));
      }
    });
  });

  ws.on('close', () => {
    const index = roomClients.indexOf(ws);
    if (index !== -1) {
      roomClients.splice(index, 1);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(formData.parse());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
// app.use(AuthJWT);
app.use(ErrorHandler);
app.use(express.json({
	verify : (req, res, buf ) => {
		try {
			JSON.parse(buf);
		} catch (e) {
			res.status(404).send("Not allowed json format");
		}
	}
}));
  
(async () => {
	await db.sequelize.sync();
})();


let server
try {
	server = app.listen(port, "0.0.0.0", () => {
		console.log(`Listening on port ${port}`);
	});
} catch (error) {
	console.log("ERROR ON LISTENING: ", error);
}
// add route
Routes.map(route => { 
	app.use(route.url, route.pathName);
});
