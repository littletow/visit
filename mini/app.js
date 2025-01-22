const utils = require("./utils/utils.js");
const fallbackUrl = "https://bee.91demo.top/";
const mainUrl = "https://gitee.com/littletow/visit/raw/master/content/";

App({
  towxml: require('./towxml/index'),
  getText: (url, callback) => {
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (typeof callback === 'function') {
          callback(res);
        };
      }
    });
  },

  // 本地缓存中记录设备信息
  logDevInfo: function () {
    const that = this;
    const deviceInfo = wx.getDeviceInfo();
    const appBaseInfo = wx.getAppBaseInfo();
    const windowInfo = wx.getWindowInfo();

    const devInfoObj = {
      devInfo: deviceInfo,
      appInfo: appBaseInfo,
      winInfo: windowInfo,
    }

    const devinfo = JSON.stringify(devInfoObj);
    wx.setStorageSync('devInfo', devinfo);
  },

  // 上报错误信息
  rptErrInfo: function (title, content) {
    const that = this;
    let devinfo = '';
    const locDevInfo = wx.getStorageSync("devInfo");
    if (!utils.isEmpty(locDevInfo)) {
      devinfo = locDevInfo;
    }
    const uptime = utils.getNowStr();
    wx.request({
      url: 'https://mp.91demo.top/mp/rptInfo', // 请求的URL
      method: 'POST', // 请求方法
      data: {
        rtype: 2, // 错误
        robj: 1, // 本项目
        title: title,
        devinfo: devinfo, // 设备信息
        content: content, // 上报内容
        uptime: uptime,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // 请求成功的回调函数
        // console.log('数据提交成功:', res.data);
        // 可以在此处对数据进行处理
        if (res.data.code != 1) {
          console.log('上报失败,', res.data);
        }
      },
      fail: function (err) {
        // 请求失败的回调函数
        console.error('数据提交失败:', err);
      },
      complete: function () {
        // 请求完成的回调函数（成功或失败都会执行）
        console.log('请求完成');
      }
    });

  },

  // 写入文件
  writeDataFile: function (data) {
    const that = this;
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/data.json`;
    // 会覆盖写入
    fs.writeFile({
      filePath: filePath,
      data: data,
      encoding: 'utf8',
      success: res => {
        // console.log('write file success')
      },
      fail: err => {
        console.error('write file error,', err)
        const title = '写入本地用户文件错误';
        const content = JSON.stringify(err.errMsg);
        // console.log('content,',content);
        that.rptErrInfo(title, content);
      }
    })
  },
  // 读取文件
  readDataFile: function () {
    const fs = wx.getFileSystemManager();
    // 同步接口
    try {
      const res = fs.readFileSync(`${wx.env.USER_DATA_PATH}/data.json`, 'utf8', 0)
      // console.log(res)
      return res;
    } catch (e) {
      console.error(e)
      return "";
    }
  },

  // 下载 data.json 文件
  dlArtData: function () {
    const that = this;
    // 下载数据动画
    wx.showLoading({
      title: '数据加载中..',
    })
    let fileUrl = that.globalData.url + "data.json"
    utils.downloadFile(
      fileUrl,
      10000, // 超时时间10秒
      (tmpfile) => {
        // console.log('Download successful, file saved at:', tmpfile);
        // 可以在这里对下载的文件进行进一步处理
        // 下载成功后，会存储为临时文件，需要使用微信API读取文件内容。
        const fs = wx.getFileSystemManager()
        fs.readFile({
          filePath: tmpfile,
          encoding: 'utf8',
          success(res) {
            // console.log('版本12');
            // 取消动画
            wx.hideLoading({
              success: (res) => { },
            })
            // console.log(res.data)
            // 记录到本地缓存
            // wx.setStorageSync('artData', res.data);
            // 记录到本地用户文件
            that.writeDataFile(res.data);
            const dataList = utils.json2ObjArr(res.data);
            that.globalData.artData = dataList;
          },
        })
      },
      (err) => {
        console.error('Download failed:', err.message);
        wx.hideLoading({
          success: (res) => { },
        })
        const title = '下载data.json文件错误';
        const content = JSON.stringify(err.message);
        // console.log('content,',content);
        that.rptErrInfo(title, content);
      },
    );
  },

  // 下载 article version 文件
  dlArtVersion: function () {
    const that = this;
    // 下载版本号加载动画
    wx.showLoading({
      title: '版本检测中..',
    })

    // 下载文件
    let fileUrl = that.globalData.url + "VERSION"
    utils.downloadFile(
      fileUrl,
      5000, // 超时时间5秒
      (tmpfile) => {
        // console.log('Download successful, file saved at:', tmpfile);
        // 可以在这里对下载的文件进行进一步处理
        // 下载成功后，会存储为临时文件，需要使用微信API读取文件内容。
        const fs = wx.getFileSystemManager()
        fs.readFile({
          filePath: tmpfile,
          encoding: 'utf8',
          success(res) {
            let now = Date.now();
            wx.setStorageSync('chkVerTs', now);
            // 取消动画
            wx.hideLoading({
              success: (res) => { },
            })
            // console.log(res.data)
            const onlineVersion = Number(res.data);
            // 查看本地版本号
            const artVer = wx.getStorageSync("artVer");
            if (utils.isEmpty(artVer)) {
              // console.log('版本9');
              // 记录到本地缓存
              wx.setStorageSync('artVer', res.data);
              // 下载文章数据
              that.dlArtData();
            } else {
              // console.log('版本10');
              const localVersion = Number(artVer);
              // console.log('调试',localVersion,onlineVersion);
              // 和线上进行对比，需要升级则重新下载数据
              if (localVersion < onlineVersion) {
                // console.log('版本11');
                wx.setStorageSync('artVer', res.data);
                // 下载文章数据
                that.dlArtData();
              } else {
                // console.log('版本21');
                that.getArtData();
              }
            }
          },
        })
      },
      (err) => {
        console.error('Download failed:', err.message);
        wx.hideLoading({
          success: (res) => { },
        })
        const title = '下载VERSION文件错误';
        const content= JSON.stringify(err.message);
        that.rptErrInfo(title, content);
      },
    );
  },

  getArtData() {
    const that = this;
    const fileArtData = that.readDataFile(); // 从用户文件中获取
    //  console.log(artData);
    if (!utils.isEmpty(fileArtData)) {
      // console.log('版本4');
      const fileDataList = utils.json2ObjArr(fileArtData);
      that.globalData.artData = fileDataList;
    } else {
      // console.log('版本5');
      // 兼容以前版本
      const cacheArtData = wx.getStorageSync("artData");// 从缓存中获取
      // 修复bug，如果缓存为空，会直接赋予空值
      if (!utils.isEmpty(cacheArtData)) {
        // console.log('版本6');
        const cacheDataList = utils.json2ObjArr(cacheArtData);
        that.globalData.artData = cacheDataList;
      } else {
        console.log('没有获取到文章数据');
        // 都没有数据，上报查找原因
        const title = '获取本地文章数据错误';
        const content = '本地用户目录和缓存都没有文章数据';
        that.rptErrInfo(title, content);
      }
    }
  },

  // canPlayAd 是否需要观看广告？ 每日看一次即可。
  canPlayAd: function () {
    return this.globalData.isSeeAd
  },

  // logSeeAd 记录看广告？  
  logSeeAd: function () {
    let now = Date.now();
    wx.setStorageSync('seeAdTs', now);
    this.globalData.isSeeAd = true;
  },

  // 检查Git服务器是否通畅？
  async chkServerAlive() {
    const that = this;
    wx.showLoading({
      title: '服务检测中..',
    })
    try {
      // 使用 await 等待异步函数执行完成
      let serverUrl = mainUrl + 'VERSION';
      const data = await utils.checkServerAccessibility(serverUrl, 3000);
      console.log("data,", data);
    } catch (err) {
      console.error("Error:", err.message);
      that.globalData.url = fallbackUrl;
      const title = '检查Git服务器不通';
      const content = JSON.stringify(err.message)
      that.rptErrInfo(title, content);
    }
    wx.hideLoading({
      success: (res) => { },
    })
  },

  async login() {
    const that = this;
    // 检查设备信息
    let devInfo = wx.getStorageSync("devInfo");
    if (utils.isEmpty(devInfo)) {
      that.logDevInfo();
    }
    // 检查服务是否正常？
    await that.chkServerAlive();
    // console.log('url,',that.globalData.url);
    // 检查版本更新
    let chkVerTs = wx.getStorageSync("chkVerTs");
    if (!utils.isEmpty(chkVerTs)) {
      // console.log('版本1');
      let chkVerTsNum = Number(chkVerTs);
      let tzms = utils.getTodayZeroMsTime(); // 获取今日零时毫秒时间戳
      if (chkVerTsNum < tzms) {
        // console.log('版本2');
        that.dlArtVersion();
      } else {
        // console.log('版本3');
        that.getArtData();
      }
    } else {
      // console.log('版本7');
      that.dlArtVersion();
    }

    // 检查广告
    let seeAdTs = wx.getStorageSync("seeAdTs");
    if (!utils.isEmpty(seeAdTs)) {
      let seeAdTsNum = Number(seeAdTs);
      let tzms = utils.getTodayZeroMsTime(); // 获取今日零时毫秒时间戳
      if (seeAdTsNum > tzms) {
        that.globalData.isSeeAd = true; // 今天是否看了广告？
      }
    }
  },

  // 小程序每次启动都会调用
  onLaunch: function () {
    const startTime = Date.now();
    this.globalData.startTime = startTime;
    this.login();
    const loginTime = Date.now();
    const launchTime = loginTime - startTime;
    console.log(`app onLaunch: ${launchTime} ms`);
  },

  globalData: {
    url: mainUrl,
    startTime: 0,
    isSeeAd: false, // 是否看了广告？
    artData: [], // 文章数据列表
  },

});