/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-11
 ** Brief:	游戏逻辑
 ***********************************************************************/
Game = {};
//----------------------------------------------------------------------
// 创建基础节点
Game.createBaseNodes = function() {
	var nodes = {
		root: new laya.ui.Component(),		// 根节点(不允许挂载)
		back: new laya.ui.Component(),		// 底层UI节点(挂载游戏背景等最底层UI)
		scene: new laya.ui.Component(),		// 场景节点(挂载游戏战斗场景)
		middle: new laya.ui.Component(),	// 中层UI节点(挂载非模态UI)
		front: new laya.ui.Component(),		// 上层UI节点(挂载模态UI)
		top: new laya.ui.Component()		// 顶层UI节点(挂载游戏提示等最顶层UI)
	};
    function setBaseNodeProperty(node, zOrder, parent) {
        node.size(Laya.stage.width, Laya.stage.height);
        node.pivot(node.width/2, node.height/2);
        node.pos(node.width/2, node.height/2);
        if ('number' == typeof(zOrder)) {
            node.zOrder = zOrder;
        }
        node.mouseEnabled = true;
        node.mouseThrough = true;
        if (parent) {
            parent.addChild(node);
        }
    }
    setBaseNodeProperty(nodes.root);
    setBaseNodeProperty(nodes.back, 1, nodes.root);
    setBaseNodeProperty(nodes.scene, 2, nodes.root);
    setBaseNodeProperty(nodes.middle, 3, nodes.root);
    setBaseNodeProperty(nodes.front, 4, nodes.root);
    setBaseNodeProperty(nodes.top, 5, nodes.root);
    return nodes;
};
//----------------------------------------------------------------------
// 初始游戏(只能调用一次)
Game.init = function() {
    try {
        // 游戏节点
        var nodes = this.createBaseNodes();
        this.NODE_UI_BACK = nodes.back;
        this.NODE_SCENE = nodes.scene;
        this.NODE_UI_MIDDLE = nodes.middle;
        this.NODE_UI_FRONT = nodes.front;
        this.NODE_UI_TOP = nodes.top;
        nodes.root.pos(Laya.stage.width/2, Laya.stage.height/2);
        Laya.stage.addChild(nodes.root);
        // 初始化
        if (G.SHOW_FPS) {
            laya.utils.Stat.show();
        }
        loadResource(this.run, this);
    } catch (exception) {
        alert(exception.stack);
    }
};
//----------------------------------------------------------------------
// 运行游戏
Game.run = function() {
    try {
		DataTB.reload("audio_tplt", {	// 音频表,字段说明,例.1001:音频id,type:音频类型(1.背景音乐,2.音效),file:音频文件
            1001:{type:1,file:"bgm_cardbing.mp3"},
            2001:{type:2,file:"button_click.mp3"}
        });
		AudioModel.init();
        AudioModel.playMusic(1001);
		UIGame.openMiddle();
    } catch (exception) {
        alert(exception.stack);
    }
};
//----------------------------------------------------------------------
// 页面关闭,刷新
// window.onbeforeunload = function() {
//     return '';
// };
//----------------------------------------------------------------------