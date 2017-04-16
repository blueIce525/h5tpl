/**
 * Created by kinglan525 on 16/3/22.
 */
;
(function (win, lib, app) {

    var pageName = {
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
            console.log('watch test hi 11');

            //模版渲染
            var tplData = {
                spm: 'circle',
                accountNick: '帐号昵称',
                timestamp: '2016年3月22日'
            };
            var tplHtml = template('account/index', tplData);
            $(tplHtml).appendTo('#content');

            //调用common/js里面共有模块调用
            var libName1 = new lib.Name1({
                'name1': 'value1',
                'name1': 'value2'
            });

            lib.name2.method1();
            lib.name2.method2();

            //调用mods里面共有模块调用
            var libName1 = new app.Name1({
                'name1': 'value1',
                'name1': 'value2'
            });

            app.name2.method1();
            app.name2.method2();


            //用mock模拟请求，返回一个假数据写demo
            $.ajax({
                url: "ajax/url",
                dataType: "json", //返回的数据类型,text 或者 json数据，建议为json
                type: "get", //传参方式，get 或post
                data: {
                    uid: "123123" //传过去的参数，格式为 变量名：变量值
                },
                error: function (msg) {  //若Ajax处理失败后回调函数，msg是返回的错误信息
                    console.log("Ajax跳转处理失败");
                },
                success: function (data) { //若Ajax处理成功后的回调函数，data是返回的页面信息
                    console.log('返回的假数据打印如下');
                    console.log(data);
                }
            });

        },
        method2: function () {
            var that = this;
            console.log('我是页面应用的方法2');
        }
    };

    //DOMContentLoaded时执行初始化函数
    $(document).ready(function () {
        pageName.init();
    });
})(window, window['lib'] || (window['lib'] = {}), window['app'] || (window['app'] = {}));