/**
 * Tag model module.
 * @file 标签数据模型
 * @module model/tag
 * @author GolderBrother <https://github.com/GolderBrother>
 */

// const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 标签模型
const tagModel = app => {
	const {mongoose} = app;
	const {Schema} = mongoose;
	autoIncrement.initialize(mongoose.connection);
	const TagSchema = new Schema({
		// 标签名称
		name: {
			type: String,
			required: true,
			validate: /\S+/
		},
		// 标签描述 
		desc: {
			type: String,
			default: ''
		},
		// 图标
		icon: {
			type: String,
			default: ''
		},
		// 发布日期
		create_time: {
			type: Date,
			default: Date.now
		},
		// 最后修改日期
		update_time: {
			type: Date,
			default: Date.now
		}
	});
	
	// 自增ID插件配置
	TagSchema.plugin(autoIncrement.plugin, {
		model: 'Tag',
		field: 'id',
		startAt: 1,
		incrementBy: 1,
	});
	return mongoose.model('Tag', TagSchema);
}
module.exports = tagModel;
