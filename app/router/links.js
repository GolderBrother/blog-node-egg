'use strict';

/**
 * links route api
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // 报错 namespace is not a function
    // 配置路由前缀 namespace
    // const userRouter = app.router.namespace('/api');
    const linksRouter = app.router;
    const {
        controller
    } = app;
    linksRouter.get('/getLinkList', controller.links.getLinkList);
    linksRouter.post('/addLink', controller.links.addLink);
    linksRouter.put('/updateLink', controller.links.updateLink);
    linksRouter.delete('/delLink', controller.links.delLink);
}