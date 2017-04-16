template.helper('$getPrice1', function(price) {
    var priceArr = price.split('.');
    if(priceArr.length > 0) {
        return priceArr[0];
    } else {
        return '';
    }
});
template.helper('$getPrice2', function (price) {
    var priceArr = price.split('.');
    if (priceArr.length > 1) {
        return '.'+ priceArr[1];
    } else {
        return ''
    }
});

template.helper('$getImg80', function () {
    if (window.devicePixelRatio == 1){
        return '_40x40.jpg'
    } else {
        return '_80x80.jpg'
    }
});
template.helper('$getImg230', function () {
    if (window.devicePixelRatio == 1) {
        return '_110x110xz.jpg'
    } else {
        return '_230x230xz.jpg'
    }

});
template.helper('$getLikeName', function (friend) {

    var nameArr = [];
    for(var i = 0, l = friend.length; i < l; i++) {
        nameArr.push(friend[i].nick);
    }
    var nameString = nameArr.join('，');
    return nameString
});
template.helper('$getTime', function (time) {
    var weitaoDate = new Date(Number(time));
    var y = weitaoDate.getFullYear();
    var m = weitaoDate.getMonth() + 1;
    var d = weitaoDate.getDate();
    var timeAll = y + '年' + m + '月' + d + '日';
    return timeAll;
});
template.helper('$getNum', function (num) {
    var newNum = 0;
    if (num > 0 && num < 10000) {
        newNum = num;
    } else if (num >= 10000 && num < 99999) {
        newNum = (num / 10000).toFixed(1) + '万';
    } else {
        newNum = (num / 10000).toFixed(0) + '万';
    }
    return newNum;
});

