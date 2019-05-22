/**
 * Category model module.
 * @file 分类数据模型
 * @module model/category
 * @author GolderBrother <https://github.com/GolderBrother>
 */

// const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 分类集合模型
const categoryModel = app => {
	// 分类集合模型
	const {
		mongoose
	} = app;
	const {
		Schema
	} = mongoose;
	autoIncrement.initialize(mongoose.connection);
	const CategorySchema = new Schema({
		// 分类名称
		name: {
			type: String,
			required: true,
			validate: /\S+/
		},

		// 分类描述
		desc: {
			type: String,
			default: ''
		},

		// 创建日期
		create_time: {
			type: Date,
			default: Date.now
		},

		// 最后修改日期
		update_time: {
			type: Date,
			default: Date.now
		},
	});
	//自增 ID 插件配置
	CategorySchema.plugin(autoIncrement.plugin, {
		model: 'Category',
		field: 'id',
		startAt: 1,
		incrementBy: 1,
	});
	return mongoose.model('Category', CategorySchema);
}

// 分类模型
module.exports = categoryModel;