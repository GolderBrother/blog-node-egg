const Controller = require('egg').Controller;
class HomeController extends Controller {
    async index() {
        this.ctx.body = 'Hello eggjs!666123'
    }
}

module.exports = HomeController;
