const BaseController = require("./base");
class ArticlesController extends BaseController {
  async addArticle() {
    // if (!this.userInfo) {
    // 	this.responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
    // 	return;
    // }
    const {
      ctx
    } = this;
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
    } = ctx.request.body;
    const result = await ctx.service.articles.addArticle({
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
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };
  async updateArticle() {

    // if (!req.session.userInfo) {
    // 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
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
      origin,
      id
    } = this.ctx.request.body;
    const result = await this.ctx.service.articles.updateArticle({
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
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  async delArticle() {
    let {
      id
    } = this.ctx.request.body;
    const result = await this.ctx.service.articles.delArticle(id);
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 前台文章列表
  async getArticleList() {
    let {
      keyword,
      state,
      likes,
      tag_id,
      category_id,
      article,
      pageNum,
      pageSize
    } = this.ctx.query;
    const result = await this.ctx.service.articles.getArticleList({
      keyword,
      state,
      likes,
      tag_id,
      category_id,
      article,
      pageNum,
      pageSize
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  }

  // 后台文章列表
  async getArticleListAdmin() {
    let {
      keyword,
      state,
      likes,
      pageNum,
      pageSize
    } = this.ctx.query;
    const result = await this.ctx.service.articles.getArticleListAdmin({
      keyword,
      state,
      likes,
      pageNum,
      pageSize
    });
    // console.log("result %o:", result);
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 文章点赞
  async likeArticle() {
    let {
      id,
      user_id
    } = this.ctx.request.body;
    const result = await this.ctx.service.articles.likeArticle(this.userInfo, {
      id,
      user_id
    })
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 文章详情
  async getArticleDetailByType() {
    let {
      type
    } = this.ctx.request.body;
    const result = await this.ctx.service.articles.getArticleDetailByType(type);
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

  // 文章详情
  async getArticleDetail() {
    let {
      id,
      type,
      filter
    } = this.ctx.request.body;

    const result = await this.ctx.service.articles.getArticleDetail({
      id,
      type,
      filter
    });
    this.responseClient(result.httpCode, result.code, result.message, result.data);
  };

}
module.exports = ArticlesController;




// 前台文章列表
// exports.getArticleList = (req, res) => {
//   let keyword = req.query.keyword || null;
//   let state = req.query.state || '';
//   let likes = req.query.likes || '';
//   let tag_id = req.query.tag_id || '';
//   let category_id = req.query.category_id || '';
//   let article = req.query.article || '';
//   let pageNum = parseInt(req.query.pageNum) || 1;
//   let pageSize = parseInt(req.query.pageSize) || 10;
//   // 如果是文章归档 返回全部文章
//   if (article) {
//     pageSize = 1000;
//   }
//   let conditions = {};
//   if (!state) {
//     if (keyword) {
//       const reg = new RegExp(keyword, 'i'); //不区分大小写
//       conditions = {
//         $or: [{ title: { $regex: reg } }, { desc: { $regex: reg } }],
//       };
//     }
//   } else if (state) {
//     state = parseInt(state);
//     if (keyword) {
//       const reg = new RegExp(keyword, 'i');
//       conditions = {
//         $and: [
//           { $or: [{ state: state }] },
//           {
//             $or: [
//               { title: { $regex: reg } },
//               { desc: { $regex: reg } },
//               { keyword: { $regex: reg } },
//             ],
//           },
//         ],
//       };
//     } else {
//       conditions = { state };
//     }
//   }

//   let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
//   let responseData = {
//     count: 0,
//     list: [],
//   };
//   Article.countDocuments({}, (err, count) => {
//     if (err) {
//       console.log('Error:' + err);
//     } else {
//       responseData.count = count;
//       // 待返回的字段
//       let fields = {
//         title: 1,
//         desc: 1,
//         img_url: 1,
//         tags: 1,
//         category: 1,
//         meta: 1,
//         create_time: 1,
//       };
//       if(article){
//         fields = {
//           title: 1,
//           create_time: 1,
//         };
//       }
//       let options = {
//         skip: skip,
//         limit: pageSize,
//         sort: { create_time: -1 },
//       };
//       Article.find(conditions, fields, options, (error, result) => {
//         if (err) {
//           console.error('Error:' + error);
//           // throw error;
//         } else {
//           let newList = [];
//           if (likes) {
//             // 根据热度 likes 返回数据
//             result.sort((a, b) => {
//               return b.meta.likes - a.meta.likes;
//             });
//             responseData.list = result;
//           } else if (category_id) {
//             // console.log('category_id :', category_id);
//             // 根据 分类 id 返回数据
//             result.forEach(item => {
//               if (item.category.indexOf(category_id) > -1) {
//                 newList.push(item);
//               }
//             });
//             let len = newList.length;
//             responseData.count = len;
//             responseData.list = newList;
//           } else if (tag_id) {
//             // console.log('tag_id :', tag_id);
//             // 根据标签 id 返回数据
//             result.forEach(item => {
//               if (item.tags.indexOf(tag_id) > -1) {
//                 newList.push(item);
//               }
//             });
//             let len = newList.length;
//             responseData.count = len;
//             responseData.list = newList;
//           } else if (article) {
//             const archiveList = []
//             let obj = {}
//             // 按年份归档 文章数组
//             result.forEach((e) => {
//               let year = e.create_time.getFullYear()
//               // let month = e.create_time.getMonth()
//               if(!obj[year]){
//                 obj[year] = []
//                 obj[year].push(e)
//               } else {
//                 obj[year].push(e)
//               }
//             })
//             for (const key in obj) {
//               if (obj.hasOwnProperty(key)) {
//                 const element = obj[key];
//                 let item = {}
//                 item.year = key
//                 item.list = element
//                 archiveList.push(item)
//               }
//             }
//             archiveList.sort((a, b) => {
//               return b.year - a.year;
//             });
//             responseData.list = archiveList;
//           }
//           else {
//             responseData.list = result;
//           }
//           responseClient(res, 200, 0, '操作成功！', responseData);
//         }
//       });
//     }
//   });
// };