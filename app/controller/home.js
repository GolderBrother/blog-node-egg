const Controller = require('egg').Controller;
class HomeController extends Controller {
    async index() {
        this.ctx.body = 'Hello eggjs!123456'
    }
}

module.exports = HomeController;
