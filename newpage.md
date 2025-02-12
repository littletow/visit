wxml文件：

<view class="container">
  <view class="header">
    <text class="title">文章标题</text>
  </view>
  <scroll-view class="content" scroll-y="true">
    <view class="article">
      <text class="paragraph">这是文章的第一段内容。它提供了一些背景信息，并引出了文章的主题。</text>
      <text class="paragraph">这是文章的第二段内容。它详细解释了文章的主要观点，并提供了相关的例子和证据。</text>
      <text class="paragraph">这是文章的第三段内容。它总结了文章的主要观点，并提出了一些结论和建议。</text>
      <!-- 继续添加更多段落 -->
    </view>
  </scroll-view>
  <view class="footer">
    <text>&copy; 2025 文章阅读页面. 版权所有.</text>
  </view>
</view>

wxss 文件：

/* 全局样式 */
page {
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.header {
  background-color: #4CAF50;
  color: white;
  padding: 1em;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 1em;
  background-color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
}

.article {
  padding: 1em 0;
}

.paragraph {
  margin-bottom: 1em;
  line-height: 1.6;
  font-size: 16px;
  color: #333333;
}

.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1em 0;
}

