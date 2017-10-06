/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-17
 ** Brief:	提示
 ***********************************************************************/
UIPrompt = UIDEFINE("UIPrompt");

// 显示提示
UIPrompt.show = function(text) {
    this.openTop();
	if ('string' != typeof(text) || 0 == text.length) {
		return;
	}
    var promptLabel = new laya.ui.Label(text);
    promptLabel.align = "center";
    promptLabel.valign = "middle";
    promptLabel.color = "#00FF00";
	promptLabel.bold = true;
    promptLabel.fontSize = 30;
    promptLabel.anchorX = 0.5;
    promptLabel.anchorY = 0.5;
    promptLabel.pos(Laya.stage.width/2, Laya.stage.height/2);
    laya.utils.Tween.to(promptLabel, {y:200}, 2000, null, Handler.create(this, function() {
        promptLabel.removeSelf();
        promptLabel.destroy();
    }));
    this.node.addChild(promptLabel);
};
