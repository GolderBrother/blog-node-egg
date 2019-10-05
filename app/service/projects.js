const {
  Service
} = require('egg');
const utils = require('../middleware/utils');
class ProjectsService extends Service {
  //获取全部项目内容
  async getProjectList(options) {
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
      const Project = this.ctx.model.Project;
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
      await Project.countDocuments({}, (error, count) => {
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
        title: 1,
        content: 1,
        img: 1,
        url: 1,
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
      await Project.find(conditions, fields, _options, (error, result) => {
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
      utils.handleError(res, error);
    }
    return res;
  };

  async addProject(options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        title = '',
          state = '',
          content = '',
          img = '',
          url = '',
          start_time = null,
          end_time = null
      } = options;
      const Project = this.ctx.model.Project;
      const result = await Project.findOne({
        title
      });
      if (!result) {
        let project = new Project({
          title,
          state,
          content,
          img,
          url,
          start_time,
          end_time,
        });
        const data = await project.save();
        res["code"] = 0;
        res["message"] = '操作成功！';
        res["data"] = data;
      } else {
        res["code"] = 1;
        res["message"] = '该项目内容已存在';
      }
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };

  async updateProject(options) {
    let res = {};
    res["httpCode"] = 200;
    try {
      let {
        id = '',
          title = '',
          state = '',
          content = '',
          img = '',
          url = '',
          start_time = null,
          end_time = null
      } = options;
      const result = await this.ctx.model.Project.updateOne({
        _id: id
      }, {
        title,
        state: Number(state),
        content,
        img,
        url,
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

  async delProject(id = []) {
    let res = {};
    res["httpCode"] = 200;
    try {
      const result = await this.ctx.model.Project.deleteMany({
        _id: id
      });
      if (result.n === 1) {
        res["code"] = 0;
        res["message"] = '操作成功！';
      } else {
        res["code"] = 1;
        res["message"] = '项目内容不存在';
      }
    } catch (error) {
      utils.handleError(res, error);
    }
    return res;
  };

  // 详情
  async getProjectDetail(id = '') {
    let res = {};
    res["httpCode"] = 200;
    try {
      const data = await this.ctx.model.Project.findOne({
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

}
module.exports = ProjectsService;