require("dotenv").config({ path: "../.env" });
const db = require("../use-cases/model");
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const GeneralController = {
	fetchcategory: async (req) => {
		try {
			const accounts = await db.models.csrcategoryModel.findAll({
				attributes: [
					["id", "category_id"], 
					["category", "category_name"]
				], 
				include: [{
					model: db.models.csrsubcategoryModel,
					as: "subcategories",
					attributes: [
						["id", "sub_category_id"], 
						["category", "sub_category_name"]
					],},
				]
			}
			);
			if(accounts.length < 1) throw {code: 404, message: "No accounts fetched!"}
			return { data: accounts }
		} catch(error) {
			throw { code: error.code ?? 404, message: error.message };
		}
	},
};

module.exports = GeneralController;