require("dotenv").config({ path: "../.env" });
const db = require("../use-cases/model");
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const BookController = {

	register: async (req) => {
		try {
			const {email, password, first_name, middle_name, last_name, birth_date, mobile_number, address} = req.body;
			const saltRounds = 10;
			const salt = await bcryptjs.genSalt(saltRounds);
			const hashedpassword = await bcryptjs.hash(password, salt);

			const user = await db.models.userModel.findOne({ where: { email }});
			
			if(user) throw {code: 400, message: "Email is already registered!"};

			const usercreated = await db.models.userModel.create({ email, password:hashedpassword });
			const userinfocreated = await db.models.userInfoModel.create({ user_id: usercreated.user_id, first_name, middle_name, last_name, birth_date, mobile_number, address });
			
			const data = {
				...usercreated.dataValues,
				...userinfocreated.dataValues
			};
			delete data.password;
			delete data.pin;
			delete data.user_info_id;
			delete data.createdAt;
			delete data.updatedAt;
			return { data }
		} catch(error) {
			throw { code: error.code ?? 404, message: error.message };
		}
	},
	login: async (req) => {
		try {
			const {email, password} = req.body;
			const saltRounds = 10;
			const salt = await bcryptjs.genSalt(saltRounds);
			const hashedpassword = await bcryptjs.hash(password, salt);

			const user = await db.models.userModel.findOne({ where: { email }});
			
			if(!user) throw {code: 404, message: "User not found!"};

			if(!(await bcryptjs.compare(password, user.password))) throw {code: 404, message: "Incorrect Password!"}
			const toenc = {
				user_id: user.user_id,
				email: user.email,
			}
			const token = await jwt.sign(toenc, process.env.JWT_TOKEN, { expiresIn: '24h' });
			const authtoken = await db.models.authModel.findOne({ where: { user_id: user.user_id}});
			if(!authtoken) {
				await db.models.authModel.create({
					user_id: user.user_id,
					auth_string: token
				});
			} else {
				await db.models.authModel.update({
					auth_string: token
				}, {
					where: { user_id: user.user_id,}
				});
			}
			const data = {
				...user.dataValues,
				hasPin: user.pin ? true : false,
				token
			};
			delete data.account_status;
			delete data.password;
			delete data.email;
			delete data.pin;
			delete data.user_info_id;
			delete data.createdAt;
			delete data.updatedAt;
			return { data }
		} catch(error) {
			throw { code: error.code ?? 404, message: error.message };
		}
	},
	userinfo: async (req) => {
		try {
			const { user_id } = req.user;

			const user = await db.models.userModel.findOne({ where: { user_id }});
			if(!user) throw {code: 404, message: "User not found!"};
			const userinfo = await db.models.userInfoModel.findOne({ where: { user_id }});
			if(!userinfo) throw {code: 404, message: "User information not found!"};
			
			const data = {
				...user.dataValues,
				...userinfo.dataValues,
			};
			
			delete data.user_id;
			delete data.account_status;
			delete data.password;
			delete data.pin;
			delete data.user_info_id;
			delete data.createdAt;
			delete data.updatedAt;
			return { data }
		} catch(error) {
			throw { code: error.code ?? 404, message: error.message };
		}
	},
	createpin: async (req) => {
		try {
			const {pin} = req.body;
			const {user_id} = req.user;

			if(!pin) throw {code: 400, message: "Invalid pin!"}
			if(pin.length != 6) throw {code: 400, message: "Invalid pin!"}
			
			await db.models.userModel.update({ pin },{ where: { user_id } });

			return "Successfully created!";
		} catch(error) {
			throw { code: error.code ?? 404, message: error.message };
		}
	},
	verifypin: async (req) => {
		try {
			const { pin } = req.body;
			const { user_id } = req.user;

			if(!pin) throw {code: 401, message: "Invalid pin!"}
			if(pin.length != 6) throw {code: 401, message: "Invalid pin!"}
			const user = await db.models.userModel.findOne({ where: { user_id } });

			if(!user) throw {code: 404, message: "User not found!"};
			if(pin != user.pin) throw {code: 401, message: "Invalid pin!"};
			return "Successfully authenticated!";
		} catch(error) {
			throw { code: error.code ?? 404, message: error.message };
		}
	},
};

module.exports = BookController;