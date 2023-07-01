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
		status_code: {
			type: dataType.STRING,
			allowNull: true,
			field: "status_code",
		},
		status_desc: {
			type: dataType.STRING,
			allowNull: true,
			defaultValue: "WAITING",
			field: "status_desc",
		},
		chat_name: {
			type: dataType.STRING,
			allowNull: false,
			field: "chat_name",
		},
		current_queue_id: {
			type: dataType.STRING,
			allowNull: true,
			defaultValue: "WAITING",
			field: "current_queue_id",
		},
		last_message: {
			type: dataType.STRING,
			allowNull: true,
			field: "last_message",
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