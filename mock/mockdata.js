
//@example windvane mock
;(function(){

if(!window.Mocker) return;
Mocker.mockAjax('ajax/url',
    {
        "api": "mtop.computron.find.shopfeed",
        "v": "1.0",
        "ret": [
            "SUCCESS::调用成功"
        ],
        "data": {
            "total": "11164",
            "errors": [ ],
            "searchtime": "0.02303",
            "list": [
                {
                    "sellerId": "48844564",
                    "distance": "0.696559",
                    "address": "永庆坊3幢1105室"
                },
                {
                    "sellerId": "2025902035",
                    "distance": "0.70394",
                    "address": "杭州老东升1224"
                }
            ]
        }
    }
);
})();