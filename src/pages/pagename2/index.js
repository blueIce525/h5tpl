/**
 * Created by kinglan525 on 16/3/22.
 */


;
(function (win, lib, app) {
    var pageName2 = {
        init: function () {
            //缓存this
            var that = this;

            //按照页面划分功能
            that.method1();
            that.method2();

        },
        method1: function () {
            var that = this;
            console.log('我是页面应用的方法1');

            //模版渲染
            var tplData = {
                spm: 'circle',
                accountNick: '帐号昵称',
                timestamp: '2016年3月22日'
            };
            var tplHtml = template('account/index', tplData);
            $(tplHtml).appendTo('.content');

        },
        method2: function () {
            var that = this;
            console.log('我是页面应用的方法2');
        }
    };

    //DOMContentLoaded时执行初始化函数
    $(document).ready(function () {
        pageName2.init();
    });
})(window, window['lib'] || (window['lib'] = {}), window['app'] || (window['app'] = {}));