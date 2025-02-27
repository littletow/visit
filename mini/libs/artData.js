const msgpackr = require('./msgpackr.min.js');

class ArtData {
    constructor() {
        this.artList = [];
        this.localFilePath = `${wx.env.USER_DATA_PATH}/data.bin`;
    }

    // 从文件读取内容，内容格式为msgpack，解码后返回数组列表
    readFromFile() {
        return new Promise((resolve, reject) => {
            wx.getFileSystemManager().readFile({
                filePath: this.localFilePath,
                success: (res) => {
                    try {
                        const decodedData = msgpackr.unpack(new Uint8Array(res.data));
                        this.artList = decodedData;
                        resolve(decodedData);
                    } catch (e) {
                        reject(e);
                    }
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    }

    // 从网上下载msgpack编码后的文件，下载后保存到本地，然后解码后返回数组列表
    downloadAndRead(url) {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url: url,
                success: (res) => {
                    if (res.statusCode === 200) {
                        wx.getFileSystemManager().saveFile({
                            tempFilePath: res.tempFilePath,
                            filePath: this.localFilePath,
                            success: () => {
                                this.readFromFile()
                                    .then((decodedData) => {
                                        resolve(decodedData);
                                    })
                                    .catch((e) => {
                                        reject(e);
                                    });
                            },
                            fail: (err) => {
                                reject(err);
                            }
                        });
                    } else {
                        reject(new Error(`下载失败，状态码：${res.statusCode}`));
                    }
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    }
}

module.exports = ArtData;