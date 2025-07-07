// pages/mkart/index.js
const app = getApp();
const utils = require("../../utils/utils.js");
const log = require('../../utils/log.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFallback: false,
    isLoading: true,
    article: {}, // 内容数据
  },

  /*
   文章列表中有超链接，则点击时将内容获取出来，并使用对话框显示出来。
   对话框中的内容可以复制到剪切板。
  */

  // 加载文章资源
  getArt(category, artId, label) {
    const that = this;
    const artPath = category + '/' + artId;
    const fileUrl = app.globalData.url + artPath;
    // console.log('fileurl,', fileUrl)
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
              let obj = app.towxml(res.data, 'markdown', {
                theme: 'light',
                events: {
                  tap: (e) => {
                    // console.log('tap,',e)
                    const {
                      dataset
                    } = e.currentTarget;
                    if (dataset && dataset.data) {
                      if (dataset.data.tag == 'navigator') {
                        console.log('点击内容:', dataset.data.attrs.href);
                        const content = dataset.data.attrs.href;
                        wx.showModal({
                          title: '内容',
                          content: content,
                          confirmText: '复制内容',
                          complete: (res) => {
                            if (res.cancel) {
                              console.log('cancel')
                            }

                            if (res.confirm) {
                              console.log('confirm')
                              wx.setClipboardData({
                                data: content,
                                success(res) {}
                              })

                            }
                          }
                        })
                      }

                    }
                  }
                },
              });
              // console.log('obj,', obj)
              const modifiedAst = that.insertAdAfterFirstParagraph(obj.children);
              obj.children = modifiedAst;
              // console.log(modifiedAst);
              // 将文件内容赋值给towxml组件，它会自动进行解析渲染。然后将加载动画关闭。
              that.setData({
                article: obj,
                isLoading: false,
              });
          },
        })
      },
      (err) => {
        console.error('Download failed:', err.message);
        log.error('file url,', fileUrl, 'error message,', err.message);
        const title = '下载Markdown文件时错误';
        const content = "文件地址：" + fileUrl + "，错误信息：" + JSON.stringify(err.message);
        app.rptErrInfo(title, content);
      },
    );
  },



  // 假设 astNodes 是解析后的 AST 节点列表
  insertAdAfterFirstParagraph(astNodes) {
    const that = this;
    // 遍历查找第一个 p 标签
    let pIndex = -1;
    for (let i = 0; i < astNodes.length; i++) {
      const node = astNodes[i];
      if (node.type === 'tag' && node.attrs.class === 'h2w__p') { // 根据实际 AST 结构判断
        pIndex = i;
        break;
      }
    }

    if (pIndex !== -1) {
      // 创建广告节点（参考 towxml 的 AST 结构）
      const adNode = {
        type: 'tag', // 节点类型
        attrs: {
          // 其他属性（如广告 ID）
          unitId:'adunit-1b798fb35a6890a7',
          bindload:that.adLoad,
          binderror:that.adError,
        },
        tag: 'ad-custom', // 自定义组件名
        rely: false,
        children: [], // 若有子节点可在此定义
        // 如果是微信小程序，可能需要标记为自定义组件
        // isCustom: true
      };

      // 在 p 标签后插入广告（+1 表示插入到 p 的下一个位置）
      astNodes.splice(pIndex + 1, 0, adNode);
    }

    return astNodes;
  },

  adLoad(e) {
    console.log('原生模板广告加载成功', e)
  },


  adError(e) {
    console.error('原生模板广告加载失败', e)
    const {
      errCode
    } = e.detail;
    if (errCode === 1004) { // 无广告填充
      console.log('广告加载失败', e.detail)
    }
  },
  adClose(e) {
    console.log('原生模板广告关闭',e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options);
    this.getArt(options.category, options.id, options.label);
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
    // console.log('article unload')
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