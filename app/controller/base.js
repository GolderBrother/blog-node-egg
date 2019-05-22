const { Controller } = require('egg');
class BaseController extends Controller {
    // getter函数
    get userInfo() {
        return this.ctx.session.userInfo
    }
    // setter函數
    set userInfo(userInfo) {
        this.ctx.session.userInfo = userInfo;
    }
    responseClient(httpCode = 500, code = 3, message = 'error', data = {}) {
		let responseData = {};
		responseData.code = code;
		responseData.message = message;
		responseData.data = data;
        this.ctx.status = httpCode;
        this.ctx.body = responseData
	}
    error(error) {
        this.ctx.status = 500
        this.ctx.body = {
            code: -1,
            message: error.message || error.toString()
        }
	}
}

module.exports = BaseController;