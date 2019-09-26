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
        noData:false,
        updateIpone:false,
        id:'',
        upIpone:'',
        upPrice:'',
        upLow:''
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
                const iponeList=  res.data.map((v)=>{const {_id,low,ipone,price,area,message} = v;return {_id, low,area,message, ipone:ipone.replace('p',''), price}});
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
    updateIpone: function(e){
        const {id} = e.currentTarget,that=this,{ipone,price,low} = e.currentTarget.dataset;
        console.log(id,ipone);
        const {updateIpone} = this.data;
        this.setData({
            id,
            upIpone:ipone,
            upPrice:price,
            upLow:low,
            updateIpone:!updateIpone
        })
    },
    onupInput: function(e){
        const {value} = e.detail,{name} = e.currentTarget.dataset;
        if(name == 'ipone'){
            this.setData({
                upIpone:value
            })
        }else if(name == 'price'){
            this.setData({
                upPrice:value
            })
        }else if(name == 'low'){
            this.setData({
                upLow:value
            })
        }

    },
    // add_button1: function (e){
    //     const {id,upIpone,upPrice,upLow} = this.data;
    //     db.collection('iponeData').doc(id).update({
    //         // data 传入需要局部更新的数据
    //         data: {
    //             ipone:upIpone
    //         },
    //         success: function(res) {
    //             console.log(res)
    //         }
    //     })
    // },
    add_button: function () {
        const {id,upIpone,upPrice,upLow,updateIpone} = this.data,that=this;
        console.log(upLow);
        if(!upIpone || !(upIpone.length == 11)){
            wx.showModal({
                title: '提示',
                content: '请输入11位手机号',
                showCancel:false,
            })
            return false;
        }else if(upPrice === ''){
            wx.showModal({
                title: '提示',
                content: '请输入价格',
                showCancel:false,
            })
            return false;
        }else if(upLow === ''){
            wx.showModal({
                title: '提示',
                content: '请输入抵消',
                showCancel:false,
            })
            return false;
        }
        db.collection('iponeData').doc(id).update({
            // data 字段表示需新增的 JSON 数据
            data: {
                ipone:upIpone,
                price:Number(upPrice),
                low:upLow
            },
            success: function(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                console.log(res)
                wx.showToast({
                    title: '更新成功',
                    duration: 2000
                })
                that.setData({
                    updateIpone:!updateIpone
                })
                that.onSerch();
            },
            fail: function (err) {
                wx.showModal({
                    title: '更新失败,请联系管理员。',
                    showCancel: false
                })
            }
        })
    },
    deleteIpone: function (e){
        const {id} = e.currentTarget,that=this,{ipone} = e.currentTarget.dataset;

        wx.showModal({
            title: '确认下架手机号?',
            content: ipone,
            success:function (res) {
                if (res.confirm) {
                    db.collection('iponeData').doc(id).remove({
                        success: function(res) {
                            wx.showToast({
                                title: '下架成功',
                                duration: 2000
                            })
                            that.onSerch();
                        },
                        fail: function (err) {
                            wx.showModal({
                                title: '下架失败,请联系管理员。',
                                showCancel: false
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },
        })

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        const that = this;
        wx.showLoading({
            title: '加载中',
        })
        db.collection('iponeData').get({
            success: function(res) {
              const iponeList=  res.data.map((v)=>{const {_id,low,ipone,price,area,message} = v;return {_id, low,area,message, ipone:ipone.replace('p',''), price}});
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
    onInput:function(e){
        // App.InputValue = e.detail.value;
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
                const iponeList=  res.data.map((v)=>{const {_id,low,ipone,price,area,message} = v;return {_id, low, area,message,ipone:ipone.replace('p',''), price}});
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
                const newiponeList=  res.data.map((v)=>{const {_id,low,ipone,price} = v;return {_id, low, ipone:ipone.replace('p',''), price}});

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
