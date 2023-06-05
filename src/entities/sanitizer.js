const { param, body, validationResult } = require("express-validator");

module.exports = { 
	register: () => {
		return [
			body("email").notEmpty().withMessage("This field is required").bail().isEmail().withMessage('Not a valid email'),
			body("password").notEmpty().withMessage("This field is required"),
			body("first_name").notEmpty().withMessage("This field is required"),
			body("last_name").notEmpty().withMessage("This field is required"),
			body("birth_date").notEmpty().withMessage("This field is required"),
			body("mobile_number").notEmpty().withMessage("This field is required"),
			body("address").notEmpty().withMessage("This field is required"),
		];
	},
	login: () => {
		return [
			body("email").notEmpty().withMessage("This field is required").bail().isEmail().withMessage('Not a valid email'),
			body("password").notEmpty().withMessage("This field is required"),
		];
	},
	createpin: () => {
		return [
			body("pin").notEmpty().withMessage("This field is required"),
		];
	},
	verifypin: () => {
		return [
			body("pin").notEmpty().withMessage("This field is required"),
		];
	},
	addaccount: () => {
		return [
			body("regcode").notEmpty().withMessage("This field is required"),
			body("account_type").notEmpty().withMessage("This field is required"),
		];
	},
	validationResult 
};