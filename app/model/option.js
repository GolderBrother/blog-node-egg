/**
 * Option model module.
 * @file 设置网站数据模型
 * @module model/option
 * @author GolderBrother <https://github.com/GolderBrother>
 */

// const {
// 	mongoose
// } = require('../core/mongodb.js');

// 网站数据模型
const optionModel = app => {
	const {
		mongoose
	} = app;
	const {
		Schema
	} = mongoose;
	const OptionSchema = new Schema({
		// 网站标题
		title: {
			type: String,
			required: true
		},
		// logo 图片
		logo: {
			type: String,
			required: true
		},
		// 副标题
		sub_title: {
			type: String,
			required: true
		},
		// 关键字
		keywords: [{
			type: String
		}],
		// 网站描述
		description: {
			type: String,
			default: ''
		},
		// 站点地址
		site_url: {
			type: String,
			required: true
		},
		// 站点官邮
		site_email: {
			type: String
		},
		// 网站备案号
		site_icp: {
			type: String
		},
		// 搜索引擎 ping
		ping_sites: [{
			type: String,
			validate: /\S+/
		}],
		// 其他元信息
		meta: [{
			// 被喜欢次数
			like: {
				type: Number,
				default: 0
			}
		}]
	});
	// 发布网站数据模型
	return mongoose.model('Option', OptionSchema);
}

module.exports = optionModel;