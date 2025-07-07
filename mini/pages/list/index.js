// pages/list/index.js
const app = getApp();
const utils = require("../../utils/utils.js");
const log = require('../../utils/log.js');
const config = require('../../config/config.js');

Page({
  data: {
    artList: [],
    pages: 0,
    page: 1,
    op: 0,
    jid: 0,
    category: '',
    keyword: '',
    introList: config.introList,
    title: '',
    desc: '',
    loading: false,
    noMore: false,
  },

  async getArtList(pageNo, reload = false) {
    if (this.data.loading || this.data.noMore) return;
    this.setData({ loading: true });

    let searchList = [];
    if (this.data.op == 1) {
      searchList = utils.getArtListByKeyword(app.globalData.artData, this.data.keyword);
    } else if (this.data.op == 2) {
      searchList = utils.getArtListByCategory(app.globalData.artData, this.data.category);
    } else {
      this.setData({ loading: false });
      app.showErrMsgDelay('出现错误请反馈');
      return;
    }

    if (utils.isEmpty(searchList)) {
      if (this.data.op == 2) {
        log.info('文章内容为空');
        const title = '获取文章内容为空';
        const content = '查询文章列表时内容为空';
        app.rptErrInfo(title, content);
      }
      this.setData({ artList: [], loading: false, noMore: true, pages: 0 });
      return;
    }

    const pageSize = 8;
    const total = searchList.length;
    const pages = Math.ceil(total / pageSize);

    const articles = utils.paginate(searchList, pageSize, pageNo);

    this.setData({
      page: pageNo,
      pages,
      artList: reload ? articles : this.data.artList.concat(articles),
      loading: false,
      noMore: pageNo >= pages
    });
  },

  async loadMore() {
    if (this.data.loading || this.data.noMore) return;
    await this.getArtList(this.data.page + 1);
  },

  jump(e) {
    const idx = e.currentTarget.dataset.idx;
    const art = this.data.artList[idx];
    this.jumpToPage(art.category, art.id, art.label);
  },

  jumpToPage(category, id, label) {
    wx.navigateTo({
      url: `../article/index?id=${id}&category=${category}&label=${label}`,
    });
  },

  onLoad(options) {
    const op = options.op;
    const jid = Number(options.jid);
    const category = options.category;
    const keyword = options.keyword;
    const item = this.data.introList[jid];
    this.setData({
      title: item.title,
      desc: item.desc,
      op: op,
      jid: jid,
      category: category,
      keyword: keyword,
    });
    this.getArtList(1, true);
  },

  onReachBottom() {
    this.loadMore();
  },

  onShareAppMessage() { }
});