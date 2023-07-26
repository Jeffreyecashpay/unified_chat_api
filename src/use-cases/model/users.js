module.exports = (seq, dataType, sequelize) => {
	const UserModel = seq.define("users", {
		user_id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "user_id",
			unique: true, 
			primaryKey: true,
			allowNull: false,
		},
		email: {
			type: dataType.STRING,
			field: "email",
			allowNull: false,
		},
		password: {
			type: dataType.STRING,
			field: "password",
			allowNull: false,
		},
		account_status: {
			type: dataType.BOOLEAN,
			defaultValue: true,
			field: "account_status",
			allowNull: false,
		},
		pin: {
			type: dataType.CHAR(6),
			field: "pin",
			allowNull: true,
		},
		kyc1_status: {
			type: dataType.BOOLEAN,
			defaultValue: false,
			field: "kyc1_status",
			allowNull: false,
		},
		kyc2_status: {
			type: dataType.BOOLEAN,
			defaultValue: false,
			field: "kyc2_status",
			allowNull: false,
		},
		createdAt: {
			type: dataType.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
		},
		updatedAt: {
			type: dataType.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
		},
	  }, {
		timestamps: true,
		freezeTableName: true
	});

	return UserModel;
};