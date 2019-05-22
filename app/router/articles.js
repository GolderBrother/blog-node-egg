'use strict';

/**
 * articles route api
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // 报错 namespace is not a function
    // 配置路由前缀 namespace
    // const userRouter = app.router.namespace('/api');
    const articlesRouter = app.router;
    const {
        controller
    } = app;
    articlesRouter.post('/addArticle', controller.articles.addArticle);
    // articleRouter.post('/updateArticle', controller.articles.updateArticle);
    articlesRouter.put('/updateArticle', controller.articles.updateArticle);
    // articlesRouter.post('/delArticle', controller.articles.delArticle);
    articlesRouter.delete('/delArticle', controller.articles.delArticle);
    articlesRouter.get('/getArticleList', controller.articles.getArticleList);
    articlesRouter.get('/getArticleListAdmin', controller.articles.getArticleListAdmin);
    articlesRouter.post('/likeArticle', controller.articles.likeArticle);
    articlesRouter.post('/getArticleDetailByType', controller.articles.getArticleDetailByType);
    articlesRouter.post('/getArticleDetail', controller.articles.getArticleDetail);
}