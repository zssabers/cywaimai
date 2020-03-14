var qqmapsdk, app = getApp(), util = require("../../utils/util.js"), QQMapWX = require("../../utils/qqmap-wx-jssdk.js");

Page({
    data: {
        share_modal_active: !1,
        activeradio: "",
        hbshare_modal_active: !1,
        hbactiveradio: "",
        sjshare_modal_active: !1,
        sjindex: 0,
        ptps_money:0,
        radioItems: [],
        timearr: [],
        isloading: !0,
        navbar: [],
        fwxy: !0,
        xymc: "到店自取服务协议",
        xynr: "",
        selectedindex: 0,
        color: "#019fff",
        checked: !0,
        cart_list: [],
        wmindex: 1,
        wmtimearray: [ "" ],
        cjindex: 0,
        cjarray: [ "1份", "2份", "3份", "4份", "5份", "6份", "7份", "8份", "9份", "10份", "10份以上" ],
        mdoaltoggle: !0,
        total: 0,
        showModal: !1,
        zffs: 1,
        zfz: !1,
        zfwz: "微信支付",
        btntype: "btn_ok1",
        yhqkdje: 0,
        hbkdje: 0
    },
    showcart: function() {
        this.setData({
            share_modal_active: !this.data.share_modal_active
        });
    },
    closecart: function() {
        this.setData({
            share_modal_active: !1
        });
    },
    hbshowcart: function() {
        this.setData({
            hbshare_modal_active: !this.data.hbshare_modal_active
        });
    },
    hbclosecart: function() {
        this.setData({
            hbshare_modal_active: !1
        });
    },
    sjshowcart: function() {
        this.setData({
            sjshare_modal_active: !this.data.sjshare_modal_active
        });
    },
    sjclosecart: function() {
        this.setData({
            sjshare_modal_active: !1
        });
    },
    sjradioChange: function(t) {
        console.log("radio发生change事件，携带value值为：", t.detail.value);
        for (var e = this.data.radioItems, a = 0, s = e.length; a < s; ++a) e[a].checked = e[a].id == t.detail.value, 
        e[a].id == t.detail.value && this.setData({
            xztime: this.data.timearr[this.data.sjindex].time + " " + e[a].time
        });
        this.setData({
            radioItems: e,
            sjshare_modal_active: !1
        });
    },
    selectedime: function(t) {
        console.log(t);
        this.setData({
            sjindex: t.currentTarget.dataset.index,
            radioItems: this.data.timearr[t.currentTarget.dataset.index].ej
        });
    },
    openxy: function() {
        this.setData({
            fwxy: !1
        });
    },
    queren: function() {
        this.setData({
            fwxy: !0
        });
    },
    bindPickerChange: function(t) {
        console.log("picker发送选择改变，携带值为", t.detail.value), this.setData({
            wmindex: t.detail.value
        });
    },
    bindcjPickerChange: function(t) {
        console.log("picker发送选择改变，携带值为", t.detail.value), this.setData({
            cjindex: t.detail.value
        });
    },
    selectednavbar: function(t) {
        console.log(t);
        this.setData({
            selectedindex: t.currentTarget.dataset.index
        });
        var e = this.data.psfbf;
        console.log(e), 1 == t.currentTarget.dataset.index ? this.setData({
            psf: 0
        }) : this.setData({
            psf: e
        }), this.gettotalprice();
    },
    checkboxChange: function(t) {
        this.setData({
            checked: !this.data.checked
        });
    },
    ckwz: function(t) {
        console.log(t.currentTarget.dataset.jwd);
        var e = t.currentTarget.dataset.jwd.split(",");
        console.log(e);
        wx.openLocation({
            latitude: Number(e[0]),
            longitude: Number(e[1]),
            name: this.data.store.name,
            address: this.data.store.address
        });
    },
    radioChange1: function(t) {
        console.log("radio1发生change事件，携带value值为：", t.detail.value), "wxzf" == t.detail.value && this.setData({
            zffs: 1,
            zfwz: "微信支付",
            btntype: "btn_ok1"
        }), "yezf" == t.detail.value && this.setData({
            zffs: 2,
            zfwz: "余额支付",
            btntype: "btn_ok2"
        }), "jfzf" == t.detail.value && this.setData({
            zffs: 3,
            zfwz: "积分支付",
            btntype: "btn_ok3"
        }), "hdfk" == t.detail.value && this.setData({
            zffs: 4,
            zfwz: "货到付款",
            btntype: "btn_ok4"
          }),"czkzf" == t.detail.value && this.setData({
            zffs: 5,
            zfwz: "储值卡支付",
            btntype: "btn_ok5"
          });
    },
    distance: function(t, e, a) {
        var s;
        qqmapsdk.calculateDistance({
            mode: "driving",
            from: {
                latitude: t.lat,
                longitude: t.lng
            },
            to: [ {
                latitude: e.lat,
                longitude: e.lng
            } ],
            success: function(t) {
                console.log(t), 0 == t.status && (s = Math.round(t.result.elements[0].distance), 
                a(s));
            },
            fail: function(t) {
                console.log(t), 373 == t.status && (s = 15e3, a(s));
            },
            complete: function(t) {
                console.log(t);
            }
        });
    },
    KeyName: function(t) {
        this.setData({
            name: t.detail.value
        });
    },
    KeyMobile: function(t) {
        this.setData({
            mobile: t.detail.value
        });
    },
    tjddformSubmit: function(t) {
        console.log(t), this.setData({
            form_id2: t.detail.formId
        });
        var e = this.data.address, a = this.data.selectedindex, s = this.data.storeset;
        if (console.log(e, a, s), 0 == a && null == e && "1" == s.is_ps) return wx.showModal({
            title: "提示",
            content: "请选择收货地址"
        }), !1;
        if (0 != a || this.data.dzisnormall || "1" != s.is_ps) {
            if (0 == a && this.data.dzisnormall && "1" == s.is_ps) this.setData({
                showModal: !0
            }); else if (1 == a || 0 == a && "2" == s.is_ps) {
                var o = this.data.name, i = this.data.mobile, n = this.data.checked;
                if (console.log(o, i), "" == o || "" == i || null == o || null == i) return wx.showModal({
                    title: "提示",
                    content: "到店自提必须填写收货人和联系电话！"
                }), !1;
                if (!n) return wx.showModal({
                    title: "提示",
                    content: "请阅读并同意《到店自取服务协议》"
                }), !1;
                this.setData({
                    showModal: !0
                });
            }
        } else wx.showModal({
            title: "提示",
            content: "当前选择的收货地址超出商家配送距离,请选择其他地址",
            showCancel: !1,
            success: function(t) {
                wx.navigateTo({
                    url: "../wddz/xzdz"
                });
            }
        });
    },
    yczz: function() {
        this.setData({
            showModal: !1
        });
    },
    mdoalclose: function() {
        this.setData({
            mdoaltoggle: !0
        });
    },
    bindDateChange: function(t) {
        console.log("date 发生 change 事件，携带值为", t.detail.value, this.data.datestart), this.setData({
            date: t.detail.value
        }), t.detail.value == this.data.datestart ? (console.log("日期没有修改"), this.setData({
            timestart: util.formatTime(new Date()).substring(11, 16)
        })) : (console.log("修改了日期"), this.setData({
            timestart: "00:01"
        }));
    },
    bindTimeChange: function(t) {
        console.log("time 发生 change 事件，携带值为", t.detail.value), this.setData({
            time: t.detail.value
        });
    },
    radioChange: function(t) {
        this.setData({
            radioChange: t.detail.value
        }), console.log("radio发生change事件，携带value值为：", t.detail.value);
    },
    hbradioChange: function(t) {
        this.setData({
            hbradioChange: t.detail.value
        }), console.log("radio发生change事件，携带value值为：", t.detail.value);
    },
    xzq: function(t) {
        if (console.log(t.currentTarget.dataset, this.data.gwcinfo.money, this.data.CouponSet.yhq_set), 
        Number(t.currentTarget.dataset.full) > this.data.gwcinfo.money) return wx.showModal({
            title: "提示",
            content: "您的消费金额不满足此优惠券条件"
        }), !1;
        "1" == this.data.CouponSet.yhq_set ? this.setData({
            share_modal_active: !1,
            activeradio: t.currentTarget.dataset.rdid,
            yhqkdje: t.currentTarget.dataset.kdje
        }) : this.setData({
            share_modal_active: !1,
            activeradio: t.currentTarget.dataset.rdid,
            yhqkdje: t.currentTarget.dataset.kdje,
            hbactiveradio: "",
            hbkdje: 0
        }), this.gettotalprice();
    },
    xzhb: function(t) {
        if (console.log(t.currentTarget.dataset, this.data.gwcinfo.money, this.data.CouponSet.yhq_set), 
        Number(t.currentTarget.dataset.full) > this.data.gwcinfo.money) return wx.showModal({
            title: "提示",
            content: "您的消费金额不满足此红包条件"
        }), !1;
        "1" == this.data.CouponSet.yhq_set ? this.setData({
            hbshare_modal_active: !1,
            hbactiveradio: t.currentTarget.dataset.rdid,
            hbkdje: t.currentTarget.dataset.kdje
        }) : (wx.showModal({
            title: "提示",
            content: "优惠券与红包不可同时享用"
        }), this.setData({
            hbshare_modal_active: !1,
            hbactiveradio: t.currentTarget.dataset.rdid,
            hbkdje: t.currentTarget.dataset.kdje,
            activeradio: "",
            yhqkdje: 0
        })), this.gettotalprice();
    },
    onLoad: function(t) {
        app.setNavigationBarColor(this);
        var u = this, h = t.storeid, m = wx.getStorageSync("users").id;
        wx.removeStorageSync("note"), app.util.request({
            url: "entry/wxapp/GetStoreService",
            cachetime: "0",
            data: {
                store_id: h
            },
            success: function(t) {
                console.log(t), t.data && 0 < t.data.length && (t.data[0].ej[0].checked = !0, u.setData({
                    timearr: t.data,
                    radioItems: t.data[0].ej,
                    xztime: t.data[0].time + " " + t.data[0].ej[0].time
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/UserInfo",
            cachetime: "0",
            data: {
                user_id: m
            },
            success: function(t) {
                var e = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-");
                console.log(t, e.toString()), "" != t.data.dq_time && t.data.dq_time >= e.toString() && (t.data.ishy = 1), 
                u.setData({
                    userInfo: t.data
                });
            }
          }), app.util.request({
          url: "entry/wxapp/UserMoney",
            cachetime: "0",
            data: {
              user_id: m,
              store_id: h
            },
            success: function (t) {
                u.setData({
                  userMoney: t.data
                });
            }
          }), app.util.request({
            url: "entry/wxapp/MyCoupons",
            cachetime: "0",
            data: {
                store_id: h,
                user_id: m
            },
            success: function(t) {
            for (var e = [], a = [], s = 0; s < t.data.length; s++) "2" != t.data[s].coupon_type && ("1" == t.data[s].type || "3" == t.data[s].type) && e.push(t.data[s]), 
                "2" != t.data[s].coupon_type && "2" == t.data[s].type && a.push(t.data[s]);
                console.log(e, a), u.setData({
                    Coupons: e,
                    hbarr: a
                });
            }
        }),app.util.request({
            url: "entry/wxapp/UserMadd",
            cachetime: "0",
            data: {
                user_id: m,
                messages:2
            },
            success: function(t) {
            }
        }), app.util.request({
            url: "entry/wxapp/CouponSet",
            cachetime: "0",
            success: function(t) {
                console.log(t.data), u.setData({
                    CouponSet: t.data
                });
            }
        }),app.util.request({
            url: "entry/wxapp/PtMoney",
            cachetime: "0",
            success: function(t) {
                console.log(t.data), u.setData({
                    ptpsf: t.data
                });
            }
        }), qqmapsdk = new QQMapWX({
            key: getApp().xtxx.map_key
        }), u.setData({
            xtxx: getApp().xtxx
        }), app.util.request({
            url: "entry/wxapp/StoreInfo",
            cachetime: "0",
            data: {
                store_id: h,
                type: 2
            },
            success: function(t) {
                console.log(t.data), t.data.storeset.wmps_name = "" != t.data.storeset.wmps_name ? t.data.storeset.wmps_name : "外卖配送";
                var a = t.data, e = t.data.store.coordinates.split(","), s = {
                    lng: Number(e[1]),
                    lat: Number(e[0])
                };
                console.log(s), "1" == a.storeset.is_ps && "1" == a.storeset.is_zt && u.setData({
                    navbar: [ a.storeset.wmps_name, "到店自取" ]
                }), "2" == a.storeset.is_zt && u.setData({
                    navbar: [ a.storeset.wmps_name ]
                }), "2" == a.storeset.is_ps && u.setData({
                    navbar: [ "到店自取" ]
                }), "1" != a.storeset.is_hdfk && "3" != a.storeset.is_hdfk || u.setData({
                    hdfk: !0
                }), "1" == getApp().xtxx.is_yuepay && "1" == a.storeset.is_yuepay && u.setData({
                    kqyue: !0
                }), u.setData({
                    psfarr: t.data.psf,
                    reduction: t.data.reduction,
                    store: t.data.store,
                    storeset: t.data.storeset,
                    pstime:t.data.storeset.ps_time,
                    sjstart: s,
                    xynr: t.data.storeset.ztxy
                }), app.util.request({
                    url: "entry/wxapp/MyCar",
                    cachetime: "0",
                    data: {
                        store_id: h,
                        user_id: m
                    },
                    success: function(t) {
                        console.log(t), app.util.request({
                            url: "entry/wxapp/IsNew",
                            data: {
                                store_id: h,
                                user_id: m
                            },
                            cachetime: "0",
                            success: function(t) {
                                console.log(t.data), "1" == a.storeset.xyh_open && 1 == t.data ? u.setData({
                                    xyhmoney: a.storeset.xyh_money,
                                    isnewuser: "1"
                                }) : u.setData({
                                    xyhmoney: 0,
                                    isnewuser: "2"
                                }), u.countMj(), u.countpsf();
                            }
                        });
                        for (var e = 0; e < t.data.res.length; e++) if ("1" == t.data.res[e].is_qg) {
                            u.setData({
                                haveQg: !0
                            });
                            break;
                        }
                        u.setData({
                            cart_list: t.data.res,
                            gwcinfo: t.data,
                            gwcprice: t.data.money
                        });
                    }
                });
                u.getpstime();
            }
           
        });
        u.germsg();
        
    },
    getpstime:function(){
        var e = util.formatTime(new Date()), a = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-"), s = util.formatTime(new Date()).substring(11, 16);
        var that = this,
        o = new Date(),
        stime = that.data.pstime,
         i = o.getTime(), 
         stimes = 1000*60*stime,
         n = 2 * (24 - new Date(i).getHours());
         console.log('-----',stime);
        for (var d = [ "" ], r = 1; r < n; r++) {
            i = o.getTime() + stimes * r;
            var l = new Date(i).getMinutes();
            l < 10 && (l = "0" + l);
            var c = new Date(i).getHours() + ":" + l;
            d.push(c);
        }
        console.log(d), that.setData({
            datestart: a,
            timestart: s,
            date: a,
            time: s,
            wmtimearray: d
        });
    },
    germsg:function(){
        var that = this,m = wx.getStorageSync("users").id;
        app.util.request({
            url: "entry/wxapp/UserM",
            cachetime: "0",
            data: {
                user_id: m,
                messages:2
            },
            success: function(t) {
             if(t.data[0].state==0 || t.data[1].state==0){
                wx.getSetting({
                    success: (res) => {
                        wx.showModal({
                            title: '订阅消息',
                           content: '是否同意接受订阅消息？',
                           showCancel: true,
                           cancelText:"否",
                           confirmText:"是",
                            success: function (res) {
                               if (res.cancel) {

                               } else {
                                wx.requestSubscribeMessage({
                                    tmplIds: ["a7Fi3V_fiUKu752CJaABUhQXTxVjYtp0D-v4Tn11ZdE","O0snJtDPmlmfWcGZLOYOQWnDqBmIcpWU0soLxUW1icA"],
                                    success: (res) => {
                                        
                                    },
                                    fail(err) {
                                      console.error(err);
                                    }
                                  })
                               }
                            },
                         })
                    } 
                })
             }
            }
        })
    },
    gettotalprice: function() {
        var t = this.data.gwcprice, e = (this.data.gwcinfo.box_money, this.data.psf), a = this.data.mjmoney, s = this.data.xyhmoney, o = this.data.yhqkdje, i = this.data.hbkdje;
        var n = (Number(a) + Number(s) + 0 + Number(o) + Number(i)).toFixed(2);
        this.data.haveQg && (n = 0), (1 == this.data.userInfo.ishy && "1" == getApp().xtxx.is_vip_delivery || "0" != this.data.storeset.full_delivery && Number(t) - n >= Number(this.data.storeset.full_delivery || 1e5)) && (e = 0, 
        this.setData({
            psf: 0,
            mpsf: !0
        }));
        var d = (Number(t) + Number(e) - n).toFixed(2);
        d < 0 && (d = 0), this.setData({
            totalyh: n,
            totalPrice: d,
            zkmoney: 0,
            isloading: !1
        });
    },
    jsmj: function(t, e) {
        for (var a, s = 0; s < e.length; s++) if (Number(t) >= Number(e[s].full)) {
            a = s;
            break;
        }
        return a;
    },
    countMj: function() {
        var t = this.data.gwcprice, e = this.data.reduction.reverse(), a = this.jsmj(t, e), s = this.data.isnewuser;
        console.log(t, e, a, s);
        var o = 0;
        0 < e.length && null != a && "2" == s && (o = e[a].reduction), this.setData({
            reduction: e,
            mjindex: a,
            mjmoney: o
        });
    },
    countpsf: function() {
        var s = this,
         t = wx.getStorageSync("users").id,
          a = s.data.sjstart,
           o = 1e3 * Number(this.data.storeset.ps_jl),
            i = this.data.psfarr,
            ii = this.data.ptpsf;
        console.log(i), app.util.request({
            url: "entry/wxapp/MyDefaultAddress",
            cachetime: "0",
            data: {
                user_id: t
            },
            success: function(t) {
                if (t.data && "1" == s.data.storeset.is_ps) {
                    var e = {
                        lng: t.data.lng,
                        lat: t.data.lat
                    };
                    s.setData({
                        address: t.data,
                        mobile: t.data.tel,
                        name: t.data.user_name
                    }), s.distance(a, e, function(t) {
                        o < t ? (s.setData({
                            dzisnormall: !1
                        }), wx.showModal({
                            title: "提示",
                            content: "当前选择的收货地址超出商家配送距离,请选择其他地址",
                            success: function(t) {
                                t.confirm ? ( wx.navigateTo({
                                    url: "../wddz/xzdz"
                                })) : t.cancel && console.log("用户点击取消");
                            }
                        })) : s.setData({
                            dzisnormall: !0
                        });
                        var e = (t / 1e3).toFixed(2);
                        for (var a = i.length - 1; 0 <= a; a--) if (Number(e) >= Number(i[a].end) || Number(e) >= Number(i[a].start) && Number(e) < Number(i[a].end)) {
                            s.setData({
                                psf: i[a].money,
                                psfbf: i[a].money
                            }), s.gettotalprice();
                            break;
                        }
                        for (var a = ii.length - 1; 0 <= a; a--) if (Number(e) >= Number(ii[a].end) || Number(e) >= Number(ii[a].start) && Number(e) < Number(ii[a].end)) {
                            s.setData({
                                ptps_money: ii[a].money,
                            })
                        }
                    });
                } else t.data || "1" != s.data.storeset.is_ps ? s.setData({
                    psf: 0,
                    psfbf: 0
                }) : s.setData({
                    psf: i[0].money,
                    psfbf: i[0].money
                }), s.gettotalprice();
            }
        });
    },
    formSubmit: function(a) {
        var s = [];
        this.data.cart_list.map(function(t) {
            if (0 < t.num) {
                var e = {};
                e.name = "1" == t.is_qg ? t.qg_name : t.name, e.img = "1" == t.is_qg ? t.qg_logo : t.logo, 
                e.num = t.num, e.money = t.money, e.dishes_id = t.good_id, e.spec = t.spec, e.is_qg = t.is_qg, 
                s.push(e);
            }
        }), console.log(s);
        var o = this, i = this.data.storeset, t = this.data.haveQg, n = getApp().getOpenId;
        console.log("form发生了submit事件，携带数据为：", a.detail.value.radiogroup, this.data.activeradio, this.data.hbactiveradio);
        var e, d = a.detail.formId, r = this.data.form_id2, l = wx.getStorageSync("users").id, c = this.data.store.id, u = this.data.totalPrice, h = t ? 0 : this.data.totalyh, m = this.data.gwcinfo.box_money, g = this.data.psf, f = t ? 0 : this.data.mjmoney, p = t ? 0 : this.data.xyhmoney, y = this.data.note, w = this.data.cjarray[this.data.cjindex], v = t ? 0 : this.data.yhqkdje, _ = this.data.activeradio, x = this.data.hbactiveradio, b = t ? 0 : this.data.hbkdje, D = this.data.zkmoney,ptps_money=this.data.ptps_money;
        if ("hdfk" == a.detail.value.radiogroup && "3" == i.is_hdfk && Number(g) <= 0) wx.showModal({
            title: "提示",
            content: "货到付款，配送费不能为0，请选择其他付款方式"
        }); else {
            var k = parseInt(this.data.selectedindex) + 1;
            if ("2" == o.data.storeset.is_ps && (k = 2), e = 2 == k ? 0 < this.data.timearr.length ? this.data.xztime : this.data.date + " " + this.data.time : 0 < this.data.timearr.length ? this.data.xztime : this.data.wmtimearray[this.data.wmindex], 
            null != this.data.address) var j = this.data.address.area.replace(/,/g, "") + this.data.address.address+this.data.address.mph, z = this.data.address.user_name, q = this.data.address.tel, T = this.data.address.sex, S = this.data.address.area, M = this.data.address.lat, N = this.data.address.lng; else j = "", 
            z = "", q = "", T = "0", S = "", M = "", N = "";
            if (2 == k && (z = o.data.name, q = this.data.mobile, "" == z || "" == q)) return wx.showModal({
                title: "提示",
                content: "到店自提必须填写收货人和联系电话！"
            }), !1;
            if ("yezf" == a.detail.value.radiogroup) {
                var C = Number(this.data.userInfo.wallet), I = Number(u);
                if (console.log(C, I), C < I) return void wx.showToast({
                    title: "余额不足支付",
                    icon: "loading"
                });
            }
            if ("czkzf" == a.detail.value.radiogroup) {
              var C = Number(this.data.userMoney.money), I = Number(u);
              if (console.log(C, I), C < I) return void wx.showToast({
                title: "储值卡余额不足",
                icon: "loading"
              });
            }
            if ("yezf" == a.detail.value.radiogroup) var P = 2;
            if ("wxzf" == a.detail.value.radiogroup) P = 1;
            if ("jfzf" == a.detail.value.radiogroup) P = 3;
            if ("hdfk" == a.detail.value.radiogroup) P = 4;
            if ("czkzf" == a.detail.value.radiogroup) P = 5;
            console.log("支付方式", P), "" == d ? wx.showToast({
                title: "没有获取到formid",
                icon: "loading",
                duration: 1e3
            }) : (this.setData({
                zfz: !0
            }), app.util.request({
                url: "entry/wxapp/AddOrder",
                cachetime: "0",
                method: "POST",
                data: {
                    user_id: l,
                    store_id: c,
                    money: u,
                    discount: h,
                    box_money: m,
                    ps_money: g,
                    mj_money: f,
                    xyh_money: p,
                    tel: q,
                    name: z,
                    address: j,
                    note: y,
                    type: 1,
                    area: S,
                    lat: M,
                    lng: N,
                    form_id: d,
                    form_id2: r,
                    delivery_time: e,
                    order_type: k,
                    pay_type: P,
                    sz: JSON.stringify(s),
                    tableware: w,
                    sex: T,
                    yhq_money: v,
                    yhq_money2: b,
                    coupon_id: _,
                    coupon_id2: x,
                    zk_money: D,
                    ptps_money:ptps_money
                },
                success: function(t) {
                    console.log(t);
                    var e = t.data;
                    o.setData({
                        zfz: !1,
                        showModal: !1
                    }), "yezf" == a.detail.value.radiogroup && (console.log("余额流程"), "下单失败" != e ? (o.setData({
                        mdoaltoggle: !1
                    }), setTimeout(function() {
                        wx.reLaunch({
                            url: "../wddd/order?status=2"
                        });
                    }, 1e3)) : wx.showToast({
                        title: "支付失败",
                        icon: "loading"
                        })), "czkzf" == a.detail.value.radiogroup && (console.log("储值卡支付"), "下单失败" != e ? (o.setData({
                          mdoaltoggle: !1
                        }), setTimeout(function () {
                          wx.reLaunch({
                            url: "../wddd/order?status=2"
                          });
                        }, 1e3)) : wx.showToast({
                          title: "支付失败",
                          icon: "loading"
                        })), "hdfk" == a.detail.value.radiogroup && "1" == i.is_hdfk && (console.log("货到付款流程"), 
                    "下单失败" != e ? (o.setData({
                        mdoaltoggle: !1
                    }), setTimeout(function() {
                        wx.reLaunch({
                            url: "../wddd/order?status=2"
                        });
                    }, 1e3)) : wx.showToast({
                        title: "支付失败",
                        icon: "loading"
                    })), "hdfk" == a.detail.value.radiogroup && "3" == i.is_hdfk && (console.log("货到付款3流程"), 
                    "下单失败" != e ? app.util.request({
                        url: "entry/wxapp/pay",
                        cachetime: "0",
                        data: {
                            openid: n,
                            money: g,
                            order_id: e
                        },
                        success: function(t) {
                            console.log(t), wx.requestPayment({
                                timeStamp: t.data.timeStamp,
                                nonceStr: t.data.nonceStr,
                                package: t.data.package,
                                signType: t.data.signType,
                                paySign: t.data.paySign,
                                success: function(t) {
                                    console.log(t.data), console.log(t), console.log(d);
                                },
                                complete: function(t) {
                                    console.log(t), "requestPayment:fail cancel" == t.errMsg && (wx.showToast({
                                        title: "取消支付",
                                        icon: "loading",
                                        duration: 1e3
                                    }), setTimeout(function() {
                                        wx.reLaunch({
                                            url: "../wddd/order"
                                        });
                                    }, 1e3)), "requestPayment:ok" == t.errMsg && (o.setData({
                                        mdoaltoggle: !1
                                    }), setTimeout(function() {
                                        wx.reLaunch({
                                            url: "../wddd/order?status=2"
                                        });
                                    }, 1e3));
                                }
                            });
                        }
                    }) : wx.showToast({
                        title: "支付失败",
                        icon: "loading"
                    })), "wxzf" == a.detail.value.radiogroup && (console.log("微信支付流程"), 0 == u ? (wx.showModal({
                        title: "提示",
                        content: "0元买单请选择其他方式支付"
                    }), o.setData({
                        zfz: !1
                    })) : "下单失败" != e && app.util.request({
                        url: "entry/wxapp/pay",
                        cachetime: "0",
                        data: {
                            openid: n,
                            money: u,
                            order_id: e
                        },
                        success: function(t) {
                            console.log(t), wx.requestPayment({
                                timeStamp: t.data.timeStamp,
                                nonceStr: t.data.nonceStr,
                                package: t.data.package,
                                signType: t.data.signType,
                                paySign: t.data.paySign,
                                success: function(t) {
                                    console.log(t.data), console.log(t), console.log(d);
                                },
                                complete: function(t) {
                                    console.log(t), "requestPayment:fail cancel" == t.errMsg && (wx.showToast({
                                        title: "取消支付",
                                        icon: "loading",
                                        duration: 1e3
                                    }), setTimeout(function() {
                                        wx.reLaunch({
                                            url: "../wddd/order"
                                        });
                                    }, 1e3)), "requestPayment:ok" == t.errMsg && (o.setData({
                                        mdoaltoggle: !1
                                    }), setTimeout(function() {
                                        wx.reLaunch({
                                            url: "../wddd/order?status=2"
                                        });
                                    }, 1e3));
                                }
                            });
                        }
                    }));
                }
            }));
        }
    },
    onReady: function() {},
    onShow: function() {
        var t = wx.getStorageSync("note");
        console.log(t), this.setData({
            note: t
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});