const BaseController = require('./base');
class MessagesController extends BaseController {
	//获取全部留言
	async getMessageList() {
		const {
			ctx
		} = this;
		let {
			keyword,
			state,
			pageNum,
			pageSize
		} = ctx.request.query;
		const result = await ctx.service.messages.getMessageList({
			keyword,
			state,
			pageNum,
			pageSize
		});
		this.responseClient(result.httpCode, result.code, result.message, result.data);
	};

	// 添加留言
	async addMessage() {
		// if (!req.session.userInfo) {
		// 	this.responseClient(200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
		// 	return;
		// }
		const {
			ctx
		} = this;
		let {
			user_id,
			content,
			email,
			phone,
			name
		} = ctx.request.body;
		const result = await ctx.service.messages.addMessage({
			user_id,
			content,
			email,
			phone,
			name
		});
		this.responseClient(result.httpCode, result.code, result.message, result.data);
	};

	// 删除
	async delMessage() {
		const {
			ctx
		} = this
		let {
			id
		} = ctx.request.body;
		const result = await ctx.service.messages.delMessage(id);
		this.responseClient(result.httpCode, result.code, result.message, result.data);
	};

	// 详情
	async getMessageDetail() {
		const {
			ctx,
			userInfo
		} = this;
		let {
			id
		} = ctx.request.body;
		const result = await ctx.service.messages.getMessageDetail({
			userInfo,
			id
		});
		this.responseClient(result.httpCode, result.code, result.message, result.data);
	};

	// 回复留言
	async addReplyMessage() {
		const {
			ctx,
			userInfo
		} = this;
		let {
			id,
			state,
			content
		} = ctx.request.body;
		const result = await MessageService.addReplyMessage({
			id,
			state,
			content,
			userInfo
		});
		this.responseClient(result.httpCode, result.code, result.message, result.data);
	};

}

module.exports = MessagesController;