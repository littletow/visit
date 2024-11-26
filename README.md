# Visit 项目

Visit 是展示和搜索文章的前端小程序工具。Visit 项目经历多个版本迭代。现在已经成熟和稳定。

Visit 项目在小程序端的二维码：

![豆子碎片](https://imgs.91demo.top/visit.webp#pic_center)

## 云环境版本

visit 使用小程序云环境，在云存储中存放文章的 md 文件，然后小程序调用云函数获取使用 towxml 包转换后的 json 数据，在小程序端进行渲染。新的 towxml 必须使用调试基础库 2.9.4 版本以上，才能正常显示。在搜索时，根据文章标题和关键字模糊查询。在云环境开始收费后，转为服务器版本。服务器可操作空间更大。

## 服务器版本

visit 当前使用服务器版本，在后台服务器使用数据库存储 md 文件的数据。小程序调用接口从后台获取文件的数据，在前端使用 towxml 进行渲染。

注意：小程序端只有文章显示和搜索功能。 主要是方便上架审核。上传和管理文章等通过后台接口或工具。

文章使用 Markdown 格式，当制作好文档后，需要使用工具或者开放接口 API 上传到后台。

- 使用工具上传，工具请使用 [upart-go 项目](https://gitee.com/littletow/upart-go)
- 使用 API 接口上传，API 文档请访问[开放接口](https://www.91demo.top)

## 使用工具上传文章步骤

1. 制作 markdown 文件
2. 将文件放置到 files 文件夹中
3. 调用工具上传文章

## 项目介绍

该项目主要是为了在小程序端记录和分享技术文章，也是学习小程序的入门项目。注意，该项目是开源项目，请勿上传非法或重要敏感资料。上传的文章以编程技术或技术相关经验为主题。小程序包含首页和我的两个栏目，首页只显示公开的和自己上传的文章，可通过关键字搜索文章，搜索文章时，是通过在数据库中通过文章标题或关键字进行模糊匹配。也可以使用快捷按钮检索文章，快捷按钮目前只包含 3 个，最新，最近上传的文章；最火，浏览量最高的文章；最冷，浏览量最低的文章。文章可通过工具上传，如果要公开文章，那么公开的文章需要后台审核，目前由我来做，过滤一些和技术不相关文章。文章也可以加锁，当加锁后，其它用户访问你的文章，你将获得点数奖励。我的页面只有两个功能，一个是获取我的识别码，使用工具，或者开放接口需要用到此识别码，用作认证。另一个是看广告获取点数。上传文章是需要点数的。加入广告，是为了希望获取一点收益，承担一点我的服务器支出。

图片功能暂时未做。所以在 Markdown 文件中添加的图片链接在小程序端是无法打开的。主要考虑到图片既占用服务器磁盘，又占用大量流量，会造成服务器资费过高。如果确实需要在文章中添加图片，可以将图片添加到图床，并将对应域名告知我，添加到小程序域名白名单中。目前有一个方案是将图片上传到公众号，小程序不会过滤。它的缺陷就是你得有一个公众号。

链接无法打开，在 Markdown 文件中的链接，在小程序端渲染后，无法点击跳转到链接地址。目前没有方案解决这个问题。

整个项目由四部分应用组成，小程序端，命令行上传文章工具，Web 审核后台，以及后台接口服务。

- 小程序端，用来显示和搜索资料。
- 命令行上传文章工具，用于上传文章，以及管理文章。
- Web 审核后台，用来管理待审核的文章。
- 后台接口服务，为上面三个终端提供服务，将数据存储在服务器，并处理数据。

其中，小程序端和命令行上传文章工具已开源，其它两项也将以教程的方式持续的发布在[我的笔记](https://www.91demo.top)中。

## 使用接口

- /vln，登录接口，小程序启动时调用，获取 openid。
- /mpt，获取我的点数信息接口，获取我拥有的豆子点数。
- /artl，获取资料列表，使用快捷按钮调用。
- /sart，根据关键字搜索资料，返回资料列表。
- /artd，获取 Markdown 文章详情内容。
- /icode，获取我的应用识别码，使用工具或调用开放接口时用到。
- /rsticode，重置应用识别码密约。

## QQ 交流群 （479204413）
