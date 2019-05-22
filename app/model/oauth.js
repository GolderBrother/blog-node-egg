/**
 * User model module.
 * @file 第三方授权登录的用户数据模型 (暂无用)
 * @module model/user
 * @author GolderBrother <https://github.com/GolderBrother>
 */

// const { mongoose } = require('../core/mongodb.js');
const autoIncrement = require('mongoose-auto-increment');
const OAuthModel = app => {
  const {
    mongoose
  } = app;
  const {
    Schema
  } = mongoose;
  autoIncrement.initialize(mongoose.connection);
  const OAuthSchema = new Schema({
    // 第三方授权登录的用户 id
    open_id: {
      type: String,
      required: true,
      default: ''
    },
    // 关联的用户表的 id ，现在用不到
    user_id: {
      type: String,
      default: ''
    },
    // 名字
    name: {
      type: String,
      default: ''
    },
    //用户类型 0：博主 1：其他用户 2：github 3：weixin 4：qq ( 0，1 是注册的用户； 2，3，4 都是第三方授权登录的用户)
    type: {
      type: Number,
      default: 1
    },
    // 手机
    phone: {
      type: Number,
      default: ''
    },
    // 邮箱
    email: {
      type: String,
      default: ''
    },
    // 地址 address
    location: {
      type: String,
      default: ''
    },
    // 头像
    avatar: {
      type: String,
      default: 'user'
    },
    // 个人介绍
    introduce: {
      type: String,
      default: ''
    },
    // 创建日期
    create_time: {
      type: Date,
      default: Date.now
    },
    // 最后修改日期
    updateTime: {
      type: Date,
      default: Date.now
    }
  });
  // 自增 ID 插件配置
  OAuthSchema.plugin(autoIncrement.plugin, {
    model: 'OAuth',
    field: 'id',
    startAt: 1,
    incrementBy: 1
  });
  return mongoose.model('OAuth', OAuthSchema);
}
module.exports = OAuthModel;