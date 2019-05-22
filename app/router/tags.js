'use strict';

/**
 * tags route api
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // 报错 namespace is not a function
    // 配置路由前缀 namespace
    // const userRouter = app.router.namespace('/api');
    const tagsRouter = app.router;
    const {
        controller
    } = app;
    tagsRouter.get('/getTagList', controller.tags.getTagList);
    tagsRouter.post('/addTag', controller.tags.addTag);
    tagsRouter.delete('/delTag', controller.tags.delTag);
}