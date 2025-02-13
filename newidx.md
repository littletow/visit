// 新的首页

wxml文件：
<view class="container">
  <view class="header">
    <text class="title">标题</text>
    <text class="description">这是一个简短的描述。</text>
  </view>
   
  <view class="search-box">
    <input class="search-input" type="text" placeholder="搜索..." />
    <button class="search-button">搜索</button>
  </view>

  <view class="quick-buttons">
    <button class="quick-button">快捷按钮1</button>
    <button class="quick-button">快捷按钮2</button>
    <button class="quick-button">快捷按钮3</button>
    <button class="quick-button">快捷按钮4</button>
    <button class="quick-button">快捷按钮5</button>
    <button class="quick-button">快捷按钮6</button>
  </view>

  <view class="tools">
    <button class="tool-button">
      <image class="tool-icon" src="icon1.png" />
      <text>工具1</text>
    </button>
    <button class="tool-button">
      <image class="tool-icon" src="icon2.png" />
      <text>工具2</text>
    </button>
    <button class="tool-button">
      <image class="tool-icon" src="icon3.png" />
      <text>工具3</text>
    </button>
    <button class="tool-button">
      <image class="tool-icon" src="icon4.png" />
      <text>工具4</text>
    </button>
  </view>

  <view class="advertisement">
    <image class="ad-image" src="ad.png" />
  </view>
</view>

wxss文件：
/* 全局样式 */
page {
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
}

.container {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 1em;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.description {
  font-size: 16px;
  color: #666;
  margin-top: 0.5em;
}

.search-box {
  display: flex;
  width: 100%;
  margin-bottom: 1em;
}

.search-input {
  flex: 1;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
  font-size: 16px;
}

.search-button {
  padding: 0.5em 1em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  font-size: 16px;
  cursor: pointer;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1em;
}

.quick-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5em 1em;
  margin: 0.5em;
  font-size: 16px;
  cursor: pointer;
  flex: 1 1 30%;
  max-width: 30%;
  text-align: center;
}

.tools {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 1em;
}

.tool-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1em;
  width: 20%;
  text-align: center;
}

.tool-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 0.5em;
}

.advertisement {
  width: 100%;
  margin-top: 1em;
}

.ad-image {
  width: 100%;
  border-radius: 10px;
}

json文件：
{
  "pages": [
    "pages/home-page/home-page"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#4CAF50",
    "navigationBarTitleText": "主页",
    "navigationBarTextStyle": "white"
  }
}

