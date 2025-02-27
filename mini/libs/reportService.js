class ReportService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    uploadError(title, content, devinfo) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${this.baseUrl}/uploadError`,
                method: 'POST',
                data: {
                    title: title,
                    content: content,
                    devinfo: devinfo
                },
                success: res => {
                    resolve(res);
                },
                fail: err => {
                    reject(err);
                }
            });
        });
    }

    uploadNotification(title, content, devinfo) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${this.baseUrl}/uploadNotification`,
                method: 'POST',
                data: {
                    title: title,
                    content: content,
                    devinfo: devinfo
                },
                success: res => {
                    resolve(res);
                },
                fail: err => {
                    reject(err);
                }
            });
        });
    }
}

module.exports = ReportService;