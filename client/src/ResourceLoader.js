/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-27
 ** Brief:	resource loader
 ***********************************************************************/
var mResourceConfig = ResourceConfigParse(ResourceConfig);
//----------------------------------------------------------------------
// 资源配置解析
function ResourceConfigParse(config) {
    try {
        // 获取资源名,如:Picture/a.png => a.png
        function getResourceName(resourceUrl) {
            var idx = resourceUrl.lastIndexOf("\/");
            if (-1 == idx) {
                return resourceUrl;
            }
            return resourceUrl.substring(idx + 1, resourceUrl.length);
        }
        // 解析
        var checkNameList = {};
        var newConfig = {};
        for (var tag in config) {
            if (config.hasOwnProperty(tag)) {
                newConfig[tag] = {};
                for (var i = 0, len = config[tag].length; i < len; ++i) {
                    var resName = getResourceName(config[tag][i].url);
                    if (checkNameList[resName]) {
                        throw new Error("exist same resource '" + resName + "'in config");
                    }
                    checkNameList[resName] = true;
                    newConfig[tag][resName] = config[tag][i];
                }
            }
        }
        return newConfig;
    } catch (exception) {
        alert(exception.stack);
    }
}
//----------------------------------------------------------------------
// 获取资源路径.name:资源名称(如:a.png);返回:(如:Picture/a.png)
function ResURL(name) {
    for (var tag in mResourceConfig) {
        if (mResourceConfig.hasOwnProperty(tag)) {
            if (mResourceConfig[tag][name]) {
                return mResourceConfig[tag][name].url;
            }
        }
    }
    return name;
}
//----------------------------------------------------------------------
// 资源加载
function ResourceLoad(resourceList, progressCB, loadCB, errorCB, target) {
    if (!(resourceList instanceof Array)) {
        resourceList = [resourceList];
    }
    progressCB = 'function' == typeof(progressCB) ? progressCB : function(){};
    loadCB = 'function' == typeof(loadCB) ? loadCB : function(progress){};
    errorCB = 'function' == typeof(errorCB) ? errorCB : function(errorURL){};
    var totalCount = resourceList.length;
    if (0 == totalCount) {
        loadCB.apply(target, []);
        return;
    }
    var fontList = [];
    var otherList = [];
    for (var i = 0, l = resourceList.length; i < l; ++i) {
        var res = resourceList[i];
        if (".fnt" == res.url.substring(res.url.length - 4)) {
            fontList.push(res);
        } else {
            otherList.push(res);
        }
    }
    var loadedCount = fontList.length;
    function loadFonts() {
        if (0 == fontList.length) {
            loadOthers();
            return;
        }
        function loadFont(fontIndex) {
            var fontName = fontList[fontIndex].url;
            var spacing = fontList[fontIndex].spacing;
            spacing = isNaN(spacing) ? 0 : spacing;
            var bitmapFont = new laya.display.BitmapFont();
            bitmapFont.loadFont(fontName, new laya.utils.Handler(this, onFontLoaded, [bitmapFont, fontName, spacing, fontIndex]));
        }
        function onFontLoaded(bitmapFont, fontName, spacing, fontIndex) {
            bitmapFont.letterSpacing = spacing;
            laya.display.Text.registerBitmapFont(fontName, bitmapFont);
            ++fontIndex;
            progressCB.apply(target, [fontIndex/totalCount]);
            if (fontIndex >= fontList.length) {
                loadOthers();
                return;
            }
            loadFont(fontIndex);
        }
        loadFont(0);
    }
    function loadOthers() {
        Laya.loader.retryNum = 3;
        Laya.loader.load(otherList, laya.utils.Handler.create(this, function() {
            loadCB.apply(target, []);
        }), laya.utils.Handler.create(this, function(progress) {
            ++loadedCount;
            progressCB.apply(target, [loadedCount/totalCount]);
        }, null, false));
        Laya.loader.on(laya.events.Event.ERROR, this, function(errorURL) {
            errorCB.apply(target, [errorURL]);
        });
    }
    loadFonts();
}
//----------------------------------------------------------------------
// 根据资源标签预加载资源.resourceTagList:资源标签列表;progressCB:加载进度回调函数;loadCB:加载完成回调函数;loadCB:加载出错回调函数;target:回调函数宿主对象
function ResourceConfigLoad(resourceTagList, progressCB, loadCB, errorCB, target) {
    if (!(resourceTagList instanceof Array)) {
        resourceTagList = [resourceTagList];
    }
    var resourceList = [];
    for (var i = 0, len = resourceTagList.length; i < len; ++i) {
        var resourceTag = resourceTagList[i];
        for (var key in mResourceConfig[resourceTag]) {
            if (mResourceConfig[resourceTag].hasOwnProperty(key)) {
                resourceList.push(mResourceConfig[resourceTag][key]);
            }
        }
    }
    ResourceLoad(resourceList, progressCB, loadCB, errorCB, target);
}
//----------------------------------------------------------------------
// 加载资源
function loadResource(callback, target) {
    // 打开资源加载界面
    UIResLoading.openFront(true, false, false, function() {
        console.log("开始加载");
        ResourceConfigLoad(["atlas","audio","effect","font","picture","role"], function(progress) {
            console.log("加载进度: " + progress);
            EventCenter.post("ED_RES_LOADING", progress);
        }, function() {
            console.log("加载结束");
            EventCenter.post("ED_RES_LOADING", 1);
            Laya.timer.once(200, this, function() {
                UIResLoading.close();  // 关闭资源加载界面
                callback.apply(target, []);
            });
        }, function(errorURL) {
            alert(errorURL);
        }, this);
    }, this);
}
//----------------------------------------------------------------------