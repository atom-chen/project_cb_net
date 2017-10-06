/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-14
 ** Brief:	通用接口
 ***********************************************************************/
UICommon = {};

// 创建图片
UICommon.createImage = function(skin, x, y) {
    var btn = new laya.ui.Image(skin);
    btn.anchorX = 0.5;
    btn.anchorY = 0.5;
    if (!isNaN(x)) {
        btn.x = x;
    }
    if (!isNaN(y)) {
        btn.y = y;
    }
    return btn;
};

// 发送请求,method:'get'或'post',url:例如('http://42.159.240.231/index.php'),content:例如('name=James&password=123456'),headers:例如(["Token", "2k3rlsdjf823jfs"])
UICommon.httpSend = function(method, url, content, headers, okCB, failCB, target) {
	method = 'string' == typeof(method) && method.length > 0 ? method : 'get';
	okCB = 'function' == typeof(okCB) ? okCB : function(data){};
	failCB = 'function' == typeof(failCB) ? failCB : function(){};
	var hr = new laya.net.HttpRequest();
	hr.once(laya.events.Event.PROGRESS, this, function(e){});
	hr.once(laya.events.Event.COMPLETE, this, function(e) {
		okCB.apply(target, [hr.data]);
	});
	hr.once(laya.events.Event.ERROR, this, function(e) {
		console.log(e);
		failCB.apply(target);
	});
	method = method.toLowerCase();
	if ('get' == method) {
		hr.send(url + "?" + content, null, method, 'text', headers);
	} else if ('post' == method) {
		hr.send(url, content, method, 'text', headers);
	} else {
		throw new Error("can't handle method [" + method + "]");
	}
};

// 生成uid,bit:位数(10-24),如:"1447817348611214450"
UICommon.createUniqueId = function(bit) {
	if ('number' == typeof(bit)) {
		if (bit > 24) {
			bit = 24;
		}
	} else {
		bit = 10;
	}
    var nt = Date.now().toString();
    var offset = bit - nt.length;
    if (0 == offset) {
        return nt;
    } else if (offset < 0) {
        return nt.substr(0, bit);
    }
    var max = 0;
    for (var i = 0; i < offset; ++i) {
        max += Math.pow(10, i) * 9;
    }
    function np (num, bit) {
        var len = num.toString().length;
        while (len++ < bit) {
            num = '0' + num;
        }
        return num.toString();
    }
    return nt + np(Math.floor(Math.random()*max + 0.5), offset);
};
