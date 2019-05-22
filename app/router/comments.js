'use strict';

/**
 * comments route api
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // 报错 namespace is not a function
    // 配置路由前缀 namespace
    // const userRouter = app.router.namespace('/api');
    const commentsRouter = app.router;
    const {
        controller
    } = app;
    commentsRouter.get('/getCommentList', controller.comments.getCommentList);
    commentsRouter.post('/addComment', controller.comments.addComment);
    commentsRouter.post('/addThirdComment', controller.comments.addThirdComment);
    commentsRouter.put('/changeComment', controller.comments.changeComment);
    commentsRouter.put('/changeThirdComment', controller.comments.changeThirdComment);
}