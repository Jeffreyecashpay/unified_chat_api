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
const expressWs = require("express-ws");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");
const Gun = require("gun");
const WebSocket = require("ws");
const fileUpload = require("express-fileupload");

const port = process.env.PORT || 8086;
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(formData.parse());
// app.use(AuthJWT);
//app.use(ErrorHandler);
app.use(
  express.json({
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(404).send("Not allowed json format");
      }
    },
  })
);

app.get("/", async (req, res) => {
  //res.sendFile(__dirname + "/index.html");
  console.log(req);
  res.send({ message: "Welcome!!!!!!!!!!!!" });
});

app.use(ErrorHandler);

expressWs(app);

// Azure Web PubSub connection string
const connectionString =
  "Endpoint=https://unifiedwebsocket.webpubsub.azure.com;AccessKey=YvED3y9idvJddw8GlMCySPCMpYgNuo67gI6Z83HEUyY=;Version=1.0;";
const hubName = "web3chat";

// Create a Web PubSub client
const client = new WebPubSubServiceClient(connectionString, hubName);

// Mapping of room IDs to WebSocket clients
const roomClientsMap = {};

app.use(express.static("public"));

const queClients = [];

const getQueueNo = async (userid, transaction) => {
  const waitingQueues = await db.models.csrchatqueueModel.findAll({
    where: { queue_status: "WAITING", transaction: transaction },
    order: [["id", "ASC"]],
  });
  const queueNo = waitingQueues.findIndex((que) => {
    return +que.caller_id === +userid;
  });
  // console.log('Queue No', queueNo)
  return queueNo + 1;
};

// app.ws("/chat/queue", async (ws, req) => {
//   // if (!roomClientsMap[roomId]) {
//   //   roomClientsMap[roomId] = [];
//   // }
//   // ws.roomId = roomId;
//   // console.log(req?.query);
//   // console.log(req?.query?.id);
//   ws.on("connection", () => {
//     console.log("connected");
//   });

//   if (queClients.indexOf(ws) < 0) {
//     queClients.push(ws);
//   }

//   console.log("QUEUE CLIENTS", queClients.length);
//   ws.on("message", async (message) => {
//     const { caller_id, room_id } = JSON.parse(message);
//     const { status_code } = await db.models.csrchatroomsModel.findOne({
//       where: { id: room_id },
//     });
//     // if (status_code == "3") {
//     //   await db.models.csrchatqueueModel.create({
//     //     caller_id,
//     //     transaction: "CHAT",
//     //   });
//     //   await db.models.csrchatroomsModel.update(
//     //     { status_code: "2" },
//     //     { where: { id: id } }
//     //   );
//     // }
//     queClients.forEach((client) => {
//       // console.log(client);
//       console.log("message", message);
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ text: message }));
//       }
//     });
//     queueNoClients.forEach(async (client) => {
//       // console.log(client);
//       const queueNo = await getQueueNo(client.user_id, client.transaction);
//       const room_code = md5(+client.user_id);
//       //      console.log("message", message);
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ queueNo, room_code }));
//       }
//     });
//   });
//   ws.on("close", () => {
//     const index = queClients.indexOf(ws);
//     if (index !== -1) {
//       queClients.splice(index, 1);
//     }
//   });
// });

// const queueNoClients = [];
// app.ws("/queue/status/:trans/:userId", async (ws, req) => {
//   const { trans, userId } = req.params;

//   ws.user_id = userId;
//   ws.transaction = trans;

//   const room_code = md5(+userId);
//   queueNoClients.push(ws);

//   ws.on("message", async (e) => {
//     queueNoClients.forEach((client) => {
//       // console.log(client);
//       const queueNo = getQueueNo(client.userId);
//       //      console.log("message", message);
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ queueNo, room_code }));
//       }
//     });
//     //ws.send(JSON.stringify({ queueNo }));
//   });
//   ws.on("close", () => {
//     const index = queueNoClients.indexOf(ws);
//     if (index !== -1) {
//       queueNoClients.splice(index, 1);
//     }
//   });
// });

// const vcClientsMap = {};
// app.ws("/api/video-call/:userId", async (ws, req) => {
//   const { userId } = req.params;
//   if (!userId) {
//     ws.close();
//     return;
//   }

//   try {
//     const hashedid = md5(+userId);

//     if (!vcClientsMap[hashedid]) {
//       vcClientsMap[hashedid] = [];
//     }
//     const videoCallClients = vcClientsMap[hashedid];
//     if (videoCallClients.indexOf(ws) < 0) {
//       videoCallClients.push(ws);
//     }

//       ws.on("message", async (message) => {
//      const msgDetails = JSON.parse(message);
//       msgDetails.room_code = hashedid;

//       const chatinfo = await db.models.csrchatroomsModel
//         .findOne({ where: { room_code: hashedid } })
//         .catch((err) => {
//           console.log(err);
//         });
//         if (chatinfo?.status_code == "3" || chatinfo?.status_code === null) {
          
//           const newQueue = await db.models.csrchatqueueModel
//           .create({
//             caller_id: userId,
//             transaction: "VIDEO CALL",
//           })
//           .catch((error) => {
//             console.log(error);
//           });

//           await db.models.csrchatroomsModel.update(
//             {
//               status_code: "1",
//               status_desc: "WAITING",
//               current_queue_id: newQueue.id,
//             },
//             { where: { id: chatinfo?.id } }
//           );
  
//           // console.log('NEW QUEUE', newQueue);
//           //   console.log('WAITING QUEUE', waitingQueues.length);
//           const queueNo = await getQueueNo(newQueue.caller_id, "VIDEO CALL");
  
//           const [results, metadata] = await db.sequelize2
//             .query(
//               `SELECT q.id, 
//                       ui.last_name as lastname, 
//                       ui.first_name as firstname,
//                       q.queue_status,
//                       q.date_onqueue,
//                       q.date_ongoing,
//                       q.date_end,
//                       csr.firstname as csr_firstname,
//                       csr.lastname as csr_lastname,
//                       q.transaction,
//                       q.caller_id
//                FROM call_queues q 
//                INNER JOIN web3.users u on (u.user_id = q.caller_id)
//                INNER JOIN web3.users_info ui ON (u.user_id = ui.user_id)
//                LEFT JOIN csr_db.users csr on (csr.id = q.csr_id)
//                WHERE q.id=${newQueue.id}`
//             )
//             .catch((err) => {
//               console.log(err);
//             });
  
//           const sendQueue = results[0];
//           sendQueue.room_id = chatinfo?.id;
//           sendQueue.chat_name = chatinfo?.chat_name;
//           msgDetails.queue_no = queueNo;
  
//           queClients.forEach((queClient) => {
//             if (queClient.readyState === WebSocket.OPEN) {
//               queClient.send(
//                 JSON.stringify({
//                   text: JSON.stringify(sendQueue),
//                 })
//               );
//             }
//           });
//           chatinfo.current_queue_id = sendQueue.id;
  
//         }

//         if (chatinfo?.status_code == "1") {
//           const queueNo = await getQueueNo(userId, "VIDEO CALL");
//           msgDetails.queue_no = queueNo;
//         }

//         videoCallClients.forEach((client) => {
//           if (client.readyState === WebSocket.OPEN) {
//             client.send(
//               JSON.stringify({
//                 text: JSON.stringify(msgDetails),
//                 sender: msgDetails.sender,
//               })
//             );
//           }
//         });

//       });

//       ws.on("close", () => {
//         const index = videoCallClients.indexOf(ws);
//         if (index !== -1) {
//           videoCallClients.splice(index, 1);
//         }
//       });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.ws("/api/chat/:roomId/:userId", async (ws, req) => {
//   const { roomId, userId } = req.params;
//   if (!roomId || !userId) {
//     ws.close();
//     return;
//   }
//   try {
//     const hashedid = md5(+userId);
//     if (!roomClientsMap[hashedid]) {
//       roomClientsMap[hashedid] = [];
//       // const chatinfo = await db.models.csrchatroomsModel.findOne({
//       //   where: { room_code: hashedid },
//       // });
//     }
//     //if(!chatinfo) return;
//     // if(!chatinfo) {

//     //   db.models.csrchatroomsModel.create({ customer_id: userId, room_code: hashedid, chat_name: `${userinfo?.first_name} ${userinfo?.middlename} ${userinfo?.last_name}` });

//     // }

//     //  console.log('CHAT INFO', chatinfo)

//     const roomClients = roomClientsMap[hashedid];
//     console.log(
//       roomClients.findIndex((www) => {
//         return www === ws;
//       })
//     );
//     roomClients.push(ws);

//     console.log("CHAT CLIENTS", roomClients.length);

//     ws.on("message", async (message) => {
//       const chatinfo = await db.models.csrchatroomsModel
//         .findOne({ where: { room_code: hashedid } })
//         .catch((err) => {
//           console.log(err);
//         });

//       const msgDetails = JSON.parse(message);
//       msgDetails.room_code = hashedid;

//       // console.log("status code", chatinfo?.status_code);
//       if (chatinfo?.status_code == "3" || chatinfo?.status_code === null) {
//         const newQueue = await db.models.csrchatqueueModel
//           .create({
//             caller_id: userId,
//             transaction: "CHAT",
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//         //  console.log('NEW QUEUE', newQueue);

//         await db.models.csrchatroomsModel.update(
//           {
//             status_code: "1",
//             status_desc: "WAITING",
//             current_queue_id: newQueue.id,
//           },
//           { where: { id: roomId } }
//         );

//         // console.log('NEW QUEUE', newQueue);
//         //   console.log('WAITING QUEUE', waitingQueues.length);
//         const queueNo = await getQueueNo(newQueue.caller_id, "CHAT");

//         const [results, metadata] = await db.sequelize2
//           .query(
//             `SELECT q.id, 
//                     ui.last_name as lastname, 
//                     ui.first_name as firstname,
//                     q.queue_status,
//                     q.date_onqueue,
//                     q.date_ongoing,
//                     q.date_end,
//                     csr.firstname as csr_firstname,
//                     csr.lastname as csr_lastname,
//                     q.transaction,
//                     q.caller_id
//              FROM call_queues q 
//              INNER JOIN web3.users u on (u.user_id = q.caller_id)
//              INNER JOIN web3.users_info ui ON (u.user_id = ui.user_id)
//              LEFT JOIN csr_db.users csr on (csr.id = q.csr_id)
//              WHERE q.id=${newQueue.id}`
//           )
//           .catch((err) => {
//             console.log(err);
//           });

//         const sendQueue = results[0];
//         sendQueue.room_id = roomId;
//         sendQueue.chat_name = chatinfo?.chat_name;
//         msgDetails.queue_no = queueNo;

//         queClients.forEach((queClient) => {
//           if (queClient.readyState === WebSocket.OPEN) {
//             queClient.send(
//               JSON.stringify({
//                 text: JSON.stringify(sendQueue),
//               })
//             );
//           }
//         });
//         chatinfo.current_queue_id = sendQueue.id;
//       }

//       if (chatinfo?.status_code == "1") {
//         const queueNo = await getQueueNo(userId, "CHAT");
//         msgDetails.queue_no = queueNo;
//       }

//       /*SAVE MESSAGE TO DB*/
//       const chatMessage = await db.models.csrchatmessagesModel
//         .create({
//           chat_room_id: roomId,
//           message_from: msgDetails.message_from,
//           queue_id: chatinfo?.current_queue_id,
//           sender_id: msgDetails.sender_id,
//           receiver_id: chatinfo.user_id,
//           message: msgDetails.message,
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//       await db.models.csrchatroomsModel.update(
//         {
//           last_message: msgDetails.message,
//         },
//         { where: { id: roomId } }
//       );

//       roomClients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(
//             JSON.stringify({
//               text: JSON.stringify(msgDetails),
//               sender: msgDetails.sender,
//             })
//           );
//         }
//       });
//     });

//     ws.on("close", () => {
//       const index = roomClients.indexOf(ws);
//       if (index !== -1) {
//         roomClients.splice(index, 1);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

(async () => {
  await db.sequelize.sync();
  await db.sequelize2.sync();
})();

let server;

try {
  server = app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
  });
} catch (error) {
  console.log("ERROR ON LISTENING: ", error);
}
// add route
Routes.map((route) => {
  app.use(route.url, route.pathName);
});
