'use strict';

/**
 * 引入所有的业务模块路由
 * @param {Egg.Application} app - egg application
 */
const router = app => {
    const {
        router,
        controller
    } = app;
    router.get('/', controller.home.index);
    // router.post('/login', controller.users.login);
    require('./router/articles')(app);
    require('./router/categories')(app);
    require('./router/comments')(app);
    require('./router/links')(app);
    require('./router/messages')(app);
    require('./router/projects')(app);
    require('./router/tags')(app);
    require('./router/timeAxis')(app);
    require('./router/user')(app);
}

module.exports = router;