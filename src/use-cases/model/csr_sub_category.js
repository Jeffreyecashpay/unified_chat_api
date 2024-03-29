module.exports = (seq, dataType, sequelize) => {
	const SubCategoryModel = seq.define("sub_categories", {
		id: {
			type: dataType.INTEGER,
			autoIncrement: true,
			field: "id",
			unique: true, 
			primaryKey: true,
			allowNull: false,
		},
		category_id: {
			type: dataType.INTEGER,
			allowNull: false,
			references: {
			  model: 'categories',
			  key: 'category_id'
			}
		},
		category: {
			type: dataType.STRING,
			allowNull: true,
			field: "category"
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

	return SubCategoryModel;
};