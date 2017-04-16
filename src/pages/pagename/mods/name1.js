/**
 * Created by kinglan525 on 16/3/23.
 * 这个页面私有的模块,模式参照common里面的两种模式：构造器模式，模块模式
 */

;
(function (win, app) {
    'use strict';
    function Name1(config) {
        var that = this;
        //配置处理
        $.extend(this, {
            getFlag: 0,//加载的标识
            lasted: false,
            container: "",  //容器
            getParam: {},//获取list参数
            curPage: 1,
            pageSize: 20,
            firstTime: true
        }, config);

        //调用初始化函数
        that.init();
    }
    $.extend(Name1.prototype, {
        init: function () {
            //缓存this
            var that = this;

            //按照页面划分功能
            that.method1();
            that.method2();

        },
        method1: function () {
            var that = this;
            console.log('我是私有模块Name1一个功能方法1');
        },
        method2: function () {
            var that = this;
            console.log('我是私有模块Name1一个功能方法1');
        }
    });
    app.Name1 = Name1;
})(window, window['app'] || (window['app'] = {}));