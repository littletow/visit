class Advertisement {
    constructor() {
        this.hasStar = false; // 默认没有星星
    }

    // 判断是否需要看广告
    needToWatchAd(hasStar) {
        this.hasStar = hasStar;
        const lastWatchTime = wx.getStorageSync('lastAdWatchTime');
        const today = new Date().toISOString().split('T')[0];

        if (this.hasStar && lastWatchTime && lastWatchTime.split('T')[0] === today) {
            console.log("你有星星，且今天已经看过广告，不需要再看广告");
            return false;
        } else {
            console.log("你需要看广告");
            return true;
        }
    }

    // 存储观看广告的时间
    storeAdWatchTime() {
        const watchTime = new Date().toISOString();
        // 使用微信小程序的存储API
        wx.setStorageSync('lastAdWatchTime', watchTime);
        console.log("广告观看时间已存储:", watchTime);
    }
}

module.exports = Advertisement;