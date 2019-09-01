const BaseController = require("./base");
class UsersController extends BaseController {
    async getUser() {
        const {
            ctx
        } = this;
        try {
            const {
                email,
                password
            } = ctx.request.body;
            const result = await ctx.service.users.getUser({
                email,
                password
            });
            const {
                httpCode = 500, code = 3, message = '', data = {}
            } = result;
            this.responseClient(httpCode, code, message, data);
        } catch (error) {
            this.responseClient(500, -1, error.message || error);
        }
    }

    async login() {
        try {
            const {
                ctx
            } = this;
            let {
                email,
                password
            } = ctx.request.body;
            const result = await ctx.service.users.login({
                email,
                password
            });
            const {
                httpCode = 500, code = 3, message = '', data = {}
            } = result;
            this.responseClient(httpCode, code, message, data);
        } catch (error) {
            this.responseClient(500, -1, error.message || error);
        }
    }

    async currentUser() {
        try {
            let {
                ctx,
                userInfo
            } = this;
            let {
                httpCode = 500, code = 3, message = '', data = {}
            } = await ctx.service.users.currentUser(userInfo);
            this.responseClient(httpCode, code, message, data);
        } catch (error) {
            this.responseClient(500, -1, error.message || error);
        }
    };

    async userInfo() {
        const {
            ctx,
            userInfo
        } = this;
        const {
            httpCode = 500, code = 3, message = '', data = {}
        } = await ctx.service.users.userInfo(userInfo);
        this.responseClient(httpCode, code, message, data);
    };

    async loginAdmin() {
        try {
            const {
                ctx
            } = this;
            let {
                username,
                password
            } = ctx.request.body;
            const result = await ctx.service.users.loginAdmin({
                username,
                password
            });
            this.responseClient(result.httpCode, result.code, result.message);
        } catch (error) {
            this.responseClient(500, -1, error.message || error);
        }
    };

    async register() {
        try {
            const {
                ctx
            } = this;
            let {
                name,
                password,
                phone,
                email,
                introduce,
                type
            } = ctx.request.body;
            const result = await ctx.service.users.register({
                name,
                password,
                phone,
                email,
                introduce,
                type
            });
            this.responseClient(result.httpCode, result.code, result.message);
        } catch (error) {
            this.responseClient(500, -1, error.message || error);
        }
    };

    async delUser() {
        try {
            const {
                ctx
            } = this;
            let {
                id
            } = ctx.request.body;
            const result = await ctx.service.users.delUser(id);
            this.responseClient(result.httpCode, result.code, result.message);
        } catch (error) {
            this.responseClient(500, -1, error.message || error);
        }
    };

    async getUserList() {
        try {
            const {
                ctx
            } = this;
            let type = ctx.query.type || '';
            let keyword = ctx.query.keyword || '';
            let pageNum = parseInt(ctx.query.pageNum) || 1;
            let pageSize = parseInt(ctx.query.pageSize) || 10;
            const result = await ctx.service.users.getUserList({
                type,
                keyword,
                pageNum,
                pageSize
            });
            this.responseClient(result.httpCode, result.code, result.message, result.data);
        } catch (error) {
            this.responseClient(500, -1, error.message || error);
        }
    };


}

module.exports = UsersController;