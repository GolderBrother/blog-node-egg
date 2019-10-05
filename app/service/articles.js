// const {
//     Service
// } = require('egg');
const BaseService = require('./base');
const utils = require('../middleware/utils');
class ArticlesService extends BaseService {
    async addArticle(options) {
        let res = {};
        res["httpCode"] = 200;
        try {
            // if (!req.session.userInfo) {
            // 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录');
            // 	return;
            // }
            const {
                title,
                author,
                keyword,
                content,
                desc,
                img_url,
                tags,
                category,
                state,
                type,
                origin
            } = options;
            let tempArticle = null;
            const Article = this.ctx.model.Article;
            if (img_url) {
                tempArticle = new Article({
                    title,
                    author,
                    keyword: keyword ? keyword.split(',') : [],
                    content,
                    numbers: content.length,
                    desc,
                    img_url,
                    tags: tags ? tags.split(',') : [],
                    category: category ? category.split(',') : [],
                    state,
                    type,
                    origin,
                });
            } else {
                tempArticle = new Article({
                    title,
                    author,
                    keyword: keyword ? keyword.split(',') : [],
                    content,
                    numbers: content.length,
                    desc,
                    tags: tags ? tags.split(',') : [],
                    category: category ? category.split(',') : [],
                    state,
                    type,
                    origin,
                });
            }
            const data = await tempArticle.save();
            // let article = JSON.parse(JSON.stringify(data));
            // console.log('article :', article);
            // article.create_time = timestampToTime(article.create_time);
            // article.update_time = timestampToTime(article.update_time);
            // console.log('timestampToTime :', timestampToTime(data.create_time));
            res["httpCode"] = 200;
            res["code"] = 0;
            res["message"] = '保存成功';
            res["data"] = data;
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    };

    async updateArticle(options) {
        // if (!req.session.userInfo) {
        // 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录');
        // 	return;
        // }
        let res = {};
        res["httpCode"] = 200;
        try {
            const {
                title,
                author,
                keyword,
                content,
                desc,
                img_url,
                tags,
                category,
                state,
                type,
                origin,
                id
            } = options;
            const Article = this.ctx.model.Article;
            const result = await Article.update({
                _id: id
            }, {
                title,
                author,
                keyword: keyword ? keyword.split(',') : [],
                content,
                numbers: content.length,
                desc,
                img_url,
                tags: tags ? tags.split(',') : [],
                category: category ? category.split(',') : [],
                state,
                type,
                origin,
            });
            res["httpCode"] = 200;
            res["code"] = 0;
            res["message"] = '保存成功';
            res["data"] = result;
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    };

    async delArticle(id = []) {
        let res = {};
        res["httpCode"] = 200;
        try {
            const result = await Article.deleteMany({
                _id: id
            });
            if (result.n === 1) {
                res["httpCode"] = 200;
                res["code"] = 0;
                res["message"] = '删除成功';
            } else {
                res["httpCode"] = 200;
                res["code"] = 1;
                res["message"] = '文章不存在';
            }
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    };

    // 前台文章列表
    async getArticleList(options) {
        let res = {};
        res["httpCode"] = 200;
        try {
            let {
                keyword = null,
                    state = '',
                    likes = '',
                    tag_id = '',
                    category_id = '',
                    article = '',
                    pageNum,
                    pageSize
            } = options;
            pageNum = parseInt(pageNum) || 1;
            pageSize = parseInt(pageSize) || 10;
            // 如果是文章归档 返回全部文章
            if (article) {
                pageSize = 1000;
            }
            let conditions = {};
            const Article = this.ctx.model.Article;
            if (!state) {
                if (keyword) {
                    const reg = new RegExp(keyword, 'i'); //不区分大小写
                    conditions = {
                        $or: [{
                            title: {
                                $regex: reg
                            }
                        }, {
                            desc: {
                                $regex: reg
                            }
                        }],
                    };
                }
            } else if (state) {
                state = parseInt(state);
                if (keyword) {
                    const reg = new RegExp(keyword, 'i');
                    conditions = {
                        $and: [{
                                $or: [{
                                    state: state
                                }]
                            },
                            {
                                $or: [{
                                        title: {
                                            $regex: reg
                                        }
                                    },
                                    {
                                        desc: {
                                            $regex: reg
                                        }
                                    },
                                    {
                                        keyword: {
                                            $regex: reg
                                        }
                                    },
                                ],
                            },
                        ],
                    };
                } else {
                    conditions = {
                        state
                    };
                }
            }

            let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
            let responseData = {
                count: 0,
                list: [],
            };
            await Article.countDocuments({}, async (error, count) => {
                if (error) {
                    console.log('Error:' + error);
                    res["httpCode"] = 200;
                    res["code"] = 1;
                    res["message"] = error.message || error;
                } else {
                    responseData.count = count;
                }
            });
            // 待返回的字段
            let fields = {
                title: 1,
                desc: 1,
                img_url: 1,
                tags: 1,
                category: 1,
                meta: 1,
                create_time: 1,
            };
            if (article) {
                fields = {
                    title: 1,
                    create_time: 1,
                };
            }
            let _options = {
                skip: skip,
                limit: pageSize,
                sort: {
                    create_time: -1
                },
            };
            await Article.find(conditions, fields, _options, (error, result) => {
                if (error) {
                    console.error('Error:' + error);
                    res["httpCode"] = 200;
                    res["code"] = 1;
                    res["message"] = error.message || error;
                } else {
                    let newList = [];
                    if (likes) {
                        // 根据热度 likes 返回数据
                        result.sort((a, b) => {
                            return b.meta.likes - a.meta.likes;
                        });
                        responseData.list = result;
                    } else if (category_id) {
                        // console.log('category_id :', category_id);
                        // 根据 分类 id 返回数据
                        result.forEach(item => {
                            if (item.category.indexOf(category_id) > -1) {
                                newList.push(item);
                            }
                        });
                        let len = newList.length;
                        responseData.count = len;
                        responseData.list = newList;
                    } else if (tag_id) {
                        // console.log('tag_id :', tag_id);
                        // 根据标签 id 返回数据
                        result.forEach(item => {
                            if (item.tags.indexOf(tag_id) > -1) {
                                newList.push(item);
                            }
                        });
                        let len = newList.length;
                        responseData.count = len;
                        responseData.list = newList;
                    } else if (article) {
                        const archiveList = []
                        let obj = {}
                        // 按年份归档 文章数组
                        result.forEach((e) => {
                            let year = e.create_time.getFullYear()
                            // let month = e.create_time.getMonth()
                            if (!obj[year]) {
                                obj[year] = []
                                obj[year].push(e)
                            } else {
                                obj[year].push(e)
                            }
                        })
                        for (const key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                const element = obj[key];
                                let item = {}
                                item.year = key
                                item.list = element
                                archiveList.push(item)
                            }
                        }
                        archiveList.sort((a, b) => {
                            return b.year - a.year;
                        });
                        responseData.list = archiveList;
                    } else {
                        responseData.list = result;
                    }
                    res["httpCode"] = 200;
                    res["code"] = 0;
                    res["message"] = '操作成功';
                    res["data"] = responseData;
                }
            });
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    }

    // 后台文章列表
    async getArticleListAdmin(options) {
        let res = {};
        res["httpCode"] = 200;
        try {
            let {
                keyword = null,
                    state = '',
                    likes = '',
                    pageNum,
                    pageSize
            } = options;
            pageNum = parseInt(pageNum) || 1;
            pageSize = parseInt(pageSize) || 10;
            let conditions = {};
            const Article = this.ctx.model.Article;
            if (!state) {
                if (keyword) {
                    const reg = new RegExp(keyword, 'i'); //不区分大小写
                    conditions = {
                        $or: [{
                            title: {
                                $regex: reg
                            }
                        }, {
                            desc: {
                                $regex: reg
                            }
                        }],
                    };
                }
            } else if (state) {
                state = parseInt(state);
                if (keyword) {
                    const reg = new RegExp(keyword, 'i');
                    conditions = {
                        $and: [{
                                $or: [{
                                    state: state
                                }]
                            },
                            {
                                $or: [{
                                        title: {
                                            $regex: reg
                                        }
                                    },
                                    {
                                        desc: {
                                            $regex: reg
                                        }
                                    },
                                    {
                                        keyword: {
                                            $regex: reg
                                        }
                                    },
                                ],
                            },
                        ],
                    };
                } else {
                    conditions = {
                        state
                    };
                }
            }

            let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
            let responseData = {
                count: 0,
                list: [],
            };
            await Article.countDocuments({}, (error, count) => {
                if (error) {
                    console.log('Error:' + error);
                    res["httpCode"] = 200;
                    res["code"] = 1;
                    res["message"] = error.message || error;
                } else {
                    responseData.count = count;
                }
            });
            // 待返回的字段
            let fields = {
                title: 1,
                author: 1,
                keyword: 1,
                // content: 1,
                desc: 1,
                img_url: 1,
                tags: 1,
                category: 1,
                state: 1,
                type: 1,
                origin: 1,
                comments: 1,
                like_User_id: 1,
                meta: 1,
                create_time: 1,
                // update_time: 1,
            };
            let _options = {
                skip: skip,
                limit: pageSize,
                sort: {
                    create_time: -1
                },
            };
            await new Promise((resolve, reject) => {
                Article.find(conditions, fields, _options, (error, result) => {
                        if (error) {
                            console.error('Error:' + error);
                            res["httpCode"] = 200;
                            res["code"] = 1;
                            res["message"] = error.message || error;
                        } else {
                            if (likes) {
                                result.sort((a, b) => {
                                    return b.meta.likes - a.meta.likes;
                                });
                            }
                            responseData.list = result;
                            res["httpCode"] = 200;
                            res["code"] = 0;
                            res["message"] = '操作成功';
                            res["data"] = responseData;
                        }
                        resolve(res);
                    })
                    // opulation 可以自动替换 document 中的指定字段，替换内容从其他 collection 获取。 我们可以填充（populate）单个或多个 document、单个或多个纯对象，甚至是 query 返回的一切对象
                    .populate([{
                            path: 'tags'
                        },
                        {
                            path: 'comments'
                        },
                        {
                            path: 'category'
                        },
                    ])
                    .exec((err, doc) => {
                        console.log("doc:"); // aikin
                        console.log("doc.tags:", doc.tags); // aikin
                        console.log("doc.category:", doc.category); // undefined
                    });
            });
            // return res;
        } catch (error) {
            console.error('Error:' + error);
            utils.handleError(res, error);
        }
        return res;
    };

    // 文章点赞
    async likeArticle(userInfo, options) {
        let res = {};
        res["httpCode"] = 200;
        try {
            if (!userInfo) {
                res["code"] = 1;
                res["message"] = '您还没登录,或者登录信息已过期，请重新登录';
                return res;
            }
            let {
                id = '',
                user_id = ''
            } = options;
            const data = await this.ctx.model.Article.findOne({
                _id: id
            });
            let fields = {};
            data.meta.likes = data.meta.likes + 1;
            fields.meta = data.meta;
            let like_users_arr = data.like_users.length ? data.like_users : [];
            const user = await this.ctx.model.User.findOne({
                _id: user_id
            });
            let new_like_user = {};
            new_like_user.id = user._id;
            new_like_user.name = user.name;
            new_like_user.avatar = user.avatar;
            new_like_user.create_time = user.create_time;
            new_like_user.type = user.type;
            new_like_user.introduce = user.introduce;
            like_users_arr.push(new_like_user);
            fields.like_users = like_users_arr;
            const result = await this.ctx.model.User.update({
                _id: id
            }, fields);
            res["code"] = 0;
            res["message"] = '保存成功';
            res["data"] = result;
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    };

    // 文章详情（可能有问题）
    async getArticleDetailByType(type = '') {
        let res = {};
        res["httpCode"] = 200;
        try {
            if (!type) {
                res["code"] = 1;
                res["message"] = '文章不存在 ';
                return res;
            }
            const Article = this.ctx.model.Article;
            let data = null;
            data = await Article.findOne({
                    type: type
                }, async (error, _data) => {
                    if (error) {
                        console.error('Error:' + error);
                        res["httpCode"] = 500;
                        res["code"] = -1;
                        res["message"] = error.message || error;
                    } else {
                        if (_data) {
                            if (_data.meta) _data.meta.views = _data.meta.views + 1;
                            data = _data;
                        }
                    }
                })
                .populate([{
                        path: 'tags',
                        select: '-_id'
                    },
                    {
                        path: 'category',
                        select: '-_id'
                    },
                    {
                        path: 'comments',
                        select: '-_id'
                    },
                ])
                .exec((err, doc) => {
                    return data;
                    // console.log("doc:");          // aikin
                    // console.log("doc.tags:",doc.tags);          // aikin
                    // console.log("doc.category:",doc.category);           // undefined
                });

            const result = await Article.updateOne({
                type: type
            }, {
                meta: data.meta
            });
            // console.log("result %o:", result);
            res["httpCode"] = 200;
            res["code"] = 0;
            res["message"] = '操作成功';
            res["data"] = data;
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    };

    // 文章详情
    async getArticleDetail(options) {
        let res = {};
        res["httpCode"] = 200;
        try {
            let {
                id = '',
                    type = null,
                    filter = null
            } = options;
            type = Number(type) || 1; //文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
            filter = Number(filter) || 1; //文章的评论过滤 => 1: 过滤，2: 不过滤
            // console.log(id, type, filter);
            const Article = this.ctx.model.Article;
            if (type === 1) {
                if (!id) {
                    res["code"] = 1;
                    res["message"] = '文章不存在';
                    return res;
                }
                await new Promise((resolve, reject) => {
                    Article.findOne({
                            _id: id
                        }, async (error, data) => {
                            if (error) {
                                console.error('Error:' + error);
                                throw new Error(error);
                            } else {
                                if (data && data.meta) data.meta.views = data.meta.views + 1;
                                try {
                                    const result = await Article.updateOne({
                                        _id: id
                                    }, {
                                        meta: data.meta
                                    });
                                    // console.log('data:',data)
                                    if (filter === 1) {
                                        const arr = data.comments;
                                        for (let i = arr.length - 1; i >= 0; i--) {
                                            const e = arr[i];
                                            if (e.state !== 1) {
                                                arr.splice(i, 1);
                                            }
                                            const newArr = e.other_comments;
                                            const length = newArr.length;
                                            if (length) {
                                                for (let j = length - 1; j >= 0; j--) {
                                                    const item = newArr[j];
                                                    if (item.state !== 1) {
                                                        newArr.splice(j, 1);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    res["httpCode"] = 200;
                                    res["code"] = 0;
                                    res["message"] = '操作成功';
                                    res["data"] = data;
                                    // resolve(res);
                                } catch (error) {
                                    throw new Error(error);
                                }
                            }
                            resolve(res);
                        })
                        .populate([{
                            path: 'tags'
                        }, {
                            path: 'category'
                        }, {
                            path: 'comments'
                        }])
                        .exec((err, doc) => {
                            if (err) {
                                console.error('Error:' + err);
                            }
                            if (doc) {
                                console.log("doc.tags:", doc.tags);
                                console.log("doc.category:", doc.category);
                            }
                        });
                });
            } else {
                try {
                    await new Promise((resolve, reject) => {
                        Article.findOne({
                                type
                            }, async (error, data) => {
                                if (error) {
                                    throw new Error(error);
                                    // reject(error);
                                    // return utils.handleError(res, error);
                                } else {
                                    if (data) {
                                        if (data.meta) {
                                            data.meta.views = data.meta.views + 1;
                                        }
                                        try {
                                            const result = await Article.updateOne({
                                                type
                                            }, {
                                                meta: data.meta
                                            });
                                            if (filter === 1) {
                                                const arr = data.comments;
                                                for (let i = arr.length - 1; i >= 0; i--) {
                                                    const e = arr[i];
                                                    if (e.state !== 1) {
                                                        arr.splice(i, 1);
                                                    }
                                                    const newArr = e.other_comments;
                                                    const length = newArr.length;
                                                    if (length) {
                                                        for (let j = length - 1; j >= 0; j--) {
                                                            const item = newArr[j];
                                                            if (item.state !== 1) {
                                                                newArr.splice(j, 1);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            res["httpCode"] = 200;
                                            res["code"] = 0;
                                            res["message"] = '操作成功';
                                            res["data"] = data;
                                        } catch (error) {
                                            throw new Error(error);
                                        }
                                    } else {
                                        res["httpCode"] = 200;
                                        res["code"] = 1;
                                        res["message"] = '文章不存在';
                                        // return res;  
                                    }
                                }
                                // console.log(res);
                                resolve(res);
                            })
                            .populate([{
                                path: 'tags'
                            }, {
                                path: 'category'
                            }, {
                                path: 'comments'
                            }])
                            .exec((err, doc) => {
                                if (err) {
                                    console.error('Error:' + err);
                                }
                                if (doc) {
                                    console.log("doc.tags:", doc.tags);
                                    console.log("doc.category:", doc.category);
                                }
                            });
                    });
                } catch (error) {
                    console.error('Error:' + error);
                    utils.handleError(res, error);
                }
            }
            // console.log(res);
        } catch (error) {
            console.error('Error:' + error);
            utils.handleError(res, error);
        }
        return res;
    };
}
module.exports = ArticlesService;