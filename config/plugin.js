'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };

exports.session = {
  enable: true
};

exports.mongoose = {
  enabled: true,
  package: "egg-mongoose"
}

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

// exports.redis = {
//   enable: true,
//   package: 'egg-redis',
// };

exports.cors = {
  enabled: true,
  package: 'egg-cors'
}

exports.autoIncrement = {
  enabled: true,
  package: 'mongoose-auto-increment'
}

/**
 目前 egg-router-plus 是存在一个问题
 存在的问题是当使用 newsRouter.redirect(from,to) 的时候，from 会遵循 namespace 的前缀，但是 to 不会遵循 namespace 的前缀。
 * 比如官方给的示例：

  const subRouter = app.router.namespace('/sub');

  // will redirect `/sub/go` to `/anyway`, not `/sub/anyway`
  subRouter.redirect('/go', '/anyway');
  尽管使用了 subRouter.redirect()，但是最终跳转规则是从 /sub/go 跳转到 /anyway，而不是 /sub/anyway，目前这个问题尚未被解决。
 http://www.ptbird.cn/eggjs-router-more.html
  */
exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};