module.exports = (seq, dataType, sequelize) => {
	const KycInfoModel = seq.define("chat_rooms", {
		id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "id",
			unique: true, 
			primaryKey: true,
			allowNull: false,
		},
		user_id: {
			type: dataType.INTEGER,
			allowNull: false,
			field: "user_id",
		},
		customer_id: {
			type: dataType.INTEGER,
			allowNull: false,
			field: "customer_id",
		},
		room_code: {
			type: dataType.STRING,
			allowNull: false,
			field: "room_code",
		},
		chat_name: {
			type: dataType.STRING,
			allowNull: false,
			field: "chat_name",
		},
		createdAt: {
			type: dataType.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
			field: "created_at",
		},
		updatedAt: {
			type: dataType.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
			field: "updated_at",
		},
	  }, {
		timestamps: true,
		freezeTableName: true
	});

	return KycInfoModel;
};