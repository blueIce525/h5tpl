;(function(){

var Mocker = window.Mocker = {
    _mockData: {},

    mock: function(type, source, data, isError){
        var map = this._mockData[type] || (this._mockData[type] = []);

        var obj = {source:source};

        if(isError){
            obj.isError = true;
            obj.error = data;
        }else{
            obj.isError = false;
            obj.data = data;
        }

        map.push(obj);
    },

    mockWindVane: function(source, data, isError){
        this.mock('windvane', source, data, isError);
    },

    mockMtop: function(source, data, isError){
        this.mock('mtop', source, data, isError);
    },

    mockAjax: function(source, data, isError){
        this.mock('ajax', source, data, isError);
    },

    mockJSONP: function(source, data, isError){
        this.mock('jsonp', source, data, isError);
    },

    _match: function(type, request, params){
        var map = this._mockData[type];
        if(!map) return null;

        for(var i = 0; i < map.length; i++){
            var obj = map[i], source = obj.source, matched = false;

            if(typeof source === 'string'){
                matched = source === request;
            }else if(source instanceof RegExp){
                matched = source.test(request);
            }

            if(matched){
                return this._translateData(obj, params);
            }
        }

        return null;
    },

    _translateData: function(mockData, params){
        var data = mockData.data, error = mockData.error;
        var obj = {
            isError: mockData.isError,
            data: typeof data === 'function' ? data(params) : data,
            error: typeof error === 'function' ? error(params) : error
        };
        return obj;
    }
};

})();

//windvane adaptor

;(function(){

var WindVane = window.WindVane || (window.lib && lib.windvane);
if(!WindVane) return;
var call = WindVane.call;

WindVane.call = function(className, methodName, params, success, failure, timeout){
    var api = className + '.' + methodName;
    var mockData = Mocker._match('windvane', api, params);

    if(!mockData && (api === 'WVServer.send' || api === 'MtopWVPlugin.send')){
        if(typeof params === 'string') params = JSON.parse(params);
        mockData = Mocker._match('mtop', params.api, params.data);
    }

    if(mockData){
        return !mockData.isError ? setTimeout(function(){
            success(mockData.data);
        }, 0) : setTimeout(function(){
            failure(mockData.error);
        }, 0);
    }else{
        return call(className, methodName, params, success, failure, timeout);
    }
}

})();

//lib.mtop adaptor

;(function(){

var mtop = window.lib && lib.mtop;
if(!mtop) return;
var request = mtop.request;

mtop.request = function(params, success, failure){
    var api = params.api;
    var mockData = Mocker._match('mtop', api, params.data);

    if(mockData){
        return !mockData.isError ? setTimeout(function(){
            success(mockData.data);
        }, 0) : setTimeout(function(){
            failure(mockData.error);
        }, 0);
    }else{
        return request(params, success, failure);
    }
}

})();

//zepto adaptor

;(function(Zepto){

//
    JsFrame(Zepto)
})(window.Zepto);

//KISSY adaptor

;
(function (KISSY) {
    JsFrame(KISSY)

})(window.KISSY);

// jQuery adaptor

;
(function (jQuery) {
    JsFrame(jQuery)
})(window.jQuery);

//JsFrame function by bingqiong
function JsFrame(jsFrame) {
    if (!jsFrame) return;
    var ajax = jsFrame.ajax;
    jsFrame._ajax = ajax;

    jsFrame.ajax = function (options) {

        var mockData = Mocker._match('ajax', options.url, options.params);
        if (!mockData) {
            mockData = Mocker._match('jsonp', options.url, options.params);
        }

        if (mockData) {
            if (!mockData.isError) {
                var success = options.success;
                return success && setTimeout(function () {
                    success(mockData.data);
                }, 0);
            } else {
                var error = options.error;
                return error && setTimeout(function () {
                    error(mockData.error);
                }, 0);
            }

        } else {
            return ajax.call(jsFrame, options);
        }
    }

}


//universe ajax adaptor

;(function(){

var xhrProto = XMLHttpRequest.prototype;
var xhrOpen = xhrProto.open;
var xhrSend = xhrProto.send;

xhrProto.open = function(method, url, async, user, password){
    this.requestURL = url;
    xhrOpen.call(this, method, url, async, user, password);
};

xhrProto.send = function(data){
    var onreadystatechange = this.onreadystatechange;
    this._onreadystatechange = onreadystatechange;

    if(!onreadystatechange){
        Object.defineProperty(this, 'onreadystatechange', {
            set: function(value){
                this._onreadystatechange = value;
            },
            get: function(){
                return this._onreadystatechange;
            }
        });
    }

    this.onreadystatechange = function(e){
        var onchange = this._onreadystatechange;
        if(this.readyState === 4){
            var mockData = Mocker._match('ajax', this.requestURL, this.requestURL);
            if(mockData && onchange){
                var data;
                if(!mockData.isError){
                    data = mockData.data;
                }else{
                    data = mockData.error;
                    Object.defineProperty(this, 'status', {
                        get: function(){
                            return 500;
                        }
                    });
                }

                try{
                    //can't modify property `responseText` on Safari
                    Object.defineProperty(this, 'responseText', {
                        get: function(){
                            try{
                                var text = JSON.stringify(data);
                            }catch(e){
                                text = data;
                            };
                            return text;
                        }
                    });
                }catch(e){

                }
            }
        }

        onchange && onchange.call(this, e);
    }

    xhrSend.call(this, data);
};

})();


//universe jsonp adaptor

;(function(){

var createElement = document.createElement;

document.createElement = function(tagName){
    var elem = createElement.call(document, tagName);
    if(tagName === 'script'){
        hackScriptElement(elem);
    }
    return elem;
};

function hackScriptElement(scriptElem){
    var setAttribute = scriptElem.setAttribute;

    scriptElem.setAttribute = function(name, value){
        if(name && name.toLowerCase() === 'src'){
            var mockData = Mocker._match('jsonp', value, value);
            if(mockData){
                //find possible jsonp callback function name
                var match = value.match(/[?|&]callback=([^&]+)/i);
                if(match){
                    var callback = window[match[1]];
                    if(callback && typeof callback === 'function'){
                        window[match[1]] = function(){
                            var arg = !mockData.isError ? mockData.data : mockData.error;
                            setTimeout(function(){
                                callback(arg);
                            }, 0);
                        }
                    }
                }
            }
        }
        setAttribute.call(scriptElem, name, value);
    };

    try{
        //can't modify property `src` on Safari
        Object.defineProperty(scriptElem, 'src', {
            set: function(value){
                this._src = value;
                this.setAttribute('src', value);
            },
            get: function(){
                return this._src;
            }
        });
    }catch(e){

    }
}

})();