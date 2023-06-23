require("dotenv").config({ path: "../../.env" });
const Sequelize = require("sequelize");

const seq = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    port: process.env.PORT,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 60000, // 60 seconds
    },
  }
);

const seq2 = new Sequelize(
  process.env.DB_DATABASE_CSR,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    port: process.env.PORT,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 60000, // 60 seconds
    },
  }
);

const db = {};
db.sequelize = seq; // Assign Sequelize instance directly
db.sequelize2 = seq2;
db.models = {};

// Define and associate models for the first database
db.models.userModel = require("./users.js")(seq, Sequelize.DataTypes, Sequelize);
db.models.userInfoModel = require("./users_info.js")(seq, Sequelize.DataTypes, Sequelize);
db.models.kycInfoModel = require("./kyc_info.js")(seq, Sequelize.DataTypes, Sequelize);
db.models.authModel = require("./auth.js")(seq, Sequelize.DataTypes, Sequelize);
db.models.accountModel = require("./accounts.js")(seq, Sequelize.DataTypes, Sequelize);
// Define and associate models for the second database
db.models.csrchatroomsModel = require("./csr_chat_rooms")(seq2, Sequelize.DataTypes, Sequelize);
db.models.csrchatroomsModel = require("./csr_call_queues")(seq2, Sequelize.DataTypes, Sequelize);

// Associate relationships between models
// ...


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
// Synchronize models with the respective databases
// async function syncModels() {
//   try {
//     await db.sequelize.sync(); // Sync models for the first database
//     console.log('Models synchronized with the first database.');

//     await seq2.sync(); // Sync models for the second database
//     console.log('Models synchronized with the second database.');
//   } catch (error) {
//     console.error('Error synchronizing models:', error);
//   }
// }

// // // Call the function to synchronize the models
// syncModels();

module.exports = db;