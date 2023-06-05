module.exports = (seq, dataType, sequelize) => {
	const UserInfoModel = seq.define("users_info", {
		user_info_id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "user_info_id",
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
		first_name: {
			type: dataType.STRING,
			field: "first_name",
			allowNull: false,
		},
		middle_name: {
			type: dataType.STRING,
			field: "middle_name",
			allowNull: true,
		},
		last_name: {
			type: dataType.STRING,
			field: "last_name",
			allowNull: false,
		},
		address: {
			type: dataType.STRING,
			field: "address",
			allowNull: false,
		},
		mobile_number: {
			type: dataType.STRING,
			field: "mobile_number",
			allowNull: false,
		},
		birth_date: {
			type: dataType.DATEONLY,
			field: "birth_date",
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

	return UserInfoModel;
};