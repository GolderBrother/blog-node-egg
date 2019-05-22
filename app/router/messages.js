'use strict';

/**
 * messages route api
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // 报错 namespace is not a function
    // 配置路由前缀 namespace
    // const userRouter = app.router.namespace('/api');
    const messagesRouter = app.router;
    const {
        controller
    } = app;
    messagesRouter.get('/getMessageList', controller.messages.getMessageList);
    messagesRouter.post('/addMessage', controller.messages.addMessage);
    messagesRouter.post('/getMessageDetail', controller.messages.getMessageDetail);
    messagesRouter.delete('/delMessage', controller.messages.delMessage);
    messagesRouter.post('/addReplyMessage', controller.messages.addReplyMessage);
}