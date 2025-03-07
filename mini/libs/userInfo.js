const utils = require('../utils/utils.js');
// v4.8.0
// 优化广告逻辑：
// 新用户观看加锁文章需要观看广告，如果用户连续打开小程序30天，可以在接下来30天内每天仅看一次广告，即可浏览所有加锁文章。
// 设计如下：
// 用户签到天数，用户第一次进入时间，用户当前身份，用户切换身份时间，切换后的天数。
// 如何用户观看加锁文章时，先看下用户的身份，如果是星用户，则一天只看一次广告。
// 如果用户不是，那么观看广告后才可以浏览文章。
// 数据结构如下：
// firstTime,isStar,starTime,points,starDays,isSeeAd,seeAdTime

// v4.9.0
// 优化广告逻辑：
// 观看加锁文章每次需要1个消耗豆子点数。
// 用户打开小程序，连续打开按天获取豆子点数个数，鼓励用户活跃度，如果中断，则从1开始。
// 观看广告获得10个豆子点数。
const APP_VERSION = 1;

class UserInfo {
    constructor() {
        this.firstLoginTime = 0; // 今天第一次登录时间
        this.lastLoginTime = 0; // 上一次登录时间
        this.loginDays = 0; // 连续登录天数
        this.beanPoints = 0; // 拥有豆子点数
        this.version = APP_VERSION; // 用户结构体版本，升级使用
        this.loadFromCache();
    }

    // 从数据缓存中加载用户信息
    loadFromCache() {
        const data = wx.getStorageSync('userInfo');
        if (data) {
            // 判断版本号
            this.version = data.version || this.version;
            if (this.version < APP_VERSION) {
                // 版本升级需要处理数据结构
                switch (this.version) {
                    case 1:
                        console.log(this.version)
                    default:
                        console.log(this.version)
                }
            } else {
                this.firstLoginTime = data.firstLoginTime || this.firstLoginTime;
                this.lastLoginTime = data.lastLoginTime || this.lastLoginTime;
                this.loginDays = data.loginDays || this.loginDays;
                this.beanPoints = data.beanPoints || this.beanPoints;
                this.version = data.version || this.version;
            }
        }
    }

    // 保存用户信息到数据缓存
    saveToCache() {
        wx.setStorageSync('userInfo', {
            firstLoginTime: this.firstLoginTime,
            lastLoginTime: this.lastLoginTime,
            loginDays: this.loginDays,
            beanPoints: this.beanPoints,
            version: this.version
        });
    }

    // 用户登录时修改用户信息
    updateLoginInfo() {
        const now = utils.getNowMsTime();
        const todayZerots = utils.getTodayZeroMsTime();
        const yesterdayZerots = utils.getYesterdayZeroMsTime();

        // 今天登录了？
        if (this.firstLoginTime > todayZerots) {
            console.log('今天已经登录了')
            return
        } else {
            // 昨天登录了？
            if (this.lastLoginTime > yesterdayZerots) {
                this.loginDays += 1;
                this.beanPoints += this.loginDays;
            } else {
                // 昨天以前登录了？
                this.loginDays = 1;
                this.beanPoints += this.loginDays;
            }
            // 今天登录了
            this.firstLoginTime = now;
            this.lastLoginTime = now;
        }

        this.saveToCache();
    }

    // 看广告时修改用户信息
    updateAdWatchInfo() {
        this.beanPoints += 10;
        this.saveToCache();
    }

    // 看加锁文章后修改用户信息
    updateReadLockArtInfo() {
        this.beanPoints -= 1;
        this.saveToCache();
    }

    // 获取第一次登录时间
    getFirstLoginTime() {
        return this.firstLoginTime;
    }

    // 获取最近一次登录时间
    getLastLoginTime() {
        return this.lastLoginTime;
    }

    // 获取豆子点数
    getBeanPoints() {
        return this.beanPoints;
    }

    // 获取连续登录天数
    getLoginDays() {
        return this.loginDays;
    }

    // 获取版本号
    getVersion(){
        return this.version;
    }
}

module.exports = UserInfo;