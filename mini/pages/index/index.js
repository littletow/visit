const app = getApp();
const utils = require("../../utils/utils.js");

let vAd = null;
let hasLoadAd = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    artList: [],
    inputShowed: false,
    inputVal: "",
    keyword: "",
    index: 0,
    pages: 0,
    page: 1,
    op: 1, // 1 搜索查询 2 按目录查询 
    category: '', // 1 我的项目 2 RFC 协议 3 编程语言 4 数据库 5 开源编程库 6 常用工具
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      keyword: "",
      artList: [],
    });
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  search(e) {
    var keyword = this.data.inputVal.toLowerCase()
    this.setData({
      keyword: keyword,
      op: 1,
    })
    this.searchArt(1, keyword)
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

    // console.log('artData,',app.globalData.artData);
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

  bindBtn: function (e) {
    let btnId = e.target.id;
    let category = "projects";
    switch (btnId) {
      case "btnProject":
        // 我的项目
        category = "projects";
        break;
      case "btnProtocol":
        // RFC协议
        category = "protocols";
        break;
      case "btnCode":
        // 编程语言
        category = "languages";
        break;
      case "btnDB":
        // 数据库
        category = "databases";
        break;
      case "btnLib":
        // 开源编程库
        category = "libs";
        break;
      case "btnTool":
        // 常用工具
        category = "tools";
        break;
      default:
        break;
    }
    this.setData({
      artList: [],
      category: category,
      op: 2,
    })
    this.getArtList(1, category)
  },

  // 根据类型查询
  getArtList: function (pageNo, category) {
    const that = this
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

    // console.log('artData,',app.globalData.artData);
    const searchList = utils.getArtListByCategory(app.globalData.artData, category);
    // console.log('btnList,', searchList);
    wx.hideLoading()
    if (utils.isEmpty(searchList)) {
      // 记录为空
      const title = '快捷按钮查询内容为空';
      const content = 'quick button search article is empty';
      app.rptErrInfo(title, content);
      wx.showToast({
        title: '下拉刷新试试',
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
    // 判断今天是否观看了广告？
    const isSeeAd = app.canPlayAd();
    if (!isSeeAd) {
      // 弹出对话框，告知用户需要观看广告。
      wx.showModal({
        title: '提示',
        content: '一天只需看一个广告，文章即可任意浏览',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.playAd();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    // 获取索引
    const idx = e.currentTarget.dataset.idx;
    // 获取某篇文章信息
    const art = that.data.artList[idx];
    if (art.label == "md") {
      that.jumpToPage(art.category, art.id);
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
    wx.openOfficialAccountArticle({
      url: id, // 公众号文章连接
      success: res => {
      },
      fail: res => {
      }
    })
  },

  // 跳文章页面
  jumpToPage: function (category, id) {
    // 调整到文章页面 
    wx.navigateTo({
      url: '../article/index?id=' + id + '&category=' + category,
    })
  },


  loadAd() {
    const that = this;
    vAd = wx.createRewardedVideoAd({
      adUnitId: 'adunit-2ce6db3cb1e45a86',
    })
    vAd.onLoad(() => {
      hasLoadAd = true
    }),
      vAd.onError((err) => {
        console.error('激励视频广告加载失败,', err)
        // 判断err是否对象？
        const content =JSON.stringify(err);
        const title = '加载激励视频广告时错误';
        app.rptErrInfo(title, content);

      }),
      vAd.onClose((res) => {
        if (res && res.isEnded) {
          app.logSeeAd();
          wx.showToast({
            title: '谢谢支持！',
          })
        } else {
          wx.showToast({
            title: '还需加油哟！',
          })
        }
      })
  },

  playAd() {
    wx.showLoading({
      title: '加载广告中',
    })
    const that = this;
    // console.log('aa', hasLoadAd);
    if (!hasLoadAd) {
      // 还未加载广告，则先加载广告，这是广告的核心点，如果直接在OnLoad方法中调用，页面会有卡顿现象。
      that.loadAd();
    }
    // 用户触发广告后，显示激励视频广告
    if (vAd) {
      vAd.show().then(() => [
        wx.hideLoading()
      ]).catch(() => {
        // 失败重试
        vAd.load()
          .then(() => {
            wx.hideLoading()
            vAd.show()
          })
          .catch(err => {
            const title = '展示激励视频广告时错误';
            const content =JSON.stringify(err);
            app.rptErrInfo(title, content);
            wx.hideLoading()
            wx.showToast({
              title: '请重试一次',
            })
            console.error('激励视频 广告显示失败', err)
          })
      })
    } else {
      console.log('playAd 函数ad对象为空');
      const title = '播放激励视频广告时错误';
      const content = 'playAd 函数ad对象为空';
      app.rptErrInfo(title, content);
      wx.hideLoading()
      // 未加载到广告，需要稍后再试。
      wx.showToast({
        title: '请稍后重试',
      })
    }
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
    vAd = null;
    hasLoadAd = false;
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

  }
})