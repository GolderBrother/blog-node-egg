const BaseController = require('./base');
class LinksController extends BaseController {
	//获取全部链接
	async getLinkList () {
		let {
			keyword,
			type,
			pageNum,
			pageSize
		} = this.ctx.query;
		const result = await this.ctx.service.links.getLinkList({
			keyword,
			type,
			pageNum,
			pageSize
		});
		this.responseClient(result.httpCode, result.code, result.message, result.data);
	};
	// 新增链接
	async addLink () {
		let {
			name,
			desc,
			icon,
			url,
			type
		} = this.ctx.request.body;
		const result = await this.ctx.service.links.addLink({
			name,
			desc,
			icon,
			url,
			type
		});
		this.responseClient(result.httpCode, result.code, result.message, result.data);
	};
	//更新链接
	async updateLink () {
		const {
			state,
			id
		} = this.ctx.request.body;
		const result = await this.ctx.service.links.updateLink({
			state,
			id
		});
		this.responseClient(result.httpCode, result.code, result.message, result.data);
	};
	// 删除链接
	async delLink () {
		let {
			id
		} = this.ctx.request.body;
		const result = await this.ctx.service.links.delLink(id);
		this.responseClient(result.httpCode, result.code, result.message, result.data);
	};

}
module.exports = LinksController;
