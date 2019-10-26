const utils = require('../middleware/utils');
// import Comment from '../models/comment';
// import User from '../models/user';
// import Article from '../models/article';
const { Service } = require('egg');
class CommentsService extends Service {
  //获取全部评论
  async getCommentList (options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        keyword = null, is_handle, pageNum, pageSize
      } = options;
      is_handle = parseInt(is_handle) || 0;
      pageNum = parseInt(pageNum) || 1;
      pageSize = parseInt(pageSize) || 10;
  
      let conditions = {};
      const Comment = this.ctx.model.Comment;
      if (keyword) {
        const reg = new RegExp(keyword, 'i'); //不区分大小写
        if (is_handle) {
          conditions = {
            content: {
              $regex: reg
            },
            is_handle,
          };
        } else {
          conditions = {
            content: {
              $regex: reg
            },
          };
        }
      }
      if (is_handle) {
        conditions = {
          is_handle,
        };
      }
  
      let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
      let responseData = {
        count: 0,
        list: [],
      };
      const count = await new Promise((resolve, reject) => {
        Comment.countDocuments({}, (err, count) => {
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
        article_id: 1,
        content: 1,
        is_top: 1,
        likes: 1,
        user_id: 1,
        user: 1,
        other_comments: 1,
        state: 1,
        is_handle: 1,
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
        Comment.find(conditions, fields, _options, (error, result) => {
          if (err) {
            console.error('Error:' + error);
            reject(error);
            // res["code"] = 1;
            // res["message"] = errors.message || errors;
          } else {
            resolve(result);
          }
        });
      });
      responseData.list = result;
      res["code"] = 0;
      res["message"] = '操作成功！';
      res["data"] = responseData;
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  
  // 添加一级评论
  async addComment (options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        userInfo,
        article_id = '',
        user_id = '',
        content = ''
      } = options;
      if (!userInfo) {
        res["code"] = 1;
        res["message"] = '或者登录信息已过期，请重新登录！';
        return res;
      }
      const result = await this.ctx.model.User.findById({
        _id: user_id
      });
      // console.log('result :', result);
      if (result) {
        let userInfo = {
          user_id: result._id,
          name: result.name,
          type: result.type,
          avatar: result.avatar,
        };
        const Comment = this.ctx.model.Comment;
        // let comment = new (this.ctx.model.Comment)({
        let comment = new Comment({
          article_id: article_id,
          content: content,
          user_id: user_id,
          user: userInfo,
        });
        const commentResult = await comment.save();
        const data = await new Promise((resolve, reject) => {
          this.ctx.model.Article.findOne({
            _id: article_id
          }, (errors, data) => {
            if (errors) {
              // res["code"] = 1;
              // res["message"] = errors.message || errors;
              reject(errors);
            } else {
              data.comments.push(commentResult._id);
              data.meta.comments = data.meta.comments + 1;
              resolve(data);
            }
          });
        });
        const _result = await this.ctx.model.Article.updateOne({
          _id: article_id
        }, {
          comments: data.comments,
          meta: data.meta,
          is_handle: 0
        }, );
        res["code"] = 0;
        res["message"] = '评论成功！';
        res["data"] = commentResult;
      } else {
        res["code"] = 1;
        res["message"] = '用户不存在';
      }
    } catch (error) {
      console.error('Error:' + error);
      utils.handleError(res, error);
    }
    return res;
  };
  
  // 添加第三者评论
  async addThirdComment (options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        article_id = '',
          comment_id = '',
          user_id = '',
          content,
          to_user = {},
          userInfo
      } = options;
      if (!userInfo) {
        res["code"] = 1;
        res["message"] = '您还没登录,或者登录信息已过期，请重新登录！';
        return res;
      }
      const Comment = this.ctx.model.Comment;
      const commentResult = await Comment.findById({
        _id: comment_id,
      });
      const userResult = await this.ctx.model.User.findById({
        _id: user_id,
      });
      if (userResult) {
        let userInfo = {
          user_id: userResult._id,
          name: userResult.name,
          type: userResult.type,
          avatar: userResult.avatar,
        };
        let item = {
          user: userInfo,
          content: content,
          to_user: JSON.parse(to_user),
        };
        commentResult.other_comments.push(item);
        const result = await Comment.updateOne({
          _id: comment_id
        }, {
          other_comments: commentResult.other_comments,
          is_handle: 2,
        }, );
        // responseClient(res, 200, 0, '操作成功', result);
        const data = await new Promise((resolve, reject) => {
          this.ctx.model.Article.findOne({
            _id: article_id
          }, (errors, data) => {
            if (errors) {
              console.error('Error:' + errors);
              reject(errors);
              // throw errors;
            } else {
              data.meta.comments = data.meta.comments + 1;
              resolve(data);
            }
          });
        });
        const Articleresult = await this.ctx.model.Article.updateOne({
          _id: article_id
        }, {
          meta: data.meta
        });
        res["code"] = 0;
        res["message"] = '评论成功！';
        res["data"] = Articleresult;
      } else {
        res["code"] = 1;
        res["message"] = '用户不存在';
      }
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  
  // 管理一级评论
  async changeComment (options) {
    // if (!req.session.userInfo) {
    // 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
    // 	return;
    // }
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        id = '',
          state = ''
      } = options;
      const Comment = this.ctx.model.Comment;
      const result = await Comment.updateOne({
        _id: id
      }, {
        state: Number(state),
        is_handle: 1,
      }, );
      res["code"] = 0;
      res["message"] = '操作成功';
      res["data"] = result;
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  
  // 管理第三者评论
  async changeThirdComment (options) {
    // if (!req.session.userInfo) {
    // 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
    // 	return;
    // }
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        id = '',
          state = '',
          index = ''
      } = options;
      const commentResult = await Comment.findById({
        _id: id,
      });
      let i = index ? Number(index) : 0;
      if (commentResult.other_comments.length) {
        commentResult.other_comments[i].state = Number(state);
        const result = await Comment.updateOne({
          _id: id
        }, {
          other_comments: commentResult.other_comments,
          is_handle: 1,
        }, );
        res["code"] = 0;
        res["message"] = '操作成功';
        res["data"] = result;
      } else {
        res["code"] = 1;
        res["message"] = '第三方评论不存在！';
        res["data"] = commentResult;
      }
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  
}
module.exports = CommentsService;
