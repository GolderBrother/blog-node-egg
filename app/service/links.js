const {
	Service
} = require('egg');
const utils = require('../middleware/utils');

class LinksService extends Service {
	//获取全部链接
	async getLinkList(options) {
		// 1 :其他友情链接 2: 是博主的个人链接 ,‘’ 代表所有链接
		let res = {};
		res["httpCode"] = 200;
		try {
			let {
				keyword = '', type = '', pageNum = 0, pageSize = 0
			} = options;
			type = Number(type);
			pageNum = parseInt(pageNum) || 1;
			pageSize = parseInt(pageSize) || 10;
			let conditions = {};
			const Link = this.ctx.model.Link;
			if (type) {
				if (keyword) {
					const reg = new RegExp(keyword, 'i');
					conditions = {
						$and: [{
							$or: [{
								type: type
							}]
						}, {
							$or: [{
								name: {
									$regex: reg
								}
							}, {
								desc: {
									$regex: reg
								}
							}]
						}],
					};
				} else {
					conditions = {
						type
					};
				}
			} else {
				if (keyword) {
					const reg = new RegExp(keyword, 'i');
					conditions = {
						$or: [{
							name: {
								$regex: reg
							}
						}, {
							desc: {
								$regex: reg
							}
						}]
					};
				}
			}

			let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
			let responseData = {
				count: 0,
				list: [],
			};
			const count = await new Promise((resolve, reject) => {
				Link.countDocuments(conditions, (err, count) => {
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
				_id: 1,
				name: 1,
				// desc: 1,
				// type: 1,
				url: 1,
				icon: 1,
				// state: 1,
				// create_time: 1,
			};
			let _options = {
				skip: skip,
				limit: pageSize,
				sort: {
					create_time: -1
				},
			};
			const result = await new Promise((resolve, reject) => {
				Link.find(conditions, fields, _options, (error, result) => {
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

	// 添加链接
	async addLink(options) {
		let res = {};
		res["httpCode"] = 200;
		try {
			let {
				name = '',
					desc = '',
					icon = '',
					url = '',
					type = ''
			} = options;
			const Link = this.ctx.model.Link;
			const result = await Link.findOne({
				name
			});
			if (!result) {
				let link = new Link({
					name,
					desc,
					icon,
					url,
					type,
				});
				const data = await link.save();
				res["code"] = 0;
				res["message"] = '添加成功';
				res["data"] = data;
			} else {
				res["code"] = 1;
				res["message"] = '该链接名已存在';
			}
		} catch (error) {
			utils.handleError(res, error);
		}
		return res;
	};

	//更新链接
	async updateLink(options) {
		let res = {};
		res["httpCode"] = 200;
		try {
			const {
				state = '',
					id = ''
			} = options;
			const result = await this.ctx.model.Link.update({
				_id: id
			}, {
				state
			});
			res["code"] = 0;
			res["message"] = '更新成功';
			res["data"] = result;

		} catch (error) {
			utils.handleError(res, error);
		}
		return res;
	};

	//删除链接
	async delLink(id = []) {
		let res = {};
		res["httpCode"] = 200;
		try {
			const result = await this.ctx.model.Link.deleteMany({
				_id: id
			});
			if (result.n === 1) {
				res["code"] = 0;
				res["message"] = '删除成功';
			} else {
				res["code"] = 1;
				res["message"] = '标签不存在';
			}
		} catch (error) {
			utils.handleError(res, error);
		}
		return res;
	};
}

module.exports = LinksService;