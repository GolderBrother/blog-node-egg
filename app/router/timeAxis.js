'use strict';

/**
 * timeAxis route api
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // 报错 namespace is not a function
    // 配置路由前缀 namespace
    // const userRouter = app.router.namespace('/api');
    const timeAxisRouter = app.router;
    const {
        controller
    } = app;
    timeAxisRouter.get('/getTimeAxisList', controller.timeAxis.getTimeAxisList);
    timeAxisRouter.post('/addTimeAxis', controller.timeAxis.addTimeAxis);
    timeAxisRouter.put('/updateTimeAxis', controller.timeAxis.updateTimeAxis);
    timeAxisRouter.delete('/delTimeAxis', controller.timeAxis.delTimeAxis);
    timeAxisRouter.post('/getTimeAxisDetail', controller.timeAxis.getTimeAxisDetail);
}