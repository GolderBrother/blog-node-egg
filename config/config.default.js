// 此处改为你自己的 Cookie 安全字符串
// exports.keys = 'jamesZhang';
// https://eggjs.org/en/core/logger.html#mobileAside
/* eslint valid-jsdoc: "off" */

'use strict';
const {
  argv
} = require('yargs');
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1552809897871_4889';

  // add your middleware config here
  config.middleware = [];

  // 更改默认的监听端口
  config.cluster = {
    listen: {
      path: '',
      port: 6100,
      hostname: '127.0.0.1',
    }
  };

  //配置mongoose mongoose是node里面操作mongodb数据库的一个模块
  //它可以以对象的形式操作数据库
  // Egg中使用egg-mongoose和常用的Mongoose 方法
  // https://www.cnblogs.com/wxw1314/p/10339775.html
  // http://mongoosejs.net/docs/index.html
  config.mongoose = {
    client: {
      url: `mongodb://127.0.0.1:${argv.dbport || '27017'}/blogNode`,
      options: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        poolSize: 40,
        reconnectTries: 10,
        reconnectInterval: 500,
      },
    }
  }

  // csrf： 跨站请求伪造
  // 关掉csrf校验
  config.security = {
    csrf: {
      enable: false,
      // ignoreJSON: true
    },
    // 允许哪些域名，不安全，上线后换成自己的域名
    domainWhiteList: ['http://localhost:3000']
  }

  config.session_secret = 'node_egg_blog_secret'; // 务必修改

  // session
  config.session = {
    key: 'blog_node_egg_cookie', //key名字
    name: 'session_id', //# 在浏览器中生成cookie的名称key，默认是connect.sid
    maxAge: 1000 * 60 * 24,
    httpOnly: true,
    encrypt: true, //加密 
    renew: true //每次访问页面都会给session会话延长时间
  }

  // redis database
  // config.redis = {
  //   client: {
  //     host: process.env.EGG_REDIS_HOST || '127.0.0.1',
  //     port: process.env.EGG_REDIS_PORT || 6379,
  //     password: process.env.EGG_REDIS_PASSWORD || '',
  //     db: process.env.EGG_REDIS_DB || '0',
  //   },
  // };

  // 允许携带cookie
  config.cors = {
    // 配置成前端服务地址
    origin: '*',
    // 允许前端跨域携带cookie
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  // view 模板引擎
  config.view = {
    defaultViewEngine: 'ejs',
  };

  // 把日志文件转移到指定目录下
  config.logger = {
    dir: path.resolve(__dirname, '../logs/blog-node-egg'),
  };
  

  // debug 为 true 时，用于本地调试
  config.debug = true;

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};