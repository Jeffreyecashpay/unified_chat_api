require("dotenv").config({ path: "../../.env" });
// require("dotenv").config();
const Sequelize = require("sequelize");
let seq = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	 {
	   host: `${process.env.DB_HOST}`,
	   dialect: 'mysql'
	 }
   );

const db = {};
db.sequelize = seq;
db.models = {};
db.models.userModel = require("./users.js")(seq, Sequelize.DataTypes, Sequelize);
db.models.userInfoModel = require("./users_info.js")(seq, Sequelize.DataTypes, Sequelize);
db.models.kycInfoModel = require("./kyc_info.js")(seq, Sequelize.DataTypes, Sequelize);
db.models.authModel = require("./auth.js")(seq, Sequelize.DataTypes, Sequelize);
db.models.accountModel = require("./accounts.js")(seq, Sequelize.DataTypes, Sequelize);

db.models.userModel.hasOne(db.models.userInfoModel, {
	foreignKey: {
		name: "user_id"
	}
});

db.models.userModel.hasOne(db.models.kycInfoModel, {
	foreignKey: {
		name: "user_id"
	}
});

db.models.userModel.hasOne(db.models.authModel, {
	foreignKey: {
		name: "user_id"
	}
});

db.models.userModel.hasOne(db.models.accountModel, {
	foreignKey: {
		name: "user_id"
	}
});

module.exports = db;