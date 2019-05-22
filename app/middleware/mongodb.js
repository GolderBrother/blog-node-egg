/**
 * Mongoose module.
 * @file 数据库模块
 * @module middleware/mongoose
 * @author  GolderBrother <https://github.com/GolderBrother>
 */

const consola = require('consola')
const CONFIG = require('../../app.config.js')
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const dbConfig = {
	useCreateIndex: true,
	useNewUrlParser: true,
	promiseLibrary: global.Promise
}
// remove DeprecationWarning
mongoose.set('useFindAndModify', false)


// mongoose Promise
mongoose.Promise = global.Promise

// mongoose
exports.mongoose = mongoose

// connect
exports.connect = () => {
	// console.log('CONFIG.MONGODB.uri :', CONFIG.MONGODB.uri)
	let maxConnectTimes = 0;

	// 自增 ID 初始化
	autoIncrement.initialize(mongoose.connection)

	// 返回实例
	// return mongoose

	return new Promise((resolve, reject) => {
		// 连接数据库
		mongoose.connect(CONFIG.MONGODB.uri, dbConfig);
		// 增加数据库监听事件
		// 数据库断开 连接断开三次内自动连接
		mongoose.connection.on("disconnect", () => {
			console.log('***********数据库断开***********')
			if (maxConnectTimes < 3) {
				maxConnectTimes++;
				mongoose.connect(CONFIG.MONGODB.uri, dbConfig);
			} else {
				reject()
				throw new Error("Failed to connect to database")
			}
		})
		// 数据库连接失败 连接错误三次内自动连接
		mongoose.connection.on("error", (error) => {
			consola.warn('***********数据库连接失败!***********', error)
			if (maxConnectTimes < 3) {
				maxConnectTimes++;
				mongoose.connect(CONFIG.MONGODB.uri, dbConfig);
			} else {
				reject();
				throw new Error("database error")
			}
		})
		// 数据库连接成功
		mongoose.connection.once("open", () => {
			consola.ready('数据库连接成功!')
			resolve();
		})
	})
}