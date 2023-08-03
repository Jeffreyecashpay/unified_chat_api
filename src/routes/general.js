const GeneralController = require("../controller/GeneralController");
const sanitizer = require("../entities/sanitizer");
const express = require("express");  
const AuthJWT = require("../middleware/auth_jwt"); 
const generalRoute = express.Router();  

generalRoute.route("/fetch_categories")
	.post(AuthJWT, async (req, res) => {
		try {
			// const sanitizeError = sanitizer.validationResult(req);
			// if (sanitizeError.errors.length > 0) {
			// 	return res.status(400).send(sanitizeError.errors.map((value) => { return { field:value.path, message: value.msg } }));
			// }

			const result = await GeneralController.fetchcategory(req);

			res.status(200).send({code: 200, data: result.data, mesage: "Categories Fetched!"});

		} catch (error) { 
			res.status(error.code ?? 400).send({message:error.message});
		}
    }
);





module.exports = generalRoute;