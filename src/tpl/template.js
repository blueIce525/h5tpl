/*TMODJS:{"debug":true,"version":"1.0.0"}*/
!function() {
    function template(filename, content) {
        return (/string|function/.test(typeof content) ? compile : renderFile)(filename, content);
    }
    function toString(value, type) {
        return "string" != typeof value && (type = typeof value, "number" === type ? value += "" : value = "function" === type ? toString(value.call(value)) : ""), 
        value;
    }
    function escapeFn(s) {
        return escapeMap[s];
    }
    function escapeHTML(content) {
        return toString(content).replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
    }
    function each(data, callback) {
        if (isArray(data)) for (var i = 0, len = data.length; len > i; i++) callback.call(data, data[i], i, data); else for (i in data) callback.call(data, data[i], i);
    }
    function resolve(from, to) {
        var DOUBLE_DOT_RE = /(\/)[^\/]+\1\.\.\1/, dirname = ("./" + from).replace(/[^\/]+$/, ""), filename = dirname + to;
        for (filename = filename.replace(/\/\.\//g, "/"); filename.match(DOUBLE_DOT_RE); ) filename = filename.replace(DOUBLE_DOT_RE, "/");
        return filename;
    }
    function renderFile(filename, data) {
        var fn = template.get(filename) || showDebugInfo({
            filename: filename,
            name: "Render Error",
            message: "Template not found"
        });
        return data ? fn(data) : fn;
    }
    function compile(filename, fn) {
        if ("string" == typeof fn) {
            var string = fn;
            fn = function() {
                return new String(string);
            };
        }
        var render = cache[filename] = function(data) {
            try {
                return new fn(data, filename) + "";
            } catch (e) {
                return showDebugInfo(e)();
            }
        };
        return render.prototype = fn.prototype = utils, render.toString = function() {
            return fn + "";
        }, render;
    }
    function showDebugInfo(e) {
        var type = "{Template Error}", message = e.stack || "";
        if (message) message = message.split("\n").slice(0, 2).join("\n"); else for (var name in e) message += "<" + name + ">\n" + e[name] + "\n\n";
        return function() {
            return "object" == typeof console && console.error(type + "\n\n" + message), type;
        };
    }
    var cache = template.cache = {}, String = this.String, escapeMap = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    }, isArray = Array.isArray || function(obj) {
        return "[object Array]" === {}.toString.call(obj);
    }, utils = template.utils = {
        $helpers: {},
        $include: function(filename, data, from) {
            return filename = resolve(from, filename), renderFile(filename, data);
        },
        $string: toString,
        $escape: escapeHTML,
        $each: each
    }, helpers = template.helpers = utils.$helpers;
    template.get = function(filename) {
        return cache[filename.replace(/^\.\//, "")];
    }, template.helper = function(name, helper) {
        helpers[name] = helper;
    }, "function" == typeof define ? define(function() {
        return template;
    }) : "undefined" != typeof exports ? module.exports = template : this.template = template, 
    template.helper("$getPrice1", function(price) {
        var priceArr = price.split(".");
        return priceArr.length > 0 ? priceArr[0] : "";
    }), template.helper("$getPrice2", function(price) {
        var priceArr = price.split(".");
        return priceArr.length > 1 ? "." + priceArr[1] : "";
    }), template.helper("$getImg80", function() {
        return 1 == window.devicePixelRatio ? "_40x40.jpg" : "_80x80.jpg";
    }), template.helper("$getImg230", function() {
        return 1 == window.devicePixelRatio ? "_110x110xz.jpg" : "_230x230xz.jpg";
    }), template.helper("$getLikeName", function(friend) {
        for (var nameArr = [], i = 0, l = friend.length; l > i; i++) nameArr.push(friend[i].nick);
        var nameString = nameArr.join("，");
        return nameString;
    }), template.helper("$getTime", function(time) {
        var weitaoDate = new Date(Number(time)), y = weitaoDate.getFullYear(), m = weitaoDate.getMonth() + 1, d = weitaoDate.getDate(), timeAll = y + "年" + m + "月" + d + "日";
        return timeAll;
    }), template.helper("$getNum", function(num) {
        var newNum = 0;
        return newNum = num > 0 && 1e4 > num ? num : num >= 1e4 && 99999 > num ? (num / 1e4).toFixed(1) + "万" : (num / 1e4).toFixed(0) + "万";
    }), /*v:70*/
    template("account/index", function($data, $filename) {
        try {
            var $utils = this, $line = ($utils.$helpers, 0), spm = $data.spm, $escape = $utils.$escape, accountNick = $data.accountNick, timestamp = $data.timestamp, $out = "";
            return $out += '<div class="account" > <div class="name-time"> ', $line = 3, "circle" == spm ? ($out += ' <div class="name circle-name">', 
            $line = 4, $out += $escape(accountNick), $out += "</div> ", $line = 5) : ($out += ' <div class="name">', 
            $line = 6, $out += $escape(accountNick), $out += '</div> <p class="pub-time">', 
            $line = 7, $out += $escape(timestamp), $out += "</p> ", $line = 8), $out += " </div> <p>test</p> </div> ", 
            new String($out);
        } catch (e) {
            throw {
                filename: $filename,
                name: "Render Error",
                message: e.message,
                line: $line,
                source: '<div class="account" >\n    <div class="name-time">\n        {{if spm == \'circle\'}}\n        <div class="name circle-name">{{accountNick}}</div>\n        {{else}}\n        <div class="name">{{accountNick}}</div>\n        <p class="pub-time">{{timestamp}}</p>\n        {{/if}}\n    </div>\n    <p>test</p>\n</div>\n'.split(/\n/)[$line - 1].replace(/^\s+/, "")
            };
        }
    });
}();