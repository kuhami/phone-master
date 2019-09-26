// pages/home/home.js
let App = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
    data: {
        iponeList:[],
        scrollTop:0,//滑动条离顶部的距离
        inputValue:''
    },
    onInput: function (e) {
        this.setData({
            inputValue:e.detail.value
        })
    },
    onSerch: function () {
        const { inputValue } = this.data;
        App.InputValue = inputValue;
        this.setData({
            inputValue:''
        })
        wx.switchTab({
            url: '../goodnumber/goodnumber'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面初次渲染完成 ^((?!4).)*$ 不含四的正则表达式
     */
    onReady() {
        const that = this;
        wx.showLoading({
            title: '加载中',
        })
        db.collection('iponeData').where({
            ipone: {
                $regex:'([\\d])\\1{4,}'+ App.InputValue
            }
        }).get({
            success: function(res) {
                const iponeList=  res.data.map((v)=>{
                    const {_id,low,ipone,price,area, message,} = v;
                return {_id,
                    low,
                    area,
                    message,
                    ipone:ipone.replace('p',''),
                    price,
                    BreakData:that.RepeatData(ipone)
                }});
                console.log(iponeList);
                that.setData({
                    iponeList
                })
                wx.hideLoading()
            },
            fail: function (err) {
                wx.showToast({
                    title: '查询失败',
                    icon: 'fail',
                    duration: 2000
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    //重复数字
    RepeatData: function(ipone){
        let ipones = ipone.replace('p','');
        let iponeArr = ipone.replace('p','').split('');
        let iponeData4 = /([\d])\1{3,}/,
            iponeData5 = /([\d])\1{4,}/,
            iponeData6 = /([\d])\1{5,}/;

        let arripone='',Index='',iponeNumber='';
        if(iponeData6.test(ipones)){
            iponeArr.map((v,index)=>{
                if(iponeData6.test(ipones.substring(index,index+6))){
                    iponeNumber = 6;
                    Index = index;
                    arripone = ipones.substring(index,index+6);
                }
            })
        }else if(iponeData5.test(ipones)){
            iponeArr.map((v,index)=>{
                if(iponeData5.test(ipones.substring(index,index+5))){
                    iponeNumber = 5;
                    Index = index;
                    arripone = ipones.substring(index,index+5);
                }
            })
        }else if(iponeData4.test(ipones)){
            iponeArr.map((v,index)=>{
                if(iponeData4.test(ipones.substring(index,index+4))){
                    iponeNumber = 4;
                    Index = index;
                    arripone = ipones.substring(index,index+4);
                }
            })
        }
        let ipone0 = ipones.substring(0,Index),ipone1 = ipones.substring(Index+iponeNumber,11)
        return [ipone0,arripone,ipone1]
    },
    BreakData: function(ipone){
        let ipones = ipone.replace('p','');
        let iponeArr = ipone.replace('p','').split('');
        let iponeData4 = /(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){3}\d/,
            iponeData5 = /(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){4}\d/,
            iponeData6 = /(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){5}\d/,
            iponeData7 = /(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){6}\d/;

        let arripone='',Index='',iponeNumber='';
        if(iponeData7.test(ipones)){
            iponeArr.map((v,index)=>{
                if(iponeData7.test(ipones.substring(index,index+7))){
                    iponeNumber = 7;
                    Index = index;
                    arripone = ipones.substring(index,index+7);
                }
            })
        }else if(iponeData6.test(ipones)){
            iponeArr.map((v,index)=>{
                if(iponeData6.test(ipones.substring(index,index+6))){
                    iponeNumber = 6;
                    Index = index;
                    arripone = ipones.substring(index,index+6);
                }
            })
        }else if(iponeData5.test(ipones)){
            iponeArr.map((v,index)=>{
                if(iponeData5.test(ipones.substring(index,index+5))){
                    iponeNumber = 5;
                    Index = index;
                    arripone = ipones.substring(index,index+5);
                }
            })
        }else if(iponeData4.test(ipones)){
            iponeArr.map((v,index)=>{
                if(iponeData4.test(ipones.substring(index,index+4))){
                    iponeNumber = 4;
                    Index = index;
                    arripone = ipones.substring(index,index+4);
                }
            })
        }
        let ipone0 = ipones.substring(0,Index),ipone1 = ipones.substring(Index+iponeNumber,11)
        return [ipone0,arripone,ipone1]
    },
    scroll:function(e){
        // let self=this;
        // let top=e.detail.scrollTop;
        // self.setData({
        //     scrollTop:top
        // });
    },
    //滚动到底部触发
    scrollLower:function(e){

    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
