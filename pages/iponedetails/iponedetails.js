// pages/home/home.js
let App = getApp();
const db = wx.cloud.database();
const _ = db.command;
const testDB = wx.cloud.database({
    env: 'iponeData'
})
Page({
    /**
     * 页面的初始数据
     */
    data: {
        ipone:'',
        low:'',
        price:0,
        area:'',
        message:'',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        const {ipone,low,price,area,message} = options;
        this.setData({
            ipone,
            low,
            price,
            area,
            message
        })
    },
    goBack: function(){
        wx.switchTab({
            url: '../home/home'
        })
    },
    phoneCall: function(){
        wx.makePhoneCall({
            phoneNumber: '1340000模拟号码' //仅为示例，并非真实的电话号码
        })
    },
    scroll:function(e){

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
