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
        iponeList:[],
        centerData:{},
        selected: 0,
        drop:'drop',
        mask1Hidden: true,
        mask2Hidden: true,
        animationData: "",
        selectedNumb: 0,
        fixTop:'',//区域离顶部的高度
        scrollTop:0,//滑动条离顶部的距离
        inputValue:'',
        loadingText:'查看更多靓号...',
        BackTop:false,
        noData:false
    },
    onTapTag: function (e) {
        let that = this,{index} = e.currentTarget.dataset,{inputValue,drop} = this.data;
        const orderBy = drop === 'drop' ? 'desc':drop;
        const dbIndex = index == '0' ? db.collection('iponeData').where({
            ipone: {
                $regex:'.*'+ inputValue
            }
        }):db.collection('iponeData').where({
            ipone: {
                $regex:'.*'+ inputValue
            }
        }).orderBy('price', orderBy);

        wx.showLoading({
            title: '加载中',
        })
        dbIndex.get({
            success: function(res) {
                const iponeList=  res.data.map((v)=>{const {_id,low,ipone,price,area, message,} = v;return {_id, low, area, message,ipone:ipone.replace('p',''), price}});
                that.setData({
                    iponeList
                })
                wx.hideLoading();
            },
            fail: function (err) {
                wx.showToast({
                    title: '查询失败',
                    icon: 'fail',
                    duration: 2000
                })
            }
        })

        this.setData({
            selected: e.currentTarget.dataset.index,
            drop: index == '0' ? 'drop':drop === 'asc' ? 'desc':'asc'
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        const that = this;
        wx.showLoading({
            title: '加载中',
        })
        db.collection('iponeData').where({
            ipone: {
                $regex:'.*'+ App.InputValue
            }
        }).get({
            success: function(res) {
              const iponeList=  res.data.map((v)=>{const {_id,low,ipone,price,area, message,} = v;return {_id, low, area, message,ipone:ipone.replace('p',''), price}});
                that.setData({
                    iponeList,
                    noData: iponeList.length ? false : true
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
    onShow: function (e) {
        const that = this,{inputValue} = this.data;
        if(inputValue == App.InputValue) return false;
        wx.showLoading({
            title: '加载中',
        })
        db.collection('iponeData').where({
            ipone: {
                $regex:'.*'+ App.InputValue
            }
        }).get({
            success: function(res) {
                console.log(res);
                const iponeList=  res.data.map((v)=>{const {_id,low,ipone,price,area, message,} = v;return {_id, low, area, message,ipone:ipone.replace('p',''), price}});
                that.setData({
                    iponeList,
                    noData: iponeList.length ? false : true,
                    inputValue:App.InputValue,
                    loadingText:iponeList.length < 19 ? '':'查看更多靓号...',
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
    onInput:function(e){
        App.InputValue = e.detail.value;
        this.setData({
            inputValue:e.detail.value
        })
    },
    onSerch:function(e){
        const {inputValue}  = this.data,that = this;
        wx.showLoading({
            title: '加载中',
        })
        db.collection('iponeData').where({
            ipone: {
                $regex:'.*'+ inputValue
            }
        }).get({
            success: function(res) {
                const iponeList=  res.data.map((v)=>{const {_id,low,ipone,price,area, message} = v;return {_id, low,area, message, ipone:ipone.replace('p',''), price}});
                that.setData({
                    iponeList,
                    drop:'drop',
                    selected:'0',
                    loadingText:iponeList.length < 20 ? '':'查看更多靓号...',
                    noData: iponeList.length ? false : true
                });
                wx.hideLoading();
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
    goTop: function(e){
        this.setData({
            scrollTop: 0
        })
    },
    scroll:function(e){
        if(e.detail.scrollTop > 500) {
            this.setData({
                BackTop: true
            });
        } else {
            this.setData({
                BackTop: false
            });
        }
    },
    //滚动到底部触发
    scrollLower:function(e){
        const that = this, {iponeList,loadingText,selected,inputValue} = this.data,Index = iponeList.length;
        const dbIndex = !selected ? db.collection('iponeData').where({
            ipone: {
                $regex:'.*'+ inputValue
            }
        }).skip(Index):db.collection('iponeData').where({
            ipone: {
                $regex:'.*'+ inputValue
            }
        }).skip(Index).orderBy('price', 'desc');
        dbIndex.get({
            success: function(res) {
                const newiponeList=  res.data.map((v)=>{const {_id,low,ipone,price,area, message} = v;return {_id, low, area, message,ipone:ipone.replace('p',''), price}});

                that.setData({
                    iponeList:[...iponeList,...newiponeList],
                    loadingText:iponeList.length <20 ? '':newiponeList.length ? loadingText:'手机号加载完啦'
                })
                wx.hideLoading();
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
    onReachBottom: function (e) {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
