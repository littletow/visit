## visit

![输入图片说明](https://images.gitee.com/uploads/images/2019/0131/101857_e5398b5c_90803.jpeg "gh_47e307f4f905_258.jpg")

# 剩下的md文件
网址：https://tour.go-zh.org/flowcontrol/11
从没有条件的 switch开始

# 2019-01-31
添加Golang自带常用的包
目前添加了fmt,log,time,os,math,archive,bufio,context还未实现页面。

# 2019-04-18
已经调整了新的架构，新架构优化了Page，使用参数动态的从网络上下载资源。
需要继续优化。

# 2020-10-11
重新架构，首页目前设计只有两个卡片、一个卡片为技术类文章，包含Go介绍和Go库的介绍
一个卡片为代码片段


# 2020-10-27
1，跳转完善，将首页的jump方法完善，添加跳转
2，构造数据，从云开发中下载数据。
3，设计怎么上传数据。

#2020-10-28
1，实现标题关键字搜索、语言标签搜索

# 2020-11-21
1,怎么实现碎片上传

# 2022-01-17

重新架构，首页使用列表，详情页使用模板，这样可以方便使用数据库，不再使用markdown解析，长文章可以写到公众号去。

首页实体(uuid,title,desc,openid,views,createTime,status)
详情实体(uuid,title,content,views,lang,url,createTime,status)

星星大于5，开始跳出视频，每10个view换一个星星。
uuid作为主键关联。

上传GitHub url地址，语言，标题，介绍，内容。

上传的文章需要审核，审核通过后，可以浏览。

搜索可以显示常用的提示语。

上拉加载更多的列表内容。

# 2022-07-19

重新架构，首页使用列表，列表详情页使用towxml，每篇帖子用心更新，里面的连接可以调转到特定页面。

文章内容使用mongo存储，它的结构为：
首页实体(uuid,title,desc,createTime,status)
详情实体(uuid,content,views,createTime,status)

# 2022-08-17

首页以步骤条展示，然后每个步骤可以切入进去，具体到每一大类。然后展示列表。后面的流程不变。使用towxml展示。

数据库结构就要变更，只有文章标题和内容，去除描述。
库列表(uuid,category,title,createdTime,updatedTime,status,views)
库详情(uuid,content)

需要开发管理后台，来管理文章列表。

第一步骤 Go编程语言

第二步骤 Minio存储

第三步骤 小程序

第四步骤 Rust编程语言