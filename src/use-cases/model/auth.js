module.exports = (seq, dataType, sequelize) => {
	const AuthModel = seq.define("auth_token", {
		auth_id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "auth_id",
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
		auth_string: {
			type: dataType.STRING,
			field: "auth_string",
			allowNull: true,
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

	return AuthModel;
};