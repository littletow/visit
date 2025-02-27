class ServerChecker {
    constructor(serverA, serverB) {
        this.serverA = serverA;
        this.serverB = serverB;
        this.mainUrl = serverA;
    }

    checkServer(serverUrl) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${serverUrl}/VERSION`,
                method: 'HEAD',
                success: (res) => {
                    if (res.statusCode === 200) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                fail: () => {
                    resolve(false);
                }
            });
        });
    }

    async updateMainUrl() {
        const isServerAAvailable = await this.checkServer(this.serverA);
        if (!isServerAAvailable) {
            this.mainUrl = this.serverB;
        } else {
            this.mainUrl = this.serverA;
        }
    }

    getMainUrl() {
        return this.mainUrl;
    }
}

module.exports = ServerChecker;