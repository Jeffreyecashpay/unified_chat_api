module.exports = (seq, dataType, sequelize) => {
	const AccountModel = seq.define("accounts", {
		account_id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "account_id",
			unique: true, 
			primaryKey: true,
			allowNull: false,
		},
		user_id: {
			type: dataType.INTEGER,
			allowNull: false,
			references: {
			  model: 'users',
			  key: 'user_id'
			}
		},
		status: {
			type: dataType.BOOLEAN,
			defaultValue: true,
			field: "status",
			allowNull: false,
		},
		regcode: {
			type: dataType.STRING(45),
			field: "regcode",
			allowNull: false,
		},
		account_type: {
			type: dataType.STRING(45),
			field: "account_type",
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

	return AccountModel;
};