require("dotenv").config();
const md5 = require("md5");
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

const ConnectedClients = [];
app.ws("/chat/queue", async (ws, req) => {
  // if (!roomClientsMap[roomId]) {
  //   roomClientsMap[roomId] = [];
  // }
  // ws.roomId = roomId;
  console.log(req.query);
  ws.on("connection", () => {
    console.log("connected");
  });
  const { caller_id, id } = req.query;
  const { status_code } = await db.models.csrchatroomsModel.findOne({ where: { room_code: id } });
  if( status_code == "1" ) {
    await db.models.csrchatroomsModel.update({ status_code: "2" },{ where: { room_code: id } });
    await db.models.csrchatqueueModel.create({ caller_id, transaction: "CHAT"});
  }

  if (ConnectedClients.indexOf(ws) < 0) {
    ConnectedClients.push(ws);
  }

  ws.on("message", async (message) => {
    ConnectedClients.forEach((client) => {
      console.log(message);
      //console.log(client);
      console.log(message);

      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ text: message }));
      }
    });
  });
  ws.on("close", () => {
    const index = ConnectedClients.indexOf(ws);
    if (index !== -1) {
      ConnectedClients.splice(index, 1);
    }
  });
});

app.ws('/api/chat/:roomId/:userId', async (ws, req) => {
  const { roomId, userId } = req.params;
  if (!roomId || !userId) {
    ws.close();
    return;
  }
  try {
    const hashedid = md5(userId);
    if (!roomClientsMap[hashedid]) {
      roomClientsMap[hashedid] = [];
      const chatinfo = await db.models.csrchatroomsModel.findOne({ where: { room_code: hashedid } });
  
      if(!chatinfo) return;
      if(!chatinfo) {

        db.models.csrchatroomsModel.create({ user_id: userId, customer_id: userId, room_code: hashedid, chat_name: `${userinfo?.first_name} ${userinfo?.middlename} ${userinfo?.last_name}` });
        
      }
    }
  
    const roomClients = roomClientsMap[hashedid];
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
    
  } catch (error) {
    console.log(error);
  }
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
	await db.sequelize2.sync();
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
