const UserController = require("../controller/UserController");
const AccountController = require("../controller/AccountController");
const sanitizer = require("../entities/sanitizer");
const express = require("express");  
const AuthJWT = require("../middleware/auth_jwt"); 
const gunRoute = express.Router();  
const WebSocket = require('ws');

gunRoute.route("/users/:id")
	.get(async (req, res) => {
		try {
			const userId = req.params.id;
		  
			// Create a WebSocket connection to the Gun.js server
			const ws = new WebSocket('ws://localhost:8085');
		  
			ws.on('message', (message) => {
				// Handle incoming WebSocket messages from clients
				console.log('Received message:', message);

				// Process the message and interact with Gun.js or other APIs
			});

			// Handle WebSocket connection close event
			ws.on('close', () => {
				// Cleanup or perform any necessary actions when a connection is closed
			});

		} catch (error) { 
			res.status(error.code ?? 400).send({message:error.message});
		}
    }
);







module.exports = gunRoute;