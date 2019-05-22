const BaseController = require('./base');
class TagsController extends BaseController {
  //获取全部标签
  async getTagList() {
    // console.log('req userInfo: ',req.cookies.userInfo)
    // console.log('req userInfo 2: ', unescape(req.cookies.userInfo));
    const {
      ctx
    } = this;
    let {
      keyword,
      pageNum,
      pageSize
    } = ctx.request.query;
    const result = await ctx.service.tags.getTagList({
      keyword,
      pageNum,
      pageSize
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 增加标签
  async addTag() {
    const {ctx} = this;
    let {
      name,
      desc
    } = ctx.request.body;
    const result = await ctx.service.tags.addTag({
      name,
      desc
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 删除标签
  async delTag() {
    const {ctx} = this;
    let {
      id
    } = ctx.request.body;
    const result = await ctx.service.tags.delTag({
      _id: id
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };
}

module.exports = TagsController;