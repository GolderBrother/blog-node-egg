const BaseController = require('./base');

class CommentsController extends BaseController {
  //获取全部评论
  async getCommentList() {
    let {
      keyword,
      is_handle,
      pageNum,
      pageSize
    } = this.ctx.query;
    const result = await this.ctx.service.comments.getCommentList({
      keyword,
      is_handle,
      pageNum,
      pageSize
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 添加一级评论
  async addComment() {
    const userInfo = this.userInfo;
    const {
      article_id,
      user_id,
      content
    } = this.ctx.request.body;
    const result = await this.ctx.service.comments.addComment({
      userInfo,
      article_id,
      user_id,
      content
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 添加第三者评论
  async addThirdComment() {
    let {
      article_id,
      comment_id,
      user_id,
      content,
      to_user
    } = this.ctx.request.body;
    // let {
    //   userInfo
    // } = req.session;
    const userInfo = this.userInfo;
    const result = await this.ctx.service.comments.addThirdComment({
      userInfo,
      article_id,
      comment_id,
      user_id,
      content,
      to_user
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };


  // 管理一级评论
  async changeComment() {
    // if (!req.session.userInfo) {
    // 	this.responseClient(200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
    // 	return;
    // }
    let {
      id,
      state
    } = this.ctx.request.body;
    const result = await this.ctx.service.comments.updateOne({
      id,
      state
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 管理第三者评论
  async changeThirdComment() {
    // if (!req.session.userInfo) {
    // 	this.responseClient(200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
    // 	return;
    // }
    let {
      id,
      state,
      index
    } = this.ctx.request.body;
    const result = await this.ctx.service.comments.changeThirdComment({
      id,
      state,
      index
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

}
module.exports = CommentsController;