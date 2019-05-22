const {
  Service
} = require('egg');
const utils = require('../middleware/utils');
class CategoriesService extends Service {
  //获取全部分类
  async getCategoryList(options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        keyword = null, pageNum, pageSize
      } = options;
      pageNum = parseInt(pageNum) || 1;
      pageSize = parseInt(pageSize) || 10;
      let conditions = {};
      const Category = this.ctx.model.Category;
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
      // const count = await Category.countDocuments
      const count = await new Promise((resolve, reject) => {
        Category.countDocuments({}, (err, count) => {
          if (err) {
            console.error('Error:' + err);
            reject(err);
          } else {
            resolve(count);
          }
        });
      })
      responseData.count = count;
      let fields = {
        name: 1,
        desc: 1,
        create_time: 1
      }; // 待返回的字段
      let _options = {
        skip: skip,
        limit: pageSize,
        sort: {
          create_time: -1
        },
      };
      const result = await new Promise((resolve, reject) => {
        Category.find(conditions, fields, _options, (error, result) => {
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

  //添加分类
  async addCategory(options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        name = '',
          desc = ''
      } = options;
      const Category = this.ctx.model.Category;
      const result = await Category.findOne({
        name
      });
      if (!result) {
        let category = new Category({
          name,
          desc,
        });
        const data = await category.save();
        res["code"] = 0;
        res["message"] = '添加成功';
        res["data"] = data;
      } else {
        res["code"] = 1;
        res["message"] = '该分类已存在';
      }
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  //删除分类
  async delCategory(id = []) {
    let res = {};
    res["httpCode"] = 200;
    try {
      const Category = this.ctx.model.Category;
      const result = await Category.deleteMany({
        _id: id
      });
      if (result.n === 1) {
        res["code"] = 0;
        res["message"] = '操作成功';
      } else {
        res["code"] = 1;
        res["message"] = '分类不存在';
      }
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
}

module.exports = CategoriesService;