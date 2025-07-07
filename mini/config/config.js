module.exports = {
    categoryConfig: [
        { 'id': 'theory', 'name': '基础知识', icon: '/images/brain.png' },
        { 'id': 'setup', 'name': '环境配置', icon: '/images/edit-property.png' },
        { 'id': 'snippet', 'name': '代码片段', icon: '/images/news.png' },
        { 'id': 'idea', 'name': '设计方案', icon: '/images/toolbox.png' },
        { 'id': 'faq', 'name': '常见问题', icon: '/images/question.png' },
        { 'id': 'tool', 'name': '工具技巧', icon: '/images/book.png' },
    ],
    vtitle: '开发成长笔记',
    vdesc: '整理与沉淀实用开发经验，涵盖原理、配置、代码片段、架构思路及常见问题，快速查阅高效提升。',
    introList: [{
        'title': '搜索查询',
        'desc': '系统将展示所有与关键词匹配的知识记录与开发心得，快速助力问题解决。'
    }, {
        'title': '基础知识',
        'desc': '记录核心概念与原理，帮助理解技术基础，进一步提升技能。'
    }, {
        'title': '环境配置',
        'desc': '记录开发及运行环境的相关设置与配置方法，方便后期复用。'
    }, {
        'title': '代码片段',
        'desc': '常用开发过程中积累和整理的高效实用代码片段，便于快速查找和复用。'
    }, {
        'title': '设计方案',
        'desc': '涵盖项目架构、模块设计及实现思路的详细总结，帮助理清开发整体脉络。'
    }, {
        'title': '常见问题',
        'desc': '记录日常开发中容易遇到的典型问题及解决方法，助力高效排查与处理。'
    }, {
        'title': '工具技巧',
        'desc': '收录开发、调试过程中发现的各类高效工具与实用技巧，提升工作效率。'
    }],


};

// 文章索引目录结构，JSON文件
/*
 * 文章列表结构如下：
     * "id": "visit.md", 文件名称，需和资源名称对应
     * "category": "projects", 类目，需和文件夹名称对应
     * "name": "豆子碎片项目介绍", 列表标题，展示在小程序中
     * "kw": "豆子碎片，visit，小程序", 关键字，搜索时用到
     * "plat": "go"，语言内容，分别为go,rust,mp,ser
*/
