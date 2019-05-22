const BaseController = require("./base");

class CategoriesController extends BaseController {
  //获取全部分类
  async getCategoryList() {
    let {
      keyword,
      pageNum,
      pageSize
    } = this.ctx.query;
    const result = await this.ctx.service.categories.getCategoryList({
      keyword,
      pageNum,
      pageSize
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };
  //添加分类
  async addCategory() {
    const {
      name,
      desc
    } = this.ctx.request.body;
    const result = await this.ctx.service.categories.addCategory({
      name,
      desc
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };
  // 删除分类
  async delCategory() {
    let {
      id
    } = this.ctx.request.body;
    const result = await this.ctx.service.categories.delCategory(id);
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

}
module.exports = CategoriesController;