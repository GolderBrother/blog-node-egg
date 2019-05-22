'use strict';

/**
 * categories route api
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // 报错 namespace is not a function
    // 配置路由前缀 namespace
    // const userRouter = app.router.namespace('/api');
    const categoriesRouter = app.router;
    const {
        controller
    } = app;
    categoriesRouter.get('/getCategoryList', controller.categories.getCategoryList);
    categoriesRouter.post('/addCategory', controller.categories.addCategory);
    categoriesRouter.delete('/delCategory', controller.categories.delCategory);
}