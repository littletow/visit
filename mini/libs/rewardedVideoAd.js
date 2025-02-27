class RewardedVideoAd {
    constructor(adUnitId) {
        this.adUnitId = adUnitId;
        this.videoAd = null;
        this.init();
    }

    init() {
        if (wx.createRewardedVideoAd) {
            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: this.adUnitId
            });

            this.videoAd.onLoad(() => {
                console.log('Rewarded video ad loaded');
            });

            this.videoAd.onError((err) => {
                console.error('Rewarded video ad error', err);
            });

            this.videoAd.onClose((res) => {
                if (res && res.isEnded) {
                    console.log('Rewarded video ad finished');
                    this.onAdSuccess && this.onAdSuccess();
                } else {
                    console.log('Rewarded video ad closed prematurely');
                    this.onAdFail && this.onAdFail();
                }
            });
        }
    }

    load() {
        if (this.videoAd) {
            this.videoAd.load().catch(err => {
                console.error('Rewarded video ad load error', err);
            });
        }
    }

    show(onAdSuccess, onAdFail) {
        this.onAdSuccess = onAdSuccess;
        this.onAdFail = onAdFail;

        if (this.videoAd) {
            this.videoAd.show().catch(() => {
                // 如果视频广告显示失败，再次加载并显示
                this.videoAd.load().then(() => this.videoAd.show()).catch(err => {
                    console.error('Rewarded video ad show error', err);
                });
            });
        }
    }
}

module.exports = RewardedVideoAd;