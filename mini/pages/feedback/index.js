Page({
    data: {},

    handleFeedback() {
        wx.showToast({
            title: '反馈已提交',
            icon: 'success',
            duration: 2000
        });
    }
});