'use strict';

/**
 * projects route api
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // 报错 namespace is not a function
    // 配置路由前缀 namespace
    // const userRouter = app.router.namespace('/api');
    const projectsRouter = app.router;
    const {
        controller
    } = app;
    projectsRouter.get('/getProjectList', controller.projects.getProjectList);
    projectsRouter.post('/addProject', controller.projects.addProject);
    projectsRouter.put('/updateProject', controller.projects.updateProject);
    projectsRouter.delete('/delProject', controller.projects.delProject);
    projectsRouter.post('/getProjectDetail', controller.projects.getProjectDetail);
}