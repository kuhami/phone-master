let App = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
    data: {
        items: [
            { name: '商丘移动', value: '商丘移动' },
            { name: '商丘本地', value: '商丘本地', checked: 'true' },
            { name: '商丘联通', value: '商丘联通' },
            { name: '其它地区', value: '其它地区' },
            { name: '商丘电信', value: '商丘电信' },
        ],
        windowHeight:'',
        type:'fail',
        user:{},
        addIpone:false,
        addLogin:true,
        ipone: '',
        price: '',
        area:'商丘本地',
        message:'',
        low:'',
        account:'',
        password:''
    },
    onLoad(options) {
        // let user = wx.getStorageSync('user') || {};
        // this.setData({
        //     user
        // })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let self = this;
        wx.getSystemInfo({
            success: function(res) {
                self.setData({
                    windowHeight:res.windowHeight
                })
            },
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let userInfo = wx.getStorageSync('userInfo') || {};
        console.log(userInfo)
        // this.setData({
        //     type:userInfo.login
        // });
    },
    radioChange: function (e) {
        const {value} = e.detail;
        this.setData({
            area:value
        })
    },
    bindTextAreaBlur: function (event) {
        const {cursor, value} = event.detail;
        console.log(cursor, value);
        this.setData({
            message:value
        })
    },
    //显示 or 隐藏
    addIpone: function (e) {
        const {addIpone} = this.data;
        this.setData({
            addIpone:!addIpone
        })
    },
    onInputLogin: function(e){
        const {value} = e.detail,{name} = e.currentTarget.dataset;
        if(name == 'account'){
            this.setData({
                account:value
            })
        }else if(name == 'password'){
            this.setData({
                password:value
            })
        }
    },
    add_Login: function(){
        const {account,password,addLogin} = this.data,that=this;
        console.log(account,password)
        let Ipassword = '',Iaccount='';
        wx.showLoading({
            title: '登陆中',
        })
        db.collection('passWords').where({
            account:account
        }).get({
            success: function(res) {
                if(!res.data.length){
                    wx.showModal({
                        title: '提示',
                        content: '请输入正确账号',
                        showCancel:false,
                    })
                    wx.hideLoading();
                    return false;
                }
                Iaccount = res.data[0].account;
                Ipassword = res.data[0].password;
                if(account !== Iaccount){
                    wx.showModal({
                        title: '提示',
                        content: '请输入正确账号',
                        showCancel:false,
                    })
                    wx.hideLoading();
                    return false;
                }else if(password !== Ipassword){
                    wx.showModal({
                        title: '提示',
                        content: '请输入正确密码',
                        showCancel:false,
                    })
                    wx.hideLoading();
                    return false;
                }
                that.setData({
                    addLogin:!addLogin
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
    cancel_Login: function(){
        const {addLogin} = this.data;
        this.setData({
            addLogin:!addLogin
        })
    },
    onInput: function(e){
        const {value} = e.detail,{name} = e.currentTarget.dataset;
        if(name == 'ipone'){
            this.setData({
                ipone:value
            })
        }else if(name == 'price'){
            this.setData({
                price:value
            })
        }else if(name == 'low'){
            this.setData({
                low:value
            })
        }

    },
    add_button: function () {
        const {addIpone,ipone,price,low,area,message} = this.data,that=this;
        console.log(ipone.length,price,low,area);
        if(!ipone || !(ipone.length == 11)){
            wx.showModal({
                title: '提示',
                content: '请输入11位手机号',
                showCancel:false,
            })
            return false;
        }else if(!price){
            wx.showModal({
                title: '提示',
                content: '请输入价格',
                showCancel:false,
            })
            return false;
        }else if(!low){
            wx.showModal({
                title: '提示',
                content: '请输入抵消',
                showCancel:false,
            })
            return false;
        }
        db.collection('iponeData').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                ipone,
                price:Number(price),
                low,
                area,
                message
            },
            success: function(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                console.log(res)
                wx.showToast({
                    title: '添加成功',
                    duration: 2000
                })
                that.setData({
                    addIpone:!addIpone
                })
            }
        })
    }
})
