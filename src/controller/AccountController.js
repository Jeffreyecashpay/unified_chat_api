require("dotenv").config({ path: "../.env" });
const db = require("../use-cases/model");
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const AccountController = {
	fetchaccounts: async (req) => {
		try {
			const { user_id } = req.user;
			const accounts = await db.models.accountModel.findAll({ where: { user_id }});
			if(accounts.length < 1) throw {code: 404, message: "No accounts fetched!"}
			return { data: accounts }
		} catch(error) {
			throw { code: error.code ?? 404, message: error.message };
		}
	},
	addaccount: async (req) => {
		try {
			const { regcode, account_type } = req.body;
			const { user_id } = req.user;
			const accounts = await db.models.accountModel.findOne({ where: { regcode }});
			if(accounts) throw {code: 404, message: "This regcode is already added!"}
			await db.models.accountModel.create({ user_id, regcode, account_type });
			return { message: `${regcode} is successfully added to this account` }
		} catch(error) {
			throw { code: error.code ?? 404, message: error.message };
		}
	},
};

module.exports = AccountController;