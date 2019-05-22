/**
 * Link model module.
 * @file 链接模型
 * @module model/link
 * @author GolderBrother <https://github.com/GolderBrother>
 */

// const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 链接模型
const linkModel = app => {
	const {mongoose} = app;
	const {Schema} = mongoose;
	autoIncrement.initialize(mongoose.connection);
	const LinkSchema = new Schema({
		// 链接名称
		name: { type: String, required: true, validate: /\S+/ },
	
		// 链接描述
		desc: { type: String, default: '' },
	
		// 链接 url
		url: { type: String, required: true, validate: /\S+/, default: '' },
	
		// 图标
		icon: { type: String, default: '' },
	
		// 类型 =>  // 1 :其他友情链接 2: 是博主的个人链接
		type: { type: Number, default: 1 },
	
		// 状态 => 0 不向外展示，1 向外展示，
		state: { type: Number, default: 1 },
	
		// 创建日期
		create_time: { type: Date, default: Date.now },
	
		// 最后修改日期
		update_time: { type: Date, default: Date.now },
	});
	
	// 自增ID插件配置
	LinkSchema.plugin(autoIncrement.plugin, {
		model: 'Link',
		field: 'id',
		startAt: 1,
		incrementBy: 1,
	});
	// 发布链接模型
	return mongoose.model('Link', LinkSchema);
}
module.exports = linkModel;
