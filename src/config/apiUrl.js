// let ipUrl = 'http://127.0.0.1:7001/admin/'//本地
let ipUrl = 'http://47.113.118.154/admin/'//云服务器（线上）

let servPath = {

  //检查用户名密码
  checkLogin: ipUrl + 'checkLogin',
  //获得文章类别信息
  getTypeInfo: ipUrl + 'getTypeInfo',
  //发布文章 接口
  addArticle: ipUrl + 'addArticle',
  //发布文章 接口
  updateArticle: ipUrl + 'updateArticle',
  //文章列表
  getArticleList: ipUrl + 'getArticleList',
  //删除文章
  delArticle: ipUrl + 'delArticle/',
  //根据ID获得文章详情(用于修改文章)
  getArticleById: ipUrl + 'getArticleById/',

}

export default servPath;