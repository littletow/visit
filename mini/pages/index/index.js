const app = getApp();
const utils = require("../../utils/utils.js");
const log = require('../../utils/log.js');
const config = require('../../config/config.js');
const messages = require('../../config/messages.js');

let iAd = null;
let hasLoadiAd = false;
let tempPage = null;


Page({
  data: {
    inputShowed: false,
    inputVal: "",
    index: 0,
    pages: 0,
    page: 1,
    op: 1, // 1 搜索查询 2 按目录查询 
    jid: 0, // 跳转选项
    keyword: "", // 搜索内容
    category: '', // 类目
    categoryConfig: config.categoryConfig,
    vtitle: config.vtitle,
    vdesc: config.vdesc,
    devmsg: "加载中...",
    previousIndex: -1 // 记录上一次的索引
  },

  adLoad() {
    console.log('原生模板广告加载成功')
  },
  adError(err) {
    console.error('原生模板广告加载失败', err)
  },
  adClose() {
    console.log('原生模板广告关闭')
  },

  searchArt: function (pageNo, keyword) {
    const that = this;
    that.loading = true
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    if (pageNo === 1) {
      that.setData({
        artList: [],
      })
    }

    console.log('artData,', app.globalData.artData);
    const searchList = utils.getArtListByKeyword(app.globalData.artData, keyword);
    // console.log('searchList,', searchList);
    wx.hideLoading()
    if (utils.isEmpty(searchList)) {
      wx.showToast({
        title: '没有找到记录',
      })
    } else {
      const count = searchList.length / 10;
      const articles = utils.paginate(searchList, 10, pageNo);
      that.setData({
        page: pageNo, //当前的页号
        pages: count, //总页数
        artList: that.data.artList.concat(articles)
      })
    }

    that.loading = false
  },

  // 跳转到文章页面
  jump: function (e) {
    const that = this;
    // 获取索引
    const idx = e.currentTarget.dataset.idx;
    // 获取某篇文章信息
    const art = that.data.artList[idx];

    // 跳
    if (art.label == "md" || art.label == "html") {
      that.jumpToPage(art.category, art.id, art.label);
    } else if (art.label == "gzh") {
      that.jumpToGzh(art.id);
    } else if (art.label == "mp") {
      that.jumpToMiniApp(art.id);
    }
  },

  // 跳转到小程序
  jumpToMiniApp: function (id) {
    wx.navigateToMiniProgram({
      appId: id,
      path: '',
      extraData: {},
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },

  // 跳公众号页面
  jumpToGzh: function (id) {
    // 基础库 3.4.8 开始支持，低版本需做兼容处理。
    const sdkVersion = app.globalData.devinfo.appInfo.SDKVersion;
    const cmpver = utils.compareVersion(sdkVersion, '3.4.8');

    if (cmpver < 0) {
      wx.showToast({
        title: '微信版本过低',
      })
    } else {
      wx.openOfficialAccountArticle({
        url: id, // 公众号文章连接
        success: res => { },
        fail: res => { }
      })
    }

  },


  // 延长跳转页面
  delayJumpPage: function () {
    const that = this;
    setTimeout(function () {
      console.log(tempPage);
      if (!utils.isEmpty(tempPage)) {
        that.jumpToPage(tempPage.category, tempPage.id, tempPage.label);
      } else {
        console.log('temp page is null')
        log.error('延迟跳转tempPage为空')
        wx.showToast({
          title: '稍后再试',
        })
      }
    }, 500)
  },

  // 跳文章页面
  jumpToPage: function (category, id, label) {
    // 调整到文章页面 
    wx.navigateTo({
      url: '../article/index?id=' + id + '&category=' + category + '&label=' + label,
    })
  },


  // ======功能
  // 搜索
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
    });
  },


  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
    });
  },

  // 搜索
  bindSearch(e) {
    // console.log('search,', e);
    const keyword = this.data.inputVal;
    if (utils.isEmpty(keyword)) {
      wx.showToast({
        title: '内容不能为空',
      })
      return
    }
    const kw = keyword.toLowerCase();
    this.jumpToListPage(1, 0, '', kw)
    this.hideInput()
  },

  // 快捷按钮
  bindBtn: function (e) {
    // console.log('调试,', e.currentTarget.dataset);
    const idx = e.currentTarget.dataset.idx; // 获取索引
    let jid = idx + 1;
    const category = e.currentTarget.dataset.cid;

    this.jumpToListPage(2, jid, category, '')
  },



  // 跳转到列表页面，op 操作类型 1 搜索框 2 快捷按钮 jid 跳转位置编号
  jumpToListPage: function (op, jid, category, keyword) {
    wx.navigateTo({
      url: '../list/index?op=' + op + '&jid=' + jid + '&category=' + category + '&keyword=' + keyword,
    })
  },

  // =======工具

  // 加载插屏广告
  loadiAd() {
    const that = this;
    // 加载插屏广告
    if (!hasLoadiAd) {
      iAd = wx.createInterstitialAd({
        adUnitId: 'adunit-45d1592a390774a5'
      })
      iAd.onLoad(() => {
        hasLoadiAd = true
      })
      iAd.onError((err) => {
        console.error('插屏广告加载失败', err)
        const content = JSON.stringify(err);
        const title = 'Visit加载插屏广告时错误';
        app.rptErrInfo(title, content);
      })
      iAd.onClose(() => {
        console.log('插屏广告关闭')
      })
    }
  },
  // 播放插屏广告
  playiAd() {
    const that = this;
    // const title = 'Visit播放插屏广告';
    // const content = 'Index文件playiAd函数';
    // app.rptNotifyInfo(title, content);
    // console.log('aa', hasLoadAd);
    if (!hasLoadiAd) {
      // 还未加载广告，则先加载广告。
      that.loadiAd();
    }
    // 用户触发广告后，显示插屏广告
    if (iAd) {
      iAd.show().then(() => { }).catch((err) => {
        console.error('插屏广告显示失败', err)
        log.error('load iad fail');
        const title = 'Visit展示插屏广告时错误';
        const content = JSON.stringify(err);
        app.rptErrInfo(title, content);
      })
    } else {
      const title = 'Visit插屏广告播放异常';
      const content = '插屏广告在播放广告时未完成初始化';
      app.rptErrInfo(title, content);
    }
  },

  // 联系我
  showEmail() {
    const that = this;
    wx.showModal({
      title: '联系我',
      content: '如果您有任何问题或建议，请随时通过以下方式联系我：\n邮箱: eagle.mon@qq.com\n我期待您的来信！',
      confirmText: '好的',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.playiAd();
        }
      }
    });
    // 加载插屏广告
    that.loadiAd();

  },

  // 豆子工具
  jumpToBeanTool: function () {
    wx.vibrateShort({
      type: 'medium',
    })
    wx.navigateToMiniProgram({
      appId: 'yourkey',
      path: '',
      extraData: {},
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },

  // 投诉建议页面
  showSuggest() {
    wx.navigateTo({
      url: '../suggest/index',
    })
  },

  // 分享
  showMe() {
    wx.showToast({
      title: '请点击右上角“…”收藏和分享',
      icon: 'none',
      duration: 2000
    })
  },

  // 设置寄语
  setRandomQuote() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * messages.length);
    } while (messages.length > 1 && newIndex === this.data.previousIndex);

    this.setData({
      devmsg: messages[newIndex],
      previousIndex: newIndex,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("index onload")
    const loadTime = Date.now();
    const startTime = app.globalData.startTime;
    const launchTime = loadTime - startTime;
    console.log(`index onLoad: ${launchTime} ms`);
    // 延迟500ms加载（模拟网络请求或增加悬念感）
    setTimeout(() => {
      this.setRandomQuote();
    }, 500);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("index onunload")
    // 置空可以避免广告报错，无法弹出新广告
    iAd = null;
    hasLoadiAd = false;
    tempPage = null;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("reach bottom")
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    if (this.data.op === 1) {
      if (!this.loading && this.data.page < this.data.pages) {
        this.searchArt(this.data.page + 1, this.data.keyword)
      }
    } else if (this.data.op === 2) {
      if (!this.loading && this.data.page < this.data.pages) {
        this.getArtList(this.data.page + 1, this.data.category)
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      artList: [],
      keyword: "",
      page: 1,
      pages: 0,
      category: '',
    })
    // 停止刷新动画
    wx.stopPullDownRefresh()
    // 检测artData是否为空，为空则下载数据文件
    if (utils.isEmpty(app.globalData.artData)) {
      app.dlArtData();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '豆子积木-带你制作小程序',
      path: '/pages/index/index', // 用户点击后打开的页面路径
      imageUrl: 'https://ants.91demo.top/share.png' // 分享卡片显示的图片
    }
  }
})