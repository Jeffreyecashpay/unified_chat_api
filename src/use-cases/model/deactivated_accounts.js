module.exports = (seq, dataType, sequelize) => {
	const UserModel = seq.define("deactivated_account", {
		user_info_id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "deactivated_id",
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
		reason: {
			type: dataType.STRING,
			field: "reason",
			allowNull: false,
		},
		status: {
			type: dataType.BOOLEAN,
			field: "status",
			defaultValue: true,
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