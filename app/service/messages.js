const {
	Service
} = require('egg');
const utils = require('../middleware/utils');
class MessagesService extends Service {
	//获取全部留言
	async getMessageList(options) {
		let res = {};
		res["httpCode"] = 200;
		try {
			let {
				keyword = null, state = '', pageNum = 0, pageSize = 0
			} = options;
			pageNum = parseInt(pageNum) || 1;
			pageSize = parseInt(pageSize) || 10;
			let conditions = {};
			const Message = this.ctx.model.Message;
			if (state === '') {
				if (keyword) {
					const reg = new RegExp(keyword, 'i'); //不区分大小写
					conditions = {
						content: {
							$regex: reg
						},
					};
				}
			} else if (state) {
				state = parseInt(state);
				if (keyword) {
					const reg = new RegExp(keyword, 'i');
					conditions = {
						$and: [{
							$or: [{
								state: state
							}]
						}, {
							$or: [{
								content: {
									$regex: reg
								}
							}]
						}]
					};
				} else {
					conditions = {
						state
					};
				}
			} else {
				state = 0;
				if (keyword) {
					const reg = new RegExp(keyword, 'i');
					conditions = {
						$and: [{
							$or: [{
								state: state
							}]
						}, {
							$or: [{
								content: {
									$regex: reg
								}
							}]
						}]
					};
				} else {
					conditions = {
						state
					};
				}
			}

			let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
			let responseData = {
				count: 0,
				list: [],
			};
			const count = await new Promise((resolve, reject) => {
				Message.countDocuments({}, (err, count) => {
					if (err) {
						console.error('Error:' + err);
						reject(err);
					} else {
						resolve(count);
					}
				});
			});
			responseData.count = count;
			// 待返回的字段
			let fields = {
				user_id: 1,
				name: 1,
				avatar: 1,
				phone: 1,
				introduce: 1,
				content: 1,
				email: 1,
				state: 1,
				reply_list: 1,
				create_time: 1,
				// update_time: 1,
			};
			let _options = {
				skip: skip,
				limit: pageSize,
				sort: {
					create_time: -1
				},
			};
			const result = await new Promise((resolve, reject) => {
				Message.find(conditions, fields, _options, (error, result) => {
					if (error) {
						console.error('Error:' + error);
						reject(error);
					} else {
						resolve(result);
					}
				});
			});
			responseData.list = result;
			res["code"] = 0;
			res["message"] = 'success';
			res["data"] = responseData;
		} catch (error) {
			utils.handleError(res, error);
		}
		return res;
	};

	// 添加留言
	async addMessage(options) {
		// if (!req.session.userInfo) {
		// 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
		// 	return;
		// }
		let res = {};
		res["httpCode"] = 200;
		try {
			let {
				user_id = '',
				content = '',
				email = '',
				phone = '',
				name = ''
			} = options;
			const Message = this.ctx.model.Message;
			// 如果用户已经注册的，保存用户的信息，再保存留言内容
			if (user_id) {
				const result = await this.ctx.model.User.findById({
					_id: user_id
				});
				if (result) {
					let message = new Message({
						user_id: result._id,
						name: name ? name : result.name,
						avatar: result.avatar,
						phone: result.phone,
						introduce: result.introduce,
						content: content,
						email: email ? email : result.email,
					});
					const data = await message.save();
					res["code"] = 0;
					res["message"] = '添加成功';
					res["data"] = data;
				} else {
					console.log('新用户');
				}
			} else {
				// 直接保存留言内容
				let message = new Message({
					name: name,
					phone: phone,
					content: content,
					email: email,
				});
				const data = message.save();
				res["code"] = 0;
				res["message"] = '添加成功';
				res["data"] = data;
			}
		} catch (error) {
			utils.handleError(res, error);
		}
		return res;
	};

	// 删除
	async delMessage(id = []) {
		let res = {};
		res["httpCode"] = 200;
		try {
			const result = await (this.ctx.model.Message).deleteMany({
				_id: id
			});
			if (result.n === 1) {
				res["code"] = 0;
				res["message"] = '删除成功';
			} else {
				res["code"] = 1;
				res["message"] = '留言不存在或者已经删除！';
			};
		} catch (error) {
			utils.handleError(res, error);
		}
		return res;
	};

	// 详情
	async getMessageDetail(options) {
		let res = {};
		res["httpCode"] = 200;
		try {
			const {
				userInfo = '',
					id = ''
			} = options;
			if (!userInfo) {
				res["code"] = 1;
				res["message"] = '您还没登录,或者登录信息已过期，请重新登录！';
				return res;
			};
			const data = await this.ctx.model.Message.findOne({
				_id: id
			});
			res["code"] = 0;
			res["message"] = '操作成功！';
			res["data"] = data;
		} catch (error) {
			utils.handleError(res, error);
		}
		return res;
	};

	// 回复留言
	async addReplyMessage(options) {
		try {
			const {
				id = '',
					state = '',
					content = '',
					userInfo = ''
			} = options;
			const Message = this.ctx.model.Message;
			if (!userInfo) {
				res["code"] = 1;
				res["message"] = '您还没登录,或者登录信息已过期，请重新登录！';
				return res;
			}
			const result = await Message.findById({
				_id: id
			});
			let list = result.reply_list;
			let item = {
				content: content,
			};
			list.push(item);
			const data = await Message.update({
				_id: id
			}, {
				state: parseInt(state),
				reply_list: list,
			});
			res["code"] = 0;
			res["message"] = '操作成功！';
			res["data"] = data;
		} catch (error) {
			utils.handleError(res, error);
		}
		return res;
	};

}
module.exports = MessagesService;