require("dotenv").config();
const express = require("express");
const formData = require("express-form-data");
const bodyParser = require("body-parser");
const cors = require("cors");
const Routes = require("./src/routes").routers(); 
const ErrorHandler = require("./src/middleware/error-handler"); 
const AuthJWT = require("./src/middleware/auth_jwt"); 
const db = require("./src/use-cases/model");
// const logger = require("debug")("v2server:");
const Gun = require('gun');
const WebSocket = require('ws');

const app = express();

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
	server = app.listen(8086, "0.0.0.0", () => {
		
	});
} catch (error) {
	console.log("ERROR ON LISTENING: ", error);
}
// Enable Gun.js
app.use(Gun.serve);

// Serve static files (e.g., React Native client)
app.use(express.static('public'));

// Start Gun.js
const gun = Gun({ web: server });
// add route
Routes.map(route => { 
	app.use(route.url, route.pathName);
});
