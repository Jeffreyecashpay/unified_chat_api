module.exports = (seq, dataType, sequelize) => {
	const KycInfoModel = seq.define("call_queues", {
		id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "id",
			unique: true, 
			primaryKey: true,
			allowNull: false,
		},
		caller_id: {
			type: dataType.INTEGER,
			allowNull: false,
			field: "caller_id",
		},
		csr_id: {
			type: dataType.INTEGER,
			allowNull: true,
			field: "csr_id",
		},
		queue_status: {
			type: dataType.STRING,
			allowNull: true,
			defaultValue: "WAITING",
			field: "queue_status",
		},
		date_onqueue: {
			type: dataType.STRING,
			allowNull: true,
			field: "date_onqueue",
		},
		date_end: {
			type: dataType.STRING,
			allowNull: true,
			field: "date_end",
		},
		date_ongoing: {
			type: dataType.STRING,
			allowNull: true,
			field: "date_ongoing",
		},
		duration: {
			type: dataType.STRING,
			allowNull: true,
			defaultValue: "00:00:00",
			field: "duration",
		},
		transaction: {
			type: dataType.STRING,
			allowNull: true,
			field: "transaction",
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