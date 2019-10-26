const {Service} = require('egg');
const utils = require('../middleware/utils');
class TagsService extends Service {
  //获取全部标签
  async getTagList (options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        keyword = null,
          pageNum = 0,
          pageSize = 0
      } = options;
      pageNum = parseInt(pageNum) || 1;
      pageSize = parseInt(pageSize) || 10;
      let conditions = {};
      const Tag = this.ctx.model.Tag;
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
          }],
        };
      }
      let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
      let responseData = {
        count: 0,
        list: [],
      };
      await Tag.countDocuments(conditions, (error, count) => {
        if (error) {
          console.error('Error:' + error);
          res["httpCode"] = 500;
          res["code"] = 1;
          res["message"] = error.message || error;
        } else {
          responseData.count = count;
          res["code"] = 0;
          res["message"] = '操作成功！';
          res["data"] = responseData;
        }
      });
      let fields = {
        _id: 1,
        name: 1,
        desc: 1,
        // icon: 1,
        create_time: 1,
        // update_time: 1,
      }; // 待返回的字段
      let _options = {
        skip: skip,
        limit: pageSize,
        sort: {
          create_time: -1
        },
      };
      await Tag.find(conditions, fields, _options, (error, result) => {
        if (error) {
          console.error('Error:' + error);
          res["httpCode"] = 500;
          res["code"] = 1;
          res["message"] = error.message || error;
        } else {
          responseData.list = result;
          res["code"] = 0;
          res["message"] = '操作成功！';
          res["data"] = responseData;
        }
      });
    } catch (error) {
      this.handleError(res, error);
    }
    return res;
  };
  
  //添加标签
  async addTag (options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        name = '',
        desc = ''
      } = options;
      const Tag = this.ctx.model.Tag;
      const result = await Tag.findOne({
        name
      });
      if (!result) {
        let tag = new Tag({
          name,
          desc,
        });
        const data = await tag.save();
        res["code"] = 0;
        res["message"] = '添加成功！';
        res["data"] = data;
  
      } else {
        res["code"] = 1;
        res["message"] = '该标签已存在';
      }
    } catch (error) {
      this.handleError(res, error);
    }
    return res;
  };
  
  // 删除标签
  async delTag (id = []) {
    let res = {};
    res["httpCode"] = 200;
    try {
      const result = await this.ctx.model.Tag.deleteMany({
        _id: id
      });
      if (result.n === 1) {
        res["code"] = 0;
        res["message"] = '删除成功!';
      } else {
        res["code"] = 1;
        res["message"] = '标签不存在!';
      }
    } catch (error) {
      this.handleError(res, error);
    }
    return res;
  };
}
module.exports = TagsService;
