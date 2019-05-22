const BaseController = require('./base');
class TimeAxisController extends BaseController {
  //获取全部时间轴内容
  async getTimeAxisList() {
    const {
      ctx
    } = this;
    let {
      keyword,
      state,
      pageNum,
      pageSize
    } = ctx.request.query;
    const result = await ctx.service.timeAxis.getTimeAxisList({
      keyword,
      state,
      pageNum,
      pageSize
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 增加内容
  async addTimeAxis() {
    const {ctx} = this;
    let {
      title,
      state,
      content,
      start_time,
      end_time
    } = ctx.request.body;
    const result = await ctx.service.timeAxis.addTimeAxis({
      title,
      state,
      content,
      start_time,
      end_time
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 更新内容
  async updateTimeAxis() {
    const {ctx} = this;
    let {
      id,
      title,
      state,
      content,
      start_time,
      end_time
    } = ctx.request.body;
    const result = await ctx.service.timeAxis.updateTimeAxis({
      id,
      title,
      state,
      content,
      start_time,
      end_time
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 删除内容
  async delTimeAxis() {
    const {ctx} = this;
    let {
      id
    } = ctx.request.body;
    const result = await ctx.service.timeAxis.delTimeAxis(id);
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 详情
  async getTimeAxisDetail() {
    const {
      ctx
    } = this;
    let {
      id
    } = ctx.request.body;
    const result = await ctx.service.timeAxis.getTimeAxisDetail(id);
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

}
module.exports = TimeAxisController;


// export {
//   getTimeAxisList,
//   addTimeAxis,
//   updateTimeAxis,
//   delTimeAxis,
//   getTimeAxisDetail
// }