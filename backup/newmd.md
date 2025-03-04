# new style 

/* 基础样式 */
.markdown-body {
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 30rpx;
  line-height: 1.6;
  color: #333;
  padding: 20rpx;
  background: #fff;
}

/* 标题 */
.h1 { font-size: 40rpx; font-weight: 600; margin: 40rpx 0 20rpx; color: #1a1a1a; }
.h2 { font-size: 36rpx; font-weight: 600; margin: 36rpx 0 18rpx; color: #222; border-bottom: 2rpx solid #eee; }
.h3 { font-size: 32rpx; font-weight: 600; margin: 32rpx 0 16rpx; color: #2c3e50; }
.h4 { font-size: 28rpx; font-weight: 500; margin: 28rpx 0 14rpx; color: #34495e; }
.h5 { font-size: 26rpx; font-weight: 500; margin: 26rpx 0 12rpx; color: #7f8c8d; }
.h6 { font-size: 24rpx; font-weight: 400; margin: 24rpx 0 12rpx; color: #95a5a6; }

/* 段落 */
.paragraph { margin: 20rpx 0; }

/* 列表 */
.ul, .ol { margin: 20rpx 0; padding-left: 40rpx; }
.li { margin: 12rpx 0; position: relative; }
.ul .li::before { content: "•"; color: #007bff; position: absolute; left: -24rpx; }
.ol { counter-reset: ol-counter; }
.ol .li::before { 
  content: counter(ol-counter) "."; 
  counter-increment: ol-counter; 
  color: #007bff; 
  position: absolute; 
  left: -40rpx; 
}

/* 代码块 */
.code-block {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 20rpx;
  margin: 24rpx 0;
  font-family: "Menlo", "Consolas", monospace;
  font-size: 26rpx;
  overflow-x: auto;
}
.code-inline {
  background: #f8f9fa;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  font-family: monospace;
  font-size: 90%;
  color: #e83e8c;
}

/* 引用 */
.blockquote {
  margin: 20rpx 0;
  padding: 16rpx 24rpx;
  background: #f8f9fa;
  border-left: 6rpx solid #007bff;
  color: #6c757d;
}

/* 表格 */
.table { 
  margin: 24rpx 0;
  border-collapse: collapse;
  width: 100%;
  overflow-x: auto;
}
.th, .td {
  padding: 16rpx;
  border: 2rpx solid #dee2e6;
}
.th { 
  background: #f8f9fa; 
  font-weight: 600; 
}
.tr:nth-child(even) { background: #f8f9fa; }

/* 图片 */
.image {
  max-width: 100%;
  height: auto;
  margin: 24rpx 0;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

/* 链接 */
.link { color: #007bff; text-decoration: none; }
.link:hover { text-decoration: underline; }

/* 分割线 */
.hr {
  margin: 40rpx 0;
  border: 0;
  border-top: 2rpx solid #eee;
}

/* 强调 */
.bold { font-weight: 600; }
.italic { font-style: italic; }

/* 任务列表 */
.task-list-item { list-style-type: none; }
.task-list-item-checkbox { 
  margin-right: 8rpx; 
  vertical-align: middle; 
}