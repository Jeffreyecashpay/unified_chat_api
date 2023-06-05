const UserController = require("../controller/UserController");
const AccountController = require("../controller/AccountController");
const sanitizer = require("../entities/sanitizer");
const express = require("express");  
const AuthJWT = require("../middleware/auth_jwt"); 
const userRoute = express.Router();  

userRoute.route("/register")
	.post(sanitizer.register(), async (req, res) => {
		try {
			const sanitizeError = sanitizer.validationResult(req);
			if (sanitizeError.errors.length > 0) {
				return res.status(400).send(sanitizeError.errors.map((value) => { return { field:value.path, message: value.msg } }));
			}

			const result = await UserController.register(req);
			res.status(200).send({code: 200, data: result.data, mesage: "Successfully Registered!"});

		} catch (error) { 
			res.status(error.code ?? 400).send({message:error.message});
		}
    }
);
userRoute.route("/login")
	.post(sanitizer.login(), async (req, res) => {
		try {
			const sanitizeError = sanitizer.validationResult(req);
			if (sanitizeError.errors.length > 0) {
				return res.status(400).send(sanitizeError.errors.map((value) => { return { field:value.path, message: value.msg } }));
			}

			const result = await UserController.login(req);
           	res.status(200).send({code: 200, data: result.data, mesage: "Successfully Login!"});

		} catch (error) { 
			res.status(error.code ?? 400).send({message:error.message});
		}
    }
);
userRoute.route("/user_info")
	.get(AuthJWT, async (req, res) => {
		try {

			const result = await UserController.userinfo(req);
           	res.status(200).send({code: 200, data: result.data, mesage: "Here is you information!"});

		} catch (error) { 
			res.status(error.code ?? 400).send({message:error.message});
		}
    }
);
userRoute.route("/create_pin")
	.post(AuthJWT, sanitizer.createpin(), async (req, res) => {
		try {
			const sanitizeError = sanitizer.validationResult(req);
			if (sanitizeError.errors.length > 0) {
				return res.status(400).send(sanitizeError.errors.map((value) => { return { field:value.path, message: value.msg } }));
			}

			const result = await UserController.createpin(req);
			res.status(200).send({code: 200, mesage: result});

		} catch (error) { 
			res.status(error.code ?? 400).send({message:error.message});
		}
    }
);
userRoute.route("/verify_pin")
	.post(AuthJWT, sanitizer.verifypin(), async (req, res) => {
		try {
			const sanitizeError = sanitizer.validationResult(req);
			if (sanitizeError.errors.length > 0) {
				return res.status(400).send(sanitizeError.errors.map((value) => { return { field:value.path, message: value.msg } }));
			}

			const result = await UserController.verifypin(req);
           	res.status(200).send({code: 200, mesage: result});

		} catch (error) { 
			res.status(error.code ?? 400).send({message:error.message});
		}
    }
);
userRoute.route("/fetch_accounts")
	.get(AuthJWT, async (req, res) => {
		try { 
			const result = await AccountController.fetchaccounts(req);

			res.status(200).send({code: 200, data: result.data, mesage: "Accounts successfully fetched!"});

		} catch (error) { 
			res.status(error.code ?? 400).send({message:error.message});
		}
    }
);
userRoute.route("/add_account")
	.post(AuthJWT, sanitizer.addaccount(), async (req, res) => {
		try {
			const sanitizeError = sanitizer.validationResult(req);
			if (sanitizeError.errors.length > 0) {
				return res.status(400).send(sanitizeError.errors.map((value) => { return { field:value.path, message: value.msg } }));
			}
			
			const result = await AccountController.addaccount(req);
			res.status(200).send({code: 200, mesage: result.message});

		} catch (error) { 
			res.status(error.code ?? 400).send({message:error.message});
		}
    }
);







module.exports = userRoute;