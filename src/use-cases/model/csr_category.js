module.exports = (seq, dataType, sequelize) => {
	const CategoryModel = seq.define("categories", {
		id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "id",
			unique: true, 
			primaryKey: true,
			allowNull: false,
		},
		category: {
			type: dataType.STRING,
			field: "category",
			allowNull: false,
		},
		createdAt: {
			type: dataType.DATE,
			field: "created_at",
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
		},
		updatedAt: {
			type: dataType.DATE,
			field: "updated_at",
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
		},
	  }, {
		timestamps: true,
		freezeTableName: true
	});

	return CategoryModel;
};