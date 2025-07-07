const config = require('../../config'),
    hljs = require('./highlight');
// config.highlight.forEach(item => {
//     hljs.registerLanguage(item, require(`./languages/${item}`).default);
// });
hljs.registerLanguage('bash', require('./languages/bash').default);hljs.registerLanguage('css', require('./languages/css').default);hljs.registerLanguage('go', require('./languages/go').default);hljs.registerLanguage('javascript', require('./languages/javascript').default);hljs.registerLanguage('json', require('./languages/json').default);hljs.registerLanguage('shell', require('./languages/shell').default);hljs.registerLanguage('nginx', require('./languages/nginx').default);hljs.registerLanguage('python', require('./languages/python').default);

module.exports = hljs;