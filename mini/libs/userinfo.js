const utils = require('../utils/utils.js');

// 优化广告逻辑：
// 新用户观看加锁文章需要观看广告，如果用户连续打开小程序30天，可以在接下来30天内每天仅看一次广告，即可浏览所有加锁文章。
// 设计如下：
// 用户签到天数，用户第一次进入时间，用户当前身份，用户切换身份时间，切换后的天数。
// 如何用户观看加锁文章时，先看下用户的身份，如果是星用户，则一天只看一次广告。
// 如果用户不是，那么观看广告后才可以浏览文章。
// 数据结构如下：
// firstTime,isStar,starTime,points,starDays,isSeeAd,seeAdTime

class UserInfo {
    constructor() {
        this.firstLoginTime = 0;  // 第一次登录时间
        this.lastLoginTime = 0; // 最近一次登录时间
        this.loginDays = 0; // 连续登录天数
        this.hasStar = false;      // 是否拥有星星，连续登录30天可获得星星，获取后可以持有30天，以后每天扣减，直到为0，再次失去星星。
        this.starTime = 0; // 拥有星星时间
        this.starDays = 0; // 拥有星星的天数，每天递减。为0时，失去星星。 
        this.adWatchTime = 0;     // 今天看广告时间
    }

    // 从数据缓存中加载用户信息
    loadFromCache() {
        const data = wx.getStorageSync('userInfo');
        if (data) {
            this.firstLoginTime = data.firstLoginTime || this.firstLoginTime;
            this.lastLoginTime = data.lastLoginTime || this.lastLoginTime;
            this.loginDays = data.loginDays || this.loginDays;
            this.hasStar = data.hasStar || this.hasStar;
            this.starTime = data.starTime || this.starTime;
            this.starDays = data.starDays || this.starDays;
            this.adWatchTime = data.adWatchTime || this.adWatchTime;
        }
    }

    // 保存用户信息到数据缓存
    saveToCache() {
        wx.setStorageSync('userInfo', {
            firstLoginTime: this.firstLoginTime,
            lastLoginTime: this.lastLoginTime,
            loginDays: this.loginDays,
            hasStar: this.hasStar,
            starTime: this.starTime,
            starDays: this.starDays,
            adWatchTime: this.adWatchTime
        });
    }

    // 用户登录时修改用户信息
    updateLoginInfo() {
        const now = utils.getNowMsTime();
        const todayZerots = utils.getTodayZeroMsTime();
        const yesterdayZerots = utils.getYesterdayZeroMsTime();
        // 用户第一次登录
        if (this.firstLoginTime == 0) {
            this.firstLoginTime = now;
            this.lastLoginTime = now;
            this.loginDays = 1;

        } else {
            // 看一下用户上次登录时间
            if (this.lastLoginTime > todayZerots) {
                // 今天又一次登录
                this.lastLoginTime = now;
            } else if (this.lastLoginTime > yesterdayZerots) {
                // 昨天登录了
                if (this.hasStar) {
                    this.starDays -= 1;
                    if (this.starDays <= 0) {
                        this.hasStar = false;
                    }
                } else {
                    this.loginDays += 1;
                    if (this.loginDays >= 30) {
                        this.hasStar = true;
                        this.starTime = now;
                        this.starDays = 30;
                    }
                }
            } else {
                // 昨天之前登录了
                if (this.hasStar) {
                    // 计算天数
                    const daysElapsed = utils.calculateDaysBetween(now, this.lastLoginTime);
                    this.starDays -= daysElapsed;
                    if (this.starDays <= 0) {
                        this.hasStar = false;
                    }
                } else {
                    this.loginDays = 1;
                }
            }
        }

        this.saveToCache();
    }

    // 看广告时修改用户信息
    updateAdWatchInfo() {
        // 记录一下星用户
        if (this.hasStar) {
            const now = utils.getNowMsTime();
            this.adWatchTime = now;
            this.saveToCache();
        }
    }

    // 获取第一次登录时间
    getFirstLoginTime() {
        return this.firstLoginTime;
    }

    // 获取是否新用户
    getHasStar() {
        return this.hasStar;
    }

    // 获取今天是否看广告
    hasWatchedAdToday() {
        const todayZerots = utils.getTodayZeroMsTime();
        if (this.adWatchTime > todayZerots) {
            return true
        } else {
            return false
        }
    }
}

module.exports = UserInfo;