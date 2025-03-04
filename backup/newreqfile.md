使用wx.request请求文件内容，并使用同步函数写法

```

  onFetchArticle(category, artId, label) {
    const that = this;
    // 修改此处可以切换Git地址
    let fileUrl = app.globalData.url + category + '/' + artId;
    const mdArt = this.fetchArticle(fileUrl, 20000);
    that.setData({
      mdArt: mdArt,
      label: label,
    });
  },

  fetchArticle(url, timeout) {
    // 创建一个超时的标志
    let timeoutFlag = false;

    // 设置超时处理
    const timer = setTimeout(() => {
      timeoutFlag = true;
    }, timeout);

    // 发起同步请求
    try {
      const res = wx.request({
        url: url,
        method: 'GET',
        responseType: 'arraybuffer',
        timeout: timeout, // 设置请求超时时间
        success: (res) => {
          clearTimeout(timer);
          if (timeoutFlag) {
            return [];
          }
          if (res.statusCode === 200) {
            return new Uint8Array(res.data);
          } else {
            return [];
          }
        },
        fail: () => {
          clearTimeout(timer);
          if (timeoutFlag) {
            return [];
          }
          return [];
        }
      });

      if (timeoutFlag) {
        return [];
      }
      return new Uint8Array(res.data);
    } catch (error) {
      return [];
    }
  },

  ```