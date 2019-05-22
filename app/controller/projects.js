const BaseController = require("./base");

class ProjectsController extends BaseController {
  //获取全部项目内容
  async getProjectList() {
    let { keyword, state, pageNum, pageSize } = this.ctx.query;
    const result = await this.ctx.service.projects.getProjectList({
      keyword,
      state,
      pageNum,
      pageSize
    });
    this.responseClient(
      result.httpCode,
      result.code,
      result.message,
      result.data
    );
  }

  async addProject() {
    let {
      title,
      state,
      content,
      img,
      url,
      start_time,
      end_time
    } = this.ctx.request.body;
    const result = await this.ctx.service.projects.addProject({
      title,
      state,
      content,
      img,
      url,
      start_time,
      end_time
    });
    this.responseClient(
      result.httpCode,
      result.code,
      result.message,
      result.data
    );
  }

  async updateProject() {
    let {
      id,
      title,
      state,
      content,
      img,
      url,
      start_time,
      end_time
    } = this.ctx.request.body;
    const result = await this.ctx.service.projects.updateProject({
      id,
      title,
      state,
      content,
      img,
      url,
      start_time,
      end_time
    });
    this.responseClient(
      result.httpCode,
      result.code,
      result.message,
      result.data
    );
  }

  async delProject() {
    let { id } = this.ctx.request.body;
    const result = await this.ctx.service.projects.delProject(id);
    this.responseClient(
      result.httpCode,
      result.code,
      result.message,
      result.data
    );
  }

  // 详情
  async getProjectDetail() {
    let { id } = this.ctx.request.body;
    const result = await this.ctx.service.projects.getProjectDetail(id);
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  }
}

module.exports = ProjectsController;
