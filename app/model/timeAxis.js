/**
 * TimeAxis model module.
 * @file 时间轴模型
 * @module model/timeAxis
 * @author GolderBrother <https://github.com/GolderBrother>
 */

// const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');

// 时间轴模型
const timeAxisModel = app => {
	const {mongoose} = app;
	const {Schema} = mongoose;
	// 解决重复键的问题：E11000 duplicate key error collection
	autoIncrement.initialize(mongoose.connection);
	const TimeAxisSchema = new Schema({
		// 标题
		title: {
			type: String,
			required: true
		},
		// 时间轴内容
		content: {
			type: String,
			required: true
		},
		// 状态 1 是已经完成 ，2 是正在进行，3 是没完成
		state: {
			type: Number,
			default: 1
		},
		// 开始日期
		start_time: {
			type: Date,
			default: Date.now
		},
		// 结束日期
		end_time: {
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
	// 解决重复键的问题：E11000 duplicate key error collection
	TimeAxisSchema.plugin(autoIncrement.plugin, {
		model: 'TimeAxis',
		field: 'id',
		startAt: 1,
		incrementBy: 1,
	});
	return mongoose.model('TimeAxis', TimeAxisSchema);
}
module.exports = timeAxisModel;
