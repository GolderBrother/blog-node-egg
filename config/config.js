/**
 * App config module.
 * @file 应用运行配置
 * @module app.config
 * @author GolderBrother <https://github.com/GolderBrother>
 */

const path = require('path');
const {
    argv
} = require('yargs');
// const package = require('package')

exports.APP = {
	LIMIT: 10,
	PORT: 8000,
	ROOT_PATH: __dirname,
	NAME: 'GolderBrother',
	URL: 'http://116.62.6.228',
	FRONT_END_PATH: path.join(__dirname, '..', 'GolderBrother'),
};


exports.CROSS_DOMAIN = {
	allowedOrigins: [
		'http://116.62.6.228',
		'https://github.com/GolderBrother',
	],
	allowedReferer: 'GolderBrother',
};

exports.MONGODB = {
    uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/blogNode`,
    username: argv.db_username || 'root',
    password: argv.db_password || 'root',
};
exports.AUTH = {
    data: argv.auth_data || {
        user: 'root'
    },
    jwtTokenSecret: argv.auth_key || 'blog-node',
    defaultPassword: argv.auth_default_password || 'root',
};

exports.EMAIL = {
    account: argv.email_account || 'your email address like : i@GolderBrother',
    password: argv.email_password || 'your email password',
    from: 'https://github.com/GolderBrother',
    admin: 'GolderBrother',
};

exports.AKISMET = {
    key: argv.akismet_key || 'your akismet Key',
    blog: argv.akismet_blog || 'your akismet blog site, like: http://116.62.6.228',
};

exports.GITHUB = {
    username: 'GolderBrother',
	oauth_uri: 'https://github.com/login/oauth/authorize',
	access_token_url: 'https://github.com/login/oauth/access_token',
	// 获取 github 用户信息 url // eg: https://api.github.com/user?access_token=****&scope=&token_type=bearer
	user_url: 'https://api.github.com/user',

	// 请把生产环境的 redirect_url，client_id 和 client_secret 中的 "****", 换成自己创建的 OAuth App 的具体参数即可。
	// 生产环境
	redirect_url: 'http://116.62.6.228',
	client_id: 'cfb7f07a30c09efe8f6d',
	client_secret: '4f51c9aba079dd97fdeaa18e9f9802d466f2a3e0',

	// 开发环境 （参数可以直接用，公供测试）
	// redirect_url: "http://localhost:3001/login",
	// client_id: "502176cec65773057a9e",
	// client_secret: "65d444de381a026301a2c7cffb6952b9a86ac235",

};

exports.ALIYUN = {
    ip: argv.aliyun_ip_auth,
};

exports.BAIDU = {
    site: argv.baidu_site || 'your baidu site domain like : GolderBrother',
    token: argv.baidu_token || 'your baidu seo push token',
};

exports.QINIU = {
    accessKey: argv.qn_accessKey || 'your access key',
    secretKey: argv.qn_secretKey || 'your secret key',
    bucket: argv.qn_bucket || 'your bucket name',
    origin: argv.qn_origin || 'http://nodepress.u.qiniudn.com',
    uploadURL: argv.qn_uploadURL || 'http://up.qiniu.com/',
};

exports.INFO = {
    // name: package.name,
    // version: package.version,
    // author: package.author,
    // site: exports.APP.URL,
    github: 'https://github.com/GolderBrother',
    powered: ['react', 'Nodejs', 'MongoDB', 'Express', 'Nginx'],
};