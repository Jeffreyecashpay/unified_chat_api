module.exports = (seq, dataType, sequelize) => {
	const KycInfoModel = seq.define("kyc_info", {
		kyc_id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "kyc_id",
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
		kyc_status: {
			type: dataType.BOOLEAN,
			defaultValue: false,
			field: "kyc_status",
			allowNull: false,
		},
		id_type: {
			type: dataType.STRING(45),
			field: "id_type",
			allowNull: false,
		},
		id_number: {
			type: dataType.STRING(45),
			field: "id_number",
			allowNull: false,
		},
		id_liveness: {
			type: dataType.STRING(45),
			field: "id_liveness",
			allowNull: false,
		},
		picture_with_id: {
			type: dataType.STRING(45),
			field: "picture_with_id",
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

	return KycInfoModel;
};