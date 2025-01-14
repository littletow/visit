const utils = require("./utils/utils.js");

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

  // 写入文件
  writeDataFile: function (data) {
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/data.json`;
    fs.writeFile({
      filePath: filePath,
      data: data,
      encoding: 'utf8',
      success: res => {
        console.log('write file success')
      },
      fail: err => {
        console.error('write file error,', err)
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
    wx.downloadFile({
      url: 'https://gitee.com/littletow/visit/raw/master/content/data.json',
      success(res) {
        // console.log(res)
        if (res.statusCode === 200) {
          // 下载成功后，会存储为临时文件，需要使用微信API读取文件内容。
          const tmpfile = res.tempFilePath;
          const fs = wx.getFileSystemManager()
          fs.readFile({
            filePath: tmpfile,
            encoding: 'utf8',
            success(res) {
              // 取消动画
              wx.hideLoading({
                success: (res) => {},
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
        }
      }
    })
  },

  // 下载 article version 文件
  dlArtVersion: function () {
    const that = this;
    // 下载版本号加载动画
    wx.showLoading({
      title: '版本检测中..',
    })
    wx.downloadFile({
      url: 'https://gitee.com/littletow/visit/raw/master/content/VERSION',
      success(res) {
        // console.log(res)
        if (res.statusCode === 200) {
          // 下载成功后，会存储为临时文件，需要使用微信API读取文件内容。
          const tmpfile = res.tempFilePath;
          const fs = wx.getFileSystemManager()
          fs.readFile({
            filePath: tmpfile,
            encoding: 'utf8',
            success(res) {
              let now = Date.now();
              wx.setStorageSync('chkVerTs', now);
              // 取消动画
              wx.hideLoading({
                success: (res) => {},
              })
              // console.log(res.data)
              const onlineVersion = Number(res.data);
              // 查看本地版本号
              const artVer = wx.getStorageSync("artVer");
              if (utils.isEmpty(artVer)) {
                // 记录到本地缓存
                wx.setStorageSync('artVer', res.data);
                // 下载文章数据
                that.dlArtData();
              } else {
                const localVersion = Number(artVer);
                // console.log('调试',localVersion,onlineVersion);
                // 和线上进行对比，需要升级则重新下载数据
                if (localVersion < onlineVersion) {
                  // 下载文章数据
                  that.dlArtData();
                }
              }
            },
          })
        }
      }
    })
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

  login() {
    const that = this;

    // 检查版本更新
    let chkVerTs = wx.getStorageSync("chkVerTs");
    if (!utils.isEmpty(chkVerTs)) {
      let chkVerTsNum = Number(chkVerTs);
      let tzms = utils.getTodayZeroMsTime(); // 获取今日零时毫秒时间戳
      if (chkVerTsNum < tzms) {
        that.dlArtVersion();
      }else{
         // let artData = wx.getStorageSync("artData");// 从缓存中获取
         let artData = that.readDataFile(); // 从用户文件中获取
        //  console.log(artData);
         if (!utils.isEmpty(artData)) {
           const dataList = utils.json2ObjArr(artData);
           that.globalData.artData = dataList;
         }
      }
    } else {
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
    this.login();
  },

  globalData: {
    isSeeAd: false, // 是否看了广告？
    artData: [], // 文章数据列表
  },

});