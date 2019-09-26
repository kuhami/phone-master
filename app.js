//app.js
App({
    InputValue:'',
    onLaunch(options) {
        wx.cloud.init({
            env: 'kekro-pc4cm'
        })
    },
    onShow(options) {
        //console.log('onShow', options)

    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    // console.log(res);
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },

    globalData: {
        userInfo: null,
        location: ""
    },
})
