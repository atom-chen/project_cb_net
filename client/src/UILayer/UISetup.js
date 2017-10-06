/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-14
 ** Brief:	设置界面
 ***********************************************************************/
UISetup = UIDEFINE("UISetup");

UISetup.onStart = function() {
    // 背景
    var bg = UICommon.createImage(ResURL("cardbing_img_back_02.png"), Laya.stage.width/2, Laya.stage.height/2);
    bg.size(Laya.stage.width, Laya.stage.height);
    this.node.addChild(bg);
    // 框
    var frame = UICommon.createImage(ResURL("cardbing_img_bet_set.png"), bg.width/2, bg.height/2);
    bg.addChild(frame);
    // 关闭按钮
    var btnClose = UICommon.createImage(ResURL("cardbing_btn_bet_close.png"), 500, 35);
    this.onClick(btnClose, function() {
        this.close();
    }, this, true, true);
    frame.addChild(btnClose);
    // 音乐按钮
    var isMusicOn = AudioModel.isMusicEnabled();
    var btnBGMusic = UICommon.createImage(this.getMusicPng(isMusicOn), frame.width/2-110, 180);
    this.onClick(btnBGMusic, function() {
        isMusicOn = !isMusicOn;
        AudioModel.setMusicEnabled(isMusicOn);
        if (isMusicOn) {
            AudioModel.playMusic(1001);
        }

        btnBGMusic.skin = this.getMusicPng(isMusicOn);
    }, this, true, true);
    frame.addChild(btnBGMusic);
    // 音效按钮
    var isSoundOn = AudioModel.isSoundEnabled();
    var btnSound = UICommon.createImage(this.getSoundPng(isSoundOn), frame.width/2+110, 180);
    this.onClick(btnSound, function() {
        isSoundOn = !isSoundOn;
        AudioModel.setSoundEnabled(isSoundOn);
        btnSound.skin = this.getSoundPng(isSoundOn);
    }, this, true, true);
    frame.addChild(btnSound);
};

// 根据音乐状态获取音乐按钮图片
UISetup.getMusicPng = function(isMusicOn) {
    if (isMusicOn) {
        return ResURL("cardbing_btn_bet_bgm_1.png");
    } else {
        return ResURL("cardbing_btn_bet_bgm_0.png");
    }
};

// 根据音效状态获取音效按钮图片
UISetup.getSoundPng = function(isSoundOn) {
    if (isSoundOn) {
        return ResURL("cardbing_btn_bet_sound_1.png");
    } else {
        return ResURL("cardbing_btn_bet_sound_0.png");
    }
};