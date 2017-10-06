var Loader = laya.net.Loader;
var Handler = laya.utils.Handler;

// 分辨率设计
var wDivH = Laya.Browser.width/Laya.Browser.height;
var showWidth = 720; // 屏幕宽度540~720之间
if (wDivH <= 540/960) {
	showWidth = 540;
} else if (wDivH >= showWidth/960) {
	showWidth = showWidth;
} else {
	showWidth = 960 * wDivH;
}    
Laya.init(showWidth, 960, Laya.WebGL);
Laya.stage.scaleMode = "showall";
Laya.stage.alignH = 'center';
Laya.stage.alignV = 'middle';
// 运行游戏
Game.init();