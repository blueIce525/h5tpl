/**
 * Created by kinglan525 on 16/3/23.
 * 这个页面私有的模块,模式参照common里面的两种模式：构造器模式，模块模式
 */

;
(function (win, app) {
    'use strict';
    app.name2 = (function() {

        //有私有方法需要保护的，放这里。如果没有私有方法，可以全部方法放return里面
        function privateFunction() {
            console.log('我是一个私有方法');
        }

        return {
            attribute1: '属性1',
            attribute2: '属性2',
            method1: function () {
                var that = this;
                console.log('我是私有模块name2一个功能方法1');

                //调用私有方法
                privateFunction();
            },
            method2: function () {
                var that = this;
                console.log('我是私有模块name2一个功能方法2');
            }
        }
    })();

})(window, window['app'] || (window['app'] = {}));