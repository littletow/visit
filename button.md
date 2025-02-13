wxss 文件：
button {
  border: none;
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-primary {
  background-color: #007BFF; /* 蓝色按钮 */
  color: #ffffff; /* 白色文字 */
}

.button-secondary {
  background-color: #6C757D; /* 灰色按钮 */
  color: #ffffff; /* 白色文字 */
}

.button-success {
  background-color: #28A745; /* 绿色按钮 */
  color: #ffffff; /* 白色文字 */
}

.button-danger {
  background-color: #DC3545; /* 红色按钮 */
  color: #ffffff; /* 白色文字 */
}

.button-warning {
  background-color: #FFC107; /* 黄色按钮 */
  color: #212529; /* 深色文字 */
}

.button-info {
  background-color: #17A2B8; /* 浅蓝色按钮 */
  color: #ffffff; /* 白色文字 */
}


/* 重置button的默认样式 */
button.feedback {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  appearance: none;
}

/* 自定义样式 */
button.feedback {
  background-color: #007BFF; /* 蓝色背景 */
  color: #ffffff; /* 白色文字 */
  border-radius: 4px; /* 圆角 */
  padding: 10px 20px; /* 内边距 */
  font-size: 16px; /* 字体大小 */
  transition: background-color 0.3s, transform 0.3s; /* 过渡效果 */
}

button.feedback:hover {
  background-color: #0056b3; /* 悬停时的背景色 */
}


/* 蓝色：适合链接或按钮，可以提供较好的视觉引导。 */
.link {
  color: #007BFF; /* 蓝色链接 */
}

/* 深绿色：柔和且不失对比度，适合强调信息或按钮。 */
.info {
  background-color: #228B22; /* 深绿色按钮背景 */
  color: #ffffff; /* 按钮文字颜色 */
}