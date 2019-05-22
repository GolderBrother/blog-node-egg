'use strict';

/**
 * user route api
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // 报错 namespace is not a function
    // 配置路由前缀 namespace
    // const userRouter = app.router.namespace('/api');
    const userRouter = app.router;
    const {controller} = app;
    userRouter.post('/getUser', controller.users.getUser);
    userRouter.post('/login', controller.users.login);
    userRouter.post('/userInfo', controller.users.userInfo);
    userRouter.get('/currentUser', controller.users.currentUser);
    userRouter.post('/loginAdmin', controller.users.loginAdmin);
    userRouter.post('/register', controller.users.register);
    userRouter.delete('/delUser', controller.users.delUser);
    userRouter.get('/getUserList', controller.users.getUserList);
    // xxx
}
