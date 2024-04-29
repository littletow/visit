// pages/myicode/index.js
const app = getApp();
import { httpGet, httpPost } from '../../utils/utils.js';
let videoAd = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    
  },
 
  geticode(){
    const that = this;
    wx.showLoading({
      title: '获取卡片信息',
    })

    httpGet('/myICode', {}).then((res) => {
      wx.hideLoading()
      const result = res.data;
      if (result.code == 1) {
        let content = result.data;
        console.log(content);
      }
    }).catch((err) => {
      console.log(err);
      wx.hideLoading()
      wx.showToast({
        title: '网络异常请重试',
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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