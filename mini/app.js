const utils = require("./utils/utils.js");
const log = require('./utils/log.js');

const mainUrl = "https://bee.91demo.top/";
const appDataVersion = "v6"; // 应用数据版本号，现在APP版本号v6.0.0，对应服务器数据文件，例如data_v6.json
const dataFileName = "data_" + appDataVersion + ".json"; // 数据文件，存入文章索引，根据客户端版本进行升级，当客户端的文章索引数据结构变更时才升级此处。
const versionFileName = "VVER"; // VISIT数据版本文件，存入日期字符串，例如20250703，按天更新

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

  // 延长显示提示
  showErrMsgDelay: function (msg) {
    setTimeout(function () {
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 2000,
        mask: true,
      });
    }, 1000)

  },

  // 本地缓存中记录设备信息
  logDevInfo: function () {
    const that = this;
    let devInfo = wx.getStorageSync("devInfo");
    if (utils.isEmpty(devInfo)) {
      const deviceInfo = wx.getDeviceInfo();
      const appBaseInfo = wx.getAppBaseInfo();
      const windowInfo = wx.getWindowInfo();

      const devInfoObj = {
        devInfo: deviceInfo,
        appInfo: appBaseInfo,
        winInfo: windowInfo,
      }

      that.globalData.devinfo = devInfoObj;
      const devinfo = JSON.stringify(devInfoObj);
      wx.setStorageSync('devInfo', devinfo);
    } else {
      const stdevinfo = JSON.parse(devInfo);
      that.globalData.devinfo = stdevinfo;
    }
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

  // 上报通知信息
  rptNotifyInfo: function (title, content) {
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
        rtype: 1, // 通知
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
    const filePath = `${wx.env.USER_DATA_PATH}/` + dataFileName;
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
      const res = fs.readFileSync(`${wx.env.USER_DATA_PATH}/` + dataFileName, 'utf8', 0)
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
    let fileUrl = that.globalData.url + dataFileName
    utils.downloadFile(
      fileUrl,
      20000, // 超时时间20秒
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
        log.error('file url,', fileUrl, 'error message,', err.message);
        wx.hideLoading({
          success: (res) => { },
        })
        const title = '下载data.json文件错误';
        const content = "文件地址：" + fileUrl + "，错误信息：" + JSON.stringify(err.message);
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
      mask: true,
    })

    // 下载文件
    let fileUrl = that.globalData.url + versionFileName
    utils.downloadFile(
      fileUrl,
      10000, // 超时时间10秒
      (tmpfile) => {
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
            const onlineVersion = res.data;
            // 查看本地版本号
            const localVersion = wx.getStorageSync("vver");
            if (utils.isEmpty(localVersion)) {
              // 记录到本地缓存
              wx.setStorageSync('vver', onlineVersion);
              that.dlArtData();
            } else {
              // 和线上进行对比，需要升级则重新下载数据
              if (localVersion !== onlineVersion) {
                wx.setStorageSync('vver', onlineVersion);
                that.dlArtData();
              } else {
                that.getArtData();
              }
            }
          },
        })
      },
      (err) => {
        console.error('Download failed:', err.message);
        log.error('file url,', fileUrl, 'error message,', err.message);
        wx.hideLoading({
          success: (res) => { },
        })
        const title = '下载VERSION文件错误';
        const content = "文件地址：" + fileUrl + "，错误信息：" + JSON.stringify(err.message);
        that.rptErrInfo(title, content);
      },
    );
  },

  getArtData() {
    const that = this;
    const fileArtData = that.readDataFile(); // 从用户文件中获取
    if (!utils.isEmpty(fileArtData)) {
      const fileDataList = utils.json2ObjArr(fileArtData);
      that.globalData.artData = fileDataList;
    } else {
      that.dlArtData();
      // 都没有数据，上报查找原因
      const title = '没有找到本地用户文件';
      const content = '本地用户目录没有文章数据，重新下载';
      that.rptErrInfo(title, content);
    }
  },

  // 更新版本
  uptVer(zerots) {
    // 一天更新一次
    const that = this;
    let chkVerTs = wx.getStorageSync("chkVerTs");
    if (!utils.isEmpty(chkVerTs)) {
      let chkVerTsNum = Number(chkVerTs);
      if (chkVerTsNum < zerots) {
        that.dlArtVersion();
      } else {
        that.getArtData();
      }
    } else {
      that.dlArtVersion();
      const title = 'Visit新设备登入';
      const content = 'App文件login函数';
      that.rptNotifyInfo(title, content);
    }
  },

  // 登入
  async login() {
    const that = this;
    const tzms = utils.getTodayZeroMsTime(); // 获取今日零时毫秒时间戳
    // 检查设备信息?
    that.logDevInfo();
    // 检查版本更新?
    that.uptVer(tzms);
    // console.log('artdata,',that.globalData.artData)
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

  onError(err) {
    // 在发生错误时记录错误日志
    log.error("App error", err);
  },

  globalData: {
    url: mainUrl, // 当前URL
    devinfo: null, // 设备信息
    startTime: 0, // 首次启动时间戳
    artData: [], // 文章数据列表
  },

});