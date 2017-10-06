/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-14
 ** Brief:	资源加载界面
 ***********************************************************************/
UIResLoading = UIDEFINE("UIResLoading");

UIResLoading.onStart = function (callback, target) {
	// 加载界面所需资源
	ResourceLoad([
		{url:ResURL("image_progress_bar.png"), type:laya.net.Loader.IMAGE},
		{url:ResURL("image_progress_bg.png"), type:laya.net.Loader.IMAGE},
		{url:ResURL("image_progress_mask.png"), type:laya.net.Loader.IMAGE},
		{url:ResURL("image_res_loading_bg.png"), type:laya.net.Loader.IMAGE}
	], null, function() {
		this.initUI();
		callback.apply(target, [])
	}, null, this);
	// 事件注册
	this.bind("ED_RES_LOADING", this.updateProgress);
};

// 初始化控件
UIResLoading.initUI = function() {
	var panelX = this.node.x;	// 背景框Y周位置
	var panelY = this.node.y;	// 背景框Y轴位置
	// 背景框
	var panelImage = new laya.ui.Image(ResURL("image_res_loading_bg.png"));
	panelImage.anchorX = 0.5;
	panelImage.anchorY = 0.5;
	panelImage.pos(panelX , panelY + panelImage.height/2);
	this.node.addChild(panelImage);
	// 进度条
	this.mProgress = laya.createProgress(ResURL("image_progress_bg.png"), ResURL("image_progress_bar.png"), ResURL("image_progress_mask.png"), 0);
	this.mProgress.pos(panelX - this.mProgress.width/2, panelImage.y + 10);
	this.node.addChild(this.mProgress);
	// 文本提示
	this.mLabel = new laya.ui.Label("");
	this.mLabel.anchorX = 0.5;
	this.mLabel.anchorY = 0.5;
	this.mLabel.pos(panelX, this.mProgress.y - 30);
	this.mLabel.fontSize = 28;
	this.mLabel.color = "#ffffff";
	this.node.addChild(this.mLabel);
};

// 更新进度条
UIResLoading.updateProgress = function(progress) {
	var progressText = (Math.floor(progress*100)).toString();
	this.mProgress.setValue(progress, false);
	this.mLabel.anchorX = 0.5;
	this.mLabel.anchorY = 0.5;
	this.mLabel.text = progressText + "%";
};
