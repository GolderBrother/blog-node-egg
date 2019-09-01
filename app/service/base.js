const {
    Service
} = require('egg');
class BaseService extends Service {
    // getter函数
    get userInfo() {
        return this.ctx.session.userInfo
    }
    // setter函數
    set userInfo(userInfo) {
        this.ctx.session.userInfo = userInfo;
    }
}
module.exports = BaseService;