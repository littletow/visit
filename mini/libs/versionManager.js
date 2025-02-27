class VersionManager {
    constructor(versionUrl, dataUrl) {
        this.versionUrl = versionUrl;
        this.dataUrl = dataUrl;
        this.localVersionKey = 'localVersion';
        this.localDataKey = 'localData';
    }

    // 获取本地版本号
    getLocalVersion() {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key: this.localVersionKey,
                success: (res) => resolve(res.data),
                fail: () => resolve(0) // 默认版本号为0
            });
        });
    }

    // 设置本地版本号
    setLocalVersion(version) {
        wx.setStorage({
            key: this.localVersionKey,
            data: version
        });
    }

    // 下载服务器上的版本号
    fetchServerVersion() {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.versionUrl,
                method: 'GET',
                success: (res) => resolve(parseInt(res.data)),
                fail: (err) => reject(err)
            });
        });
    }

    // 下载服务器上的数据文件
    fetchDataFile() {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url: this.dataUrl,
                success: (res) => {
                    if (res.statusCode === 200) {
                        wx.getFileSystemManager().saveFile({
                            tempFilePath: res.tempFilePath,
                            success: (result) => {
                                wx.setStorage({
                                    key: this.localDataKey,
                                    data: result.savedFilePath
                                });
                                resolve(result.savedFilePath);
                            },
                            fail: (err) => reject(err)
                        });
                    } else {
                        reject(new Error('Download failed with status ' + res.statusCode));
                    }
                },
                fail: (err) => reject(err)
            });
        });
    }

    // 检查并更新数据文件
    async checkAndUpdate() {
        try {
            const localVersion = await this.getLocalVersion();
            const serverVersion = await this.fetchServerVersion();

            if (serverVersion > localVersion) {
                const savedFilePath = await this.fetchDataFile();
                this.setLocalVersion(serverVersion);
                console.log('Data file updated to version: ' + serverVersion);
                return savedFilePath;
            } else {
                console.log('Data file is up-to-date.');
                return wx.getStorageSync(this.localDataKey);
            }
        } catch (error) {
            console.error('Error updating data file:', error);
            throw error;
        }
    }
}

module.exports = VersionManager;