const {Service} = require('egg');
const utils = require('../middleware/utils');
class TimeAxisService extends Service {
  //获取全部时间轴内容
  async getTimeAxisList (options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        keyword = null,
          state = '',
          pageNum = 0,
          pageSize = 0
      } = options;
      pageNum = parseInt(pageNum) || 1;
      pageSize = parseInt(pageSize) || 10;
      let conditions = {};
      const TimeAxis = this.ctx.model.TimeAxis;
      if (!state) {
        if (keyword) {
          const reg = new RegExp(keyword, 'i'); //不区分大小写
          conditions = {
            $or: [{
              title: {
                $regex: reg
              }
            }, {
              content: {
                $regex: reg
              }
            }],
          };
        }
      } else if (state) {
        state = parseInt(state);
        if (keyword) {
          const reg = new RegExp(keyword, 'i');
          conditions = {
            $and: [{
                $or: [{
                  state: state
                }]
              },
              {
                $or: [{
                  title: {
                    $regex: reg
                  }
                }, {
                  content: {
                    $regex: reg
                  }
                }]
              },
            ],
          };
        } else {
          conditions = {
            state
          };
        }
      }
  
      let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
      let responseData = {
        count: 0,
        list: [],
      };
      await TimeAxis.countDocuments({}, (error, count) => {
        if (error) {
          console.error('Error:' + error);
          res["httpCode"] = 500;
          res["code"] = 1;
          res["message"] = error.message || error;
        } else {
          responseData.count = count;
        }
      });
      let fields = {
        title: 1,
        content: 1,
        state: 1,
        start_time: 1,
        end_time: 1,
        // update_time: 1,
      }; // 待返回的字段
      let _options = {
        skip: skip,
        limit: pageSize,
        sort: {
          end_time: -1
        },
      };
      await TimeAxis.find(conditions, fields, _options, (error, result) => {
        if (error) {
          console.error('Error:' + error);
          res["httpCode"] = 500;
          res["code"] = 1;
          res["message"] = error.message || error;
          // throw error;
        } else {
          responseData.list = result;
          res["code"] = 0;
          res["message"] = '操作成功！';
          res["data"] = responseData;
        }
      });
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  
  // 增加内容
  async addTimeAxis (options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        title = '',
        state = '',
        content = '',
        start_time = null,
        end_time = null
      } = options;
      const TimeAxis = this.ctx.model.TimeAxis;
      const result = await TimeAxis.findOne({
        title,
      });
      if (!result) {
        let timeAxis = new TimeAxis({
          title,
          state,
          content,
          start_time,
          end_time,
        });
        const data = await timeAxis.save();
        res["code"] = 0;
        res["message"] = '操作成功！';
        res["data"] = data;
      } else {
        res["httpCode"] = 200;
        res["code"] = 1;
        res["message"] = '该时间轴内容已存在';
      }
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  
  // 更新内容
  async updateTimeAxis (options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        id='',
        title='',
        state='',
        content='',
        start_time = null,
        end_time = null
      } = options;
      const TimeAxis = this.ctx.model.TimeAxis;
      const result = await TimeAxis.updateOne({
        _id: id
      }, {
        title,
        state: Number(state),
        content,
        start_time,
        end_time,
        update_time: new Date(),
      });
      res["code"] = 0;
      res["message"] = '操作成功！';
      res["data"] = result;
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  
  // 删除内容
  async delTimeAxis (id = []) {
    let res = {};
    res["httpCode"] = 200;
    try {
      const TimeAxis = this.ctx.model.TimeAxis;
      const result = await TimeAxis.deleteMany({
        _id: id
      });
      if (result.n === 1) {
        res["code"] = 0;
        res["message"] = '操作成功！';
        res["data"] = result;
      } else {
        res["httpCode"] = 200;
        res["code"] = 1;
        res["message"] = '时间轴内容不存在';
      }
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  
  // 详情
  async getTimeAxisDetail (id = '') {
    let res = {};
    res["httpCode"] = 200;
    try {
      const TimeAxis = this.ctx.model.TimeAxis;
      const data = await TimeAxis.findOne({
        _id: id
      });
      res["code"] = 0;
      res["message"] = '操作成功！';
      res["data"] = data;
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };
  
  // export {
  //   getTimeAxisList,
  //   addTimeAxis,
  //   updateTimeAxis,
  //   delTimeAxis,
  //   getTimeAxisDetail
  // }

}
module.exports = TimeAxisService;