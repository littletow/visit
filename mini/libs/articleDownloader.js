class ArticleDownloader {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    getArticleContent(articlePath) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseURL}${articlePath}`;
            wx.request({
                url: url,
                method: 'GET',
                success: (res) => {
                    if (res.statusCode === 200) {
                        resolve(res.data);
                    } else {
                        reject(`Failed to fetch article: ${res.statusCode}`);
                    }
                },
                fail: (err) => {
                    reject(`Request failed: ${err}`);
                },
            });
        });
    }
}

module.exports = ArticleDownloader;