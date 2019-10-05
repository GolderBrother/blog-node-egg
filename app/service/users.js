// const {
//     Service
// } = require('egg');
const BaseService = require('./base');
const CONFIG = require('../../config/config');
const fetch = require('node-fetch');
const utils = require('../middleware/utils');
class UsersService extends BaseService {
    // 第三方授权登录的用户信息
    async getUser() {
        const {
            ctx
        } = this;
        let {
            code
        } = ctx.request.body;
        let response = {};
        response["httpCode"] = 200;
        const User = ctx.model.User;
        try {
            if (!code) {
                response["code"] = 2;
                response["httpCode"] = 400;
                response["message"] = 'code 缺失';
                return response;
            }
            let path = CONFIG.GITHUB.access_token_url;
            const params = {
                client_id: CONFIG.GITHUB.client_id,
                client_secret: CONFIG.GITHUB.client_secret,
                code: code,
            };
            const res1 = await fetch(path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            const body = await res1.text();
            const args = body.split('&');
            let arg = args[0].split('=');
            const access_token = arg[1];
            // console.log("body:",body);
            // console.log('access_token:', access_token);
            // 备注：await后面可以跟普通值
            const token = await access_token;
            const url = CONFIG.GITHUB.user_url + '?access_token=' + token;
            // console.log('url:', url);
            const res2 = await fetch(url);
            const response2 = await res2.json();
            // console.log('response2 ', response2);
            if (response2.id) {
                const userInfo = User.findOne({
                    github_id: response2.id
                });
                if (userInfo) {
                    //登录成功后设置session
                    // req.session.userInfo = userInfo;
                    this.ctx.session.userInfo = userInfo;
                    response["code"] = 0;
                    response["httpCode"] = 200;
                    response["data"] = userInfo;
                    response["message"] = '授权登录成功';
                } else {
                    let obj = {
                        github_id: response2.id,
                        email: response2.email,
                        password: response2.login,
                        type: 2,
                        avatar: response2.avatar_url,
                        name: response2.login,
                        location: response2.location,
                    };
                    //保存到数据库
                    let user = new User(obj);
                    const data = await user.save();
                    // console.log('data :', data);
                    req.session.userInfo = data;
                    response["code"] = 0;
                    response["httpCode"] = 200;
                    response["data"] = data;
                    response["message"] = '授权登录成功';
                }
            }
            const res3 = await fetch(url);
            // console.log('res3 :', res3);
            const response3 = await res3.json();
            // console.log('response3 ', response3);
            if (response3.id) {
                //验证用户是否已经在数据库中
                const userInfo = await User.findOne({
                    github_id: response3.id
                });
                // console.log('userInfo :', userInfo);
                if (userInfo) {
                    //登录成功后设置session
                    // req.session.userInfo = userInfo;
                    this.ctx.session.userInfo = userInfo;
                    response["code"] = 0;
                    response["httpCode"] = 200;
                    response["data"] = userInfo;
                    response["message"] = '授权登录成功';
                } else {
                    let obj = {
                        github_id: response3.id,
                        email: response3.email,
                        password: response3.login,
                        type: 2,
                        avatar: response3.avatar_url,
                        name: response3.login,
                        location: response3.location,
                    };
                    //保存到数据库
                    let user = new User(obj);
                    const data = await user.save();
                    // console.log('data :', data);
                    req.session.userInfo = data;
                    response["code"] = 0;
                    response["httpCode"] = 200;
                    response["data"] = data;
                    response["message"] = '授权登录成功';
                }
            } else {
                response["code"] = 1;
                response["httpCode"] = 400;
                response["data"] = response3;
                response["message"] = '授权登录失败';
            }
            const res4 = await fetch(url);
            // console.log('res4 :', res4);
            const response4 = await res4.json();
        } catch (error) {
            utils.handleError(res, error);
        }
        return response;
    };

    async login(options) {
        let res = {};
        res["httpCode"] = 200;
        try {
            let {
                email,
                password
            } = options;
            if (!email) {
                res["code"] = 2;
                res["message"] = '用户邮箱不可为空';
                return res;
            }
            if (!password) {
                res["code"] = 1;
                res["message"] = '密码不可为空';
                return res;
            }

            const userInfo = await this.ctx.model.User.findOne({
                email,
                // password: md5(password + MD5_SUFFIX),
                password
            });
            if (userInfo) {
                //登录成功后设置session
                // this.userInfo = userInfo;
                this.ctx.session.userInfo = userInfo;
                res["code"] = 0;
                res["data"] = userInfo;
                res["message"] = '登录成功';
            } else {
                res["code"] = 1;
                res["httpCode"] = 200;
                res["message"] = '用户名或者密码错误';
            }
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    }

    async currentUser(userInfo) {
        let user = userInfo,
            response = {};
        response["httpCode"] = 200;
        try {
            if (user) {
                user.avatar = 'http://p61te2jup.bkt.clouddn.com/WechatIMG8.jpeg';
                user.notifyCount = 0;
                user.address = '福建省';
                user.country = 'China';
                user.group = 'jamesZhang';
                (user.title = '交互专家'), (user.signature = '海纳百川，有容乃大');
                user.tags = [];
                user.geographic = {
                    province: {
                        label: '福建省',
                        key: '360000',
                    },
                    city: {
                        label: '厦门市',
                        key: '361000',
                    },
                };
                response["code"] = 0;
                response["message"] = '';
                response["data"] = user;
            } else {
                response["code"] = 1;
                response["message"] = '请重新登录';
                response["data"] = user;
            }
        } catch (error) {
            utils.handleError(res, error);
        }
        return response;
    }


    // 登录成功的处理函数
    loginAdminSuccess(userInfo, response) {
        let res = {
            httpCode: 200
        };
        try {
            if (userInfo.type === 0) {
                //登录成功后设置session
                // req.session.userInfo = userInfo;
                this.ctx.session.userInfo = userInfo;
                res["code"] = 0;
                res["httpCode"] = 200;
                res["message"] = '登录成功';
                res["data"] = userInfo;
            } else {
                res["code"] = 1;
                res["httpCode"] = 403;
                res["message"] = '只有管理员才能登录后台！';
            }
            return res;
        } catch (error) {
            utils.handleError(res, error);
        }
    }

    async userInfo(userInfo) {
        let res = {
            httpCode: 200
        };
        try {
            if (userInfo) {
                res["code"] = 0;
                res["message"] = '';
                res["data"] = req.session.userInfo;
            } else {
                res["code"] = 1;
                res["message"] = '请重新登录';
                res["data"] = req.session.userInfo;
            }
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    };

    async loginAdmin({
        username,
        password
    }) {
        let response = {};
        response["httpCode"] = 200;
        if (!username) {
            response["code"] = 2;
            response["httpCode"] = 400;
            response["message"] = '用户名不可为空';
            return response;
        }
        if (!password) {
            response["code"] = 2;
            response["httpCode"] = 400;
            response["message"] = '密码不可为空';
            return response;
        }
        try {
            const User = this.ctx.model.User;
            const userInfo = await User.findOne({
                name: username,
                password
            });
            if (userInfo) {
                response = this.loginAdminSuccess(userInfo, response);
            } else {
                const userInfo = await User.findOne({
                    email: username,
                    password
                });
                if (userInfo) {
                    response = this.loginAdminSuccess(userInfo, response);
                } else {
                    response["code"] = 1;
                    response["httpCode"] = 200;
                    response["message"] = '用户名或者密码错误';
                }
            }
        } catch (error) {
            utils.handleError(res, error);
        }
        return response;
    };

    async register(options) {
        let {
            name,
            password,
            phone,
            email,
            introduce,
            type
        } = options;
        let res = {};
        res["httpCode"] = 200;
        if (!email) {
            res["httpCode"] = 200;
            res["code"] = 2;
            res["message"] = '用户邮箱不可为空';
            return res;
        }
        const reg = new RegExp(
            '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
        ); //正则表达式
        if (!reg.test(email)) {
            res["httpCode"] = 400;
            res["code"] = 2;
            res["message"] = '请输入格式正确的邮箱！';
            return res;
        }
        if (!name) {
            res["httpCode"] = 400;
            res["code"] = 2;
            res["message"] = '用户名不可为空';
            return res;
        }
        if (!password) {
            res["httpCode"] = 400;
            res["code"] = 2;
            res["message"] = '密码不可为空';
            return res;
        }
        try {
            const User = this.ctx.model.User;
            //验证用户是否已经在数据库中
            const data = await User.findOne({
                email: email
            });
            if (data) {
                res["httpCode"] = 200;
                res["code"] = 1;
                res["message"] = '用户邮箱已存在！';
                return res;
            }
            //保存到数据库
            let user = new User({
                email,
                name,
                // password: md5(password + MD5_SUFFIX),
                password,
                phone,
                type,
                introduce,
            });
            const result = await user.save();
            res["httpCode"] = 200;
            res["code"] = 0;
            res["message"] = '注册成功';
            res["data"] = result;
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    };

    async delUser(id = []) {
        let res = {};
        res["httpCode"] = 200;
        try {
            const result = await this.ctx.model.User.deleteMany({
                _id: id
            });
            if (result.n === 1) {
                res["httpCode"] = 200;
                res["code"] = 0;
                res["message"] = '用户删除成功!';
            } else {
                res["httpCode"] = 200;
                res["code"] = 1;
                res["message"] = '用户不存在!';
            }
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    };

    async getUserList(options) {
        let res = {};
        res["httpCode"] = 200;
        try {
            let {
                type = '', keyword = '', pageNum = null, pageSize = null
            } = options;
            pageNum = parseInt(pageNum) || 1;
            pageSize = parseInt(pageSize) || 10;
            let conditions = {};
            if (keyword) {
                const reg = new RegExp(keyword, 'i');
                conditions = {
                    $or: [{
                        name: {
                            $regex: reg
                        }
                    }, {
                        email: {
                            $regex: reg
                        }
                    }],
                };
            }
            if (type !== '') {
                conditions["$and"] = [{
                    "type": type
                }];
            }

            // console.log(conditions);
            let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
            let responseData = {
                count: 0,
                list: [],
            };
            let fields = {},
                _options = {};

            const User = this.ctx.model.User;
            await User.countDocuments({}, (err, count) => {
                if (err) {
                    console.error('Error:' + err);
                } else {
                    responseData.count = count;
                    // 待返回的字段
                    fields = {
                        _id: 1,
                        email: 1,
                        name: 1,
                        _avatar: 1,
                        get avatar() {
                            return this._avatar;
                        },
                        set avatar(value) {
                            this._avatar = value;
                        },
                        phone: 1,
                        introduce: 1,
                        type: 1,
                        create_time: 1,
                    };
                    _options = {
                        skip: skip,
                        limit: pageSize,
                        sort: {
                            create_time: -1
                        },
                    };
                }
            });
            await User.find(conditions, fields, _options, (error, result) => {
                if (error) {
                    res["httpCode"] = 200;
                    res["code"] = -1;
                    res["message"] = error.message || error;
                } else {
                    responseData.list = result;
                    res["httpCode"] = 200;
                    res["code"] = 0;
                    res["message"] = 'success';
                    res["data"] = responseData;
                }
            });
        } catch (error) {
            utils.handleError(res, error);
        }
        return res;
    };
}

module.exports = UsersService;