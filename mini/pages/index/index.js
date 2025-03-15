const app = getApp();
const utils = require("../../utils/utils.js");
const log = require('../../utils/log.js');
let vAd = null;
let iAd = null;
let hasLoadvAd = false;
let hasLoadiAd = false;
let tempPage = null;

Page({
  /**
   * 页面的初始数据
   * 文章列表结构如下：
   * "id": "visit.md", 文件名称，需和资源名称对应
   * "category": "projects", 类目，需和文件夹名称对应
   * "name": "豆子碎片项目介绍", 列表标题，展示在小程序中
   * "kw": "豆子碎片，visit，小程序", 关键字，搜索时用到
   * "label": "md"，标签，区分功能使用
   * "lock": 0，加锁标记，为1时需要看广告
   * "extinfo": "{}"，扩展信息，每个功能单独定义
   */
  data: {
    isShowContact: false,
    artList: [], // 文章列表
    kwList: [], // 推荐关键词列表，最多3个
    inputShowed: false,
    inputVal: "",
    keyword: "",
    index: 0,
    pages: 0,
    page: 1,
    op: 1, // 1 搜索查询 2 按目录查询 
    category: '', // 1 开发环境 2 组件开发 3 接口集成 4 项目实战 5 调试测试 6 审核上线 7 运营推广 8 维护优化 9 我的项目

  },

  bindShowContact() {
    this.setData({
      isShowContact: !this.data.isShowContact
    });
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
      kwList: [],
    });
  },

  inputTyping: function (e) {
    const content = e.detail.value;
    if (!utils.isEmpty(content)) {
      const searchList = utils.searchRandListByKeyword3(app.globalData.artData, e.detail.value);
      this.setData({
        inputVal: e.detail.value,
        kwList: searchList
      });
    } else {
      this.setData({
        inputVal: '',
        kwList: []
      })
    }
  },

  selectKeyword(e) {
    const keyword = e.currentTarget.dataset.kw;
    this.setData({
      inputVal: keyword,

    })
    this.search(keyword)
  },

  bindSearch(e) {
    const keyword = this.data.inputVal;
    this.search(keyword)
  },

  search(keyword) {
    if (utils.isEmpty(keyword)) {
      wx.showToast({
        title: '内容不能为空',
      })
      return
    }
    const kw = keyword.toLowerCase();
    this.setData({
      kwList: [],
      keyword: kw,
      op: 1,
    })
    this.searchArt(1, kw)
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
    // let category = "projects";
    // switch (btnId) {
    //   case "btnProject":
    //     // 我的项目
    //     category = "projects";
    //     break;
    //   case "btnProtocol":
    //     // RFC协议
    //     category = "protocols";
    //     break;
    //   case "btnCode":
    //     // 编程语言
    //     category = "languages";
    //     break;
    //   case "btnDB":
    //     // 数据库
    //     category = "databases";
    //     break;
    //   case "btnLib":
    //     // 开源编程库
    //     category = "libs";
    //     break;
    //   case "btnTool":
    //     // 常用工具
    //     category = "tools";
    //     break;
    //   case "btnMiddleware":
    //     // 中间件
    //     category = "middlewares";
    //     break;
    //   case "btnEnvironment":
    //     // 主机环境
    //     category = "environments";
    //     break;
    //   case "btnTechSrc":
    //     // 知识片段
    //     category = "techsrcs";
    //     break;
    //   default:
    //     break;
    // }
    this.setData({
      artList: [],
      category: btnId,
      op: 2,
    })
    this.getArtList(1, btnId)
  },

  // 根据类型查询
  getArtList: function (pageNo, category) {
    const that = this
    that.loading = true
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true,
    // })

    if (pageNo === 1) {
      that.setData({
        artList: [],
      })
    }

    // console.log('artData,',app.globalData.artData);
    const searchList = utils.getArtListByCategory(app.globalData.artData, category);
    // console.log('btnList,', searchList);
    // wx.hideLoading()
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

  // // 跳转到文章页面
  // jump: function (e) {
  //   const that = this;
  //   // 获取索引
  //   const idx = e.currentTarget.dataset.idx;
  //   // 获取某篇文章信息
  //   const art = that.data.artList[idx];
  //   // console.log('art,',art)
  //   // 判断今天是否观看了广告？
  //   const isSeeAd = app.canPlayAd();
  //   if (!isSeeAd && (art.category != 'projects')) {
  //     // 弹出对话框，告知用户需要观看广告。
  //     wx.showModal({
  //       title: '支持作者',
  //       content: '亲爱的用户您好，我们创作了很多优质内容。您一天只需看一个激励视频广告，即可浏览任意文章，感谢您的理解和支持！',
  //       confirmText: '观看广告',
  //       cancelText: '以后再说',
  //       success(res) {
  //         if (res.confirm) {
  //           console.log('用户点击观看广告');
  //           // 记录页面
  //           const tp = {
  //             'category': art.category,
  //             'id': art.id,
  //             'label': art.label,
  //           }
  //           that.tempPage = tp;
  //           that.playvAd();
  //         } else if (res.cancel) {
  //           console.log('用户点击以后再说');
  //         }
  //       }
  //     })
  //     return
  //   }

  //   if (art.label == "md" || art.label == "html") {
  //     that.jumpToPage(art.category, art.id, art.label);
  //   } else if (art.label == "gzh") {
  //     that.jumpToGzh(art.id);
  //   } else if (art.label == "mp") {
  //     that.jumpToMiniApp(art.id);
  //   }
  // },

  // // 跳转到文章页面
  // jump: function (e) {
  //   const that = this;
  //   // 获取索引
  //   const idx = e.currentTarget.dataset.idx;
  //   // 获取某篇文章信息
  //   const art = that.data.artList[idx];
  //   // 加锁标记
  //   if (art.lock == 1) {
  //     const isSeeAd = app.needSeeAd();
  //     if (isSeeAd) {
  //       // 弹出对话框，告知用户需要观看广告。
  //       wx.showModal({
  //         title: '支持作者',
  //         content: '观看广告，解锁优质文章',
  //         confirmText: '观看广告',
  //         cancelText: '以后再说',
  //         success(res) {
  //           if (res.confirm) {
  //             console.log('用户点击观看广告');
  //             // 记录页面
  //             const tp = {
  //               'category': art.category,
  //               'id': art.id,
  //               'label': art.label,
  //             }
  //             tempPage = tp;
  //             console.log(tempPage);
  //             that.playvAd();
  //           } else if (res.cancel) {
  //             console.log('用户点击以后再说');
  //           }
  //         }
  //       })
  //       return
  //     } else {
  //       app.onReadLockArt();
  //     }
  //   }

  //   if (art.label == "md" || art.label == "html") {
  //     that.jumpToPage(art.category, art.id, art.label);
  //   } else if (art.label == "gzh") {
  //     that.jumpToGzh(art.id);
  //   } else if (art.label == "mp") {
  //     that.jumpToMiniApp(art.id);
  //   }
  // },

  // 跳转到文章页面
  jump: function (e) {
    const that = this;
    // 获取索引
    const idx = e.currentTarget.dataset.idx;
    // 获取某篇文章信息
    const art = that.data.artList[idx];

    // 看
    let isSeeAd = false;
    if (art.label == "md") {
      if (art.lock) {
        isSeeAd = true;
        console.log('加锁文章必须看广告，用于获得豆子点数')
      } else {
        if (Number(art.grade) > 0) {
          isSeeAd = app.needSeeAd(5 * art.grade);
        } else {
          isSeeAd = app.needSeeAd(1);
        }
      }
    }

    if (isSeeAd) {
      // 弹出对话框，告知用户需要观看广告。
      wx.showModal({
        title: '支持作者',
        content: '观看广告，浏览文章',
        confirmText: '观看广告',
        cancelText: '以后再说',
        success(res) {
          if (res.confirm) {
            console.log('用户点击观看广告');
            // 记录页面
            const tp = {
              'category': art.category,
              'id': art.id,
              'label': art.label,
            }
            tempPage = tp;
            console.log(tempPage);
            that.playvAd();
          } else if (res.cancel) {
            console.log('用户点击以后再说');
          }
        }
      })
      return
    }

    // 扣
    if (art.label == "md") {
      if (art.lock) {
        console.log('加锁文章不扣点数')
      } else {
        if (Number(art.grade) > 0) {
          app.onReadLevelArt(art.grade);
        } else {
          app.onReadCommArt();
        }
      }
    }

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
        success: res => {},
        fail: res => {}
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
      }
    }, 100)
  },

  // 跳文章页面
  jumpToPage: function (category, id, label) {
    // 调整到文章页面 
    wx.navigateTo({
      url: '../article/index?id=' + id + '&category=' + category + '&label=' + label,
    })
  },

  // 加载激励视频广告
  loadvAd() {
    const that = this;
    vAd = wx.createRewardedVideoAd({
      adUnitId: 'adunit-2ce6db3cb1e45a86',
    })
    vAd.onLoad(() => {
        hasLoadvAd = true
      }),
      vAd.onError((err) => {
        console.error('激励视频广告加载失败,', err)
        log.error('load video error,', err);
        // 判断err是否对象？
        const content = JSON.stringify(err);
        const title = 'Visit加载激励视频广告时错误';
        app.rptErrInfo(title, content);
      }),
      vAd.onClose((res) => {
        if (res && res.isEnded) {
          app.onWatchAd();
          const title = 'Visit播放激励视频广告';
          const content = 'Index文件playvAd函数';
          app.rptNotifyInfo(title, content);
          log.info('visit user watch ad');
          that.delayJumpPage();
          // wx.showToast({
          //   title: '谢谢支持！',
          // })
        } else {
          wx.showToast({
            title: '还需加油哟！',
          })
        }
      })
  },

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

  // 播放激励视频广告
  playvAd() {
    wx.showLoading({
      title: '加载广告中',
      mask: true,
    })
    const that = this;

    // console.log('aa', hasLoadAd);
    if (!hasLoadvAd) {
      // 还未加载广告，则先加载广告，这是广告的核心点，如果直接在OnLoad方法中调用，页面会有卡顿现象。
      that.loadvAd();
    }
    // 用户触发广告后，显示激励视频广告
    if (vAd) {
      vAd.show().then(() => {
        wx.hideLoading()
      }).catch(() => {
        // 失败重试
        vAd.load().then(() => {
            wx.hideLoading()
            vAd.show()
          })
          .catch(err => {
            wx.hideLoading()
            console.error('激励视频 广告显示失败', err)
            log.error('play video error,', err);
            const title = 'Visit展示激励视频广告时错误';
            const content = JSON.stringify(err);
            app.rptErrInfo(title, content);
            wx.showToast({
              title: '请稍后重试',
            })
          })
      })
    } else {
      log.error('load video fail');
      const title = 'Visit激励视频广告播放异常';
      const content = '激励视频广告在播放广告时未完成初始化';
      app.rptErrInfo(title, content);
      wx.hideLoading()
      wx.showToast({
        title: '请稍后重试',
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
      iAd.show().then(() => {}).catch((err) => {
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

  // 公众号组件加载成功信息
  bload(e) {
    // console.log('load,', e)
  },

  // 公众号组件加载错误信息
  berror(e) {
    // console.log('error,', e)
    // const title = 'Visit加载公众号组件';
    // const content = 'Index文件berror函数';
    // app.rptNotifyInfo(title, content);
  },

  // 联系我
  showContactDialog() {
    const that = this;
    // const title = 'Visit查看联系方式';
    // const content = 'Index文件showContactDialog函数';
    // app.rptNotifyInfo(title, content);

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
    hasLoadvAd = false;
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

  }
})