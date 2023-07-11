module.exports = (seq, dataType, sequelize) => {
	const KycInfoModel = seq.define("chat_messages", {
		id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "id",
			unique: true, 
			primaryKey: true,
			allowNull: false,
		},
		chat_room_id: {
			type: dataType.INTEGER,
			allowNull: false,
			field: "chat_room_id",
		},
        message_from: {
			type: dataType.INTEGER,
			allowNull: false,
			field: "message_from",
		},
       queue_id: {
			type: dataType.INTEGER,
			allowNull: false,
			field: "queue_id",
		},
		sender_id: {
			type: dataType.STRING,
			allowNull: false,
			field: "sender_id",
		},
		receiver_id: {
			type: dataType.STRING,
			allowNull: true,
			field: "receiver_id",
		},
		message: {
			type: dataType.TEXT,
			allowNull: true,
			field: "message",
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