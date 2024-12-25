// pages/mkart/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: {}, // 内容数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    wx.showLoading({
      title: '加载中...',
    })
    console.log(options);
    let url = 'https://gitee.com/littletow/visit/raw/master/content/'+'languages/go.md';
    wx.downloadFile({
      url: url, 
      success (res) {
        wx.hideLoading();
        console.log(res)
        if (res.statusCode === 200) {
          const tmpfile = res.tempFilePath;
          const fs = wx.getFileSystemManager()
          fs.readFile({
            filePath:tmpfile,
            encoding: 'utf8',
            success(res) {
              console.log(res.data)
              let obj = app.towxml(res.data, 'markdown', {
                theme: 'light',
                events: {
                  tap: (e) => {
                    console.log('tap', e);
                  }
                }
              });
      
              that.setData({
                article: obj,
              });      
            },
          })
          
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})