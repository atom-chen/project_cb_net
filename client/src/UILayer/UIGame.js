/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-14
 ** Brief:	游戏界面
 ***********************************************************************/
UIGame = UIDEFINE("UIGame");

UIGame.onStart = function() {
    // 成员变量
    this.mCoin = 10000;                 // 赛豆
    // 初始化
    this.initUI();
    this.startCountdown();
};

// 初始化界面
UIGame.initUI = function() {
    // 创建背景界面
    var bg = UICommon.createImage(ResURL("cbnet_bet_back.png"), Laya.stage.width/2, Laya.stage.height/2);
    this.node.addChild(bg);
    // 创建各区域
    this.createRegionTop(bg, this.mCoin, 1);
    this.createRegionOddEven(bg);
    this.createRegionPokemon(bg);
    this.createRegionBall(bg);
    this.createRegionPlayer(bg);
    this.createRegionBottom(bg);
};

// 创建下注信息
UIGame.createStakeInfo = function(parent, x, y) {
	var total = 0;
	var mine = 0;
	// 总
	var totalImage = UICommon.createImage(ResURL("cbnet_bet_in_all.png"), x, y);
	parent.addChild(totalImage);
	var totalLabel = laya.createImageLabel(total, "res/Picture/number_bet_blue_", -3);
	totalLabel.anchorX = 1;
	totalLabel.pos(100, 13);
	totalImage.addChild(totalLabel);
	// 我
	var mineImage = UICommon.createImage(ResURL("cbnet_bet_in_mine.png"), x, y + 30);
	parent.addChild(mineImage);
	var mineLabel = laya.createImageLabel(mine, "res/Picture/number_bet_green_", -3);
	mineLabel.anchorX = 1;
	mineLabel.pos(100, 13);
	mineImage.addChild(mineLabel);
	// 信息结构体
	var info = {
		addTotal: function(val) {
			total += val;
			if (total > 0) {
				totalLabel.setString(total);
				totalImage.visible = true;
			} else {
				total = 0;
				totalLabel.setString(total);
				totalImage.visible = false;
			}
		},
		addMine: function(val) {
			mine += val;
			if (mine > 0) {
				mineLabel.setString(mine);
				mineImage.visible = true;
			} else {
				mine = 0;
				mineLabel.setString(mine);
				mineImage.visible = false;
			}
		},
		getMine: function() {
			return mine;
		},
		clear: function() {
			total = 0;
			mine = 0;
			totalLabel.setString(total);
			totalImage.visible = false;
			mineLabel.setString(mine);
			mineImage.visible = false;
		}
	}
	info.addTotal(0);
	info.addMine(0);
	return info;
};

// 执行下注(我)
UIGame.doStakeMine = function(info) {
	if (this.mStake > this.mCoin) {
		UIPrompt.show("赛豆不足");
		return;
	}
	// 更新赛豆信息
	this.mCoin -= this.mStake;
	this.mCoinLabel.setString(this.mCoin);
	// 更新下注信息
	info.addTotal(this.mStake);
	info.addMine(this.mStake);
};

// 取消下注(我)
UIGame.undoStakeMine = function(info) {
	var mine = info.getMine();
	// 更新赛豆信息
	this.mCoin += mine;
	this.mCoinLabel.setString(this.mCoin);
	// 更新下注信息
	info.addTotal(-mine);
	info.addMine(-mine);
}

// 取消所有下注(我)
UIGame.undoStakeMineAll = function() {
    // 奇偶
    this.undoStakeMine(this.mOddInfo);
    this.undoStakeMine(this.mEvenInfo);
    // 神奇宝贝
    this.undoStakeMine(this.mPokemonGreenInfo);
    this.undoStakeMine(this.mPokemonRedInfo);
    this.undoStakeMine(this.mPokemonPurpleInfo);
    this.undoStakeMine(this.mPokemonBlueInfo);
    this.undoStakeMine(this.mPokemonYellowInfo);
    this.undoStakeMine(this.mPokemonOrangeInfo);
    // 球数
    this.undoStakeMine(this.mBallInfo1);
    this.undoStakeMine(this.mBallInfo2);
    this.undoStakeMine(this.mBallInfo3);
    this.undoStakeMine(this.mBallInfo4);
    this.undoStakeMine(this.mBallInfo5);
    this.undoStakeMine(this.mBallInfo6);
    this.undoStakeMine(this.mBallInfo7);
};

// 清空下注信息
UIGame.clearStake = function() {
    // 奇偶
    this.mOddInfo.clear();
    this.mEvenInfo.clear();
    // 神奇宝贝
    this.mPokemonGreenInfo.clear();
    this.mPokemonRedInfo.clear();
    this.mPokemonPurpleInfo.clear();
    this.mPokemonBlueInfo.clear();
    this.mPokemonYellowInfo.clear();
    this.mPokemonOrangeInfo.clear();
    // 球数
    this.mBallInfo1.clear();
    this.mBallInfo2.clear();
    this.mBallInfo3.clear();
    this.mBallInfo4.clear();
    this.mBallInfo5.clear();
    this.mBallInfo6.clear();
    this.mBallInfo7.clear();
};

// 获取下注信息
UIGame.getStakeInfo = function() {
    var info = {};
    info.odd = this.mOddInfo.getMine();
    info.even = this.mEvenInfo.getMine();
    info.pokemon_green = this.mPokemonGreenInfo.getMine();
    info.pokemon_red = this.mPokemonRedInfo.getMine();
    info.pokemon_purple = this.mPokemonPurpleInfo.getMine();
    info.pokemon_blue = this.mPokemonBlueInfo.getMine();
    info.pokemon_yellow = this.mPokemonYellowInfo.getMine();
    info.pokemon_orange = this.mPokemonOrangeInfo.getMine();
    info.ball1 = this.mBallInfo1.getMine();
    info.ball2 = this.mBallInfo2.getMine();
    info.ball3 = this.mBallInfo3.getMine();
    info.ball4 = this.mBallInfo4.getMine();
    info.ball5 = this.mBallInfo5.getMine();
    info.ball6 = this.mBallInfo6.getMine();
    info.ball7 = this.mBallInfo7.getMine();
    return info;
};

// 创建顶部区域
UIGame.createRegionTop = function(bg, coin, stakeIndex) {
    // 赛豆
    this.mCoinLabel = laya.createImageLabel(coin, "res/Picture/number_normal_none_", 0);
    this.mCoinLabel.anchorX = 0;
    this.mCoinLabel.pos(165, 21);
    bg.addChild(this.mCoinLabel);
    // 下注1
    var stakeImage1 = UICommon.createImage(ResURL("cbnet_bet_state_select_0.png"), 110, 70);
    bg.addChild(stakeImage1);
    var stakeBtn1 = UICommon.createImage(ResURL("cbnet_bet_btn_select_small_01.png"), 170, 70);
    this.onClick(stakeBtn1, function() {
        this.mStake = setDefaultStakeStatus(1);
    }, this, true, true);
    bg.addChild(stakeBtn1);
    var stakeLabel1 = laya.createImageLabel(G.STAKE1, "res/Picture/number_normal_none_", 0);
    stakeLabel1.pos(42, 24);
    stakeBtn1.addChild(stakeLabel1);
    // 下注2
    var stakeImage2 = UICommon.createImage(ResURL("cbnet_bet_state_select_0.png"), 240, 70);
    bg.addChild(stakeImage2);
    var stakeBtn2 = UICommon.createImage(ResURL("cbnet_bet_btn_select_small_01.png"), 300, 70);
    this.onClick(stakeBtn2, function() {
        this.mStake = setDefaultStakeStatus(2);
    }, this, true, true);
    bg.addChild(stakeBtn2);
    var stakeLabel2 = laya.createImageLabel(G.STAKE2, "res/Picture/number_normal_none_", 0);
    stakeLabel2.pos(42, 24);
    stakeBtn2.addChild(stakeLabel2);
    // 下注3
    var stakeImage3 = UICommon.createImage(ResURL("cbnet_bet_state_select_0.png"), 370, 70);
    bg.addChild(stakeImage3);
    var stakeBtn3 = UICommon.createImage(ResURL("cbnet_bet_btn_select_big_01.png"), 440, 70);
    this.onClick(stakeBtn3, function() {
        this.mStake = setDefaultStakeStatus(3);
    }, this, true, true);
    bg.addChild(stakeBtn3);
    var stakeLabel3 = laya.createImageLabel(G.STAKE3, "res/Picture/number_normal_none_", 0);
    stakeLabel3.pos(52, 24);
    stakeBtn3.addChild(stakeLabel3);
    // 设置按钮
    var setupBtn = UICommon.createImage(ResURL("cbnet_bet_btn_set_01.png"), 570, 70);
    this.onClick(setupBtn, function() {
        UISetup.openFront();
    }, this, true, true);
    bg.addChild(setupBtn);
    // 设置默认下注状态
    function setDefaultStakeStatus(stakeIndex) {
        stakeImage1.skin = ResURL("cbnet_bet_state_select_0.png");
        stakeBtn1.skin = ResURL("cbnet_bet_btn_select_small_01.png");
        stakeBtn1.mouseEnabled = true;
        stakeImage2.skin = ResURL("cbnet_bet_state_select_0.png");
        stakeBtn2.skin = ResURL("cbnet_bet_btn_select_small_01.png");
        stakeBtn2.mouseEnabled = true;
        stakeImage3.skin = ResURL("cbnet_bet_state_select_0.png");
        stakeBtn3.skin = ResURL("cbnet_bet_btn_select_big_01.png");
        stakeBtn3.mouseEnabled = true;
        if (1 == stakeIndex) {
            stakeImage1.skin = ResURL("cbnet_bet_state_select_1.png");
            stakeBtn1.skin = ResURL("cbnet_bet_btn_select_small_02.png");
            stakeBtn1.mouseEnabled = false;
            return G.STAKE1;
        } else if (2 == stakeIndex) {
            stakeImage2.skin = ResURL("cbnet_bet_state_select_1.png");
            stakeBtn2.skin = ResURL("cbnet_bet_btn_select_small_02.png");
            stakeBtn2.mouseEnabled = false;
            return G.STAKE2;
        } else if (3 == stakeIndex) {
            stakeImage3.skin = ResURL("cbnet_bet_state_select_1.png");
            stakeBtn3.skin = ResURL("cbnet_bet_btn_select_big_02.png");
            stakeBtn3.mouseEnabled = false;
            return G.STAKE3;
        }
    }
    stakeIndex = 2 == stakeIndex ? 2 : (3 == stakeIndex ? 3 : 1);
    this.mStake = setDefaultStakeStatus(stakeIndex);
};

// 创建奇偶区域
UIGame.createRegionOddEven = function(bg) {
    // 撤销按钮
    var cancelBtn = UICommon.createImage(ResURL("cbnet_bet_btn_cancel_01.png"), 570, 127);
    this.onClick(cancelBtn, function() {
		this.undoStakeMine(this.mOddInfo);
		this.undoStakeMine(this.mEvenInfo);
    }, this, true, true);
    bg.addChild(cancelBtn);
    // 奇数
    var oddBtn = UICommon.createImage(ResURL("btn_bet_number_odd.png"), 230, 202);
    this.onClick(oddBtn, function() {
		this.doStakeMine(this.mOddInfo);
    }, this, true, true);
    bg.addChild(oddBtn);
    var oddRateLabel = laya.jointSprite([
        laya.createImageLabel("x" + G.ODD_RATE, "res/Picture/number_normal_red_", -4),
        UICommon.createImage(ResURL("number_normal_red_bei.png"))
    ], -5);
    oddRateLabel.pos(118, 56);
    oddRateLabel.scaleX = 1.2;
    oddRateLabel.scaleY = 1.2;
    oddBtn.addChild(oddRateLabel);
	this.mOddInfo = this.createStakeInfo(oddBtn, 120, 30);
    // 偶数
    var evenBtn = UICommon.createImage(ResURL("btn_bet_number_even.png"), 485, 202);
    this.onClick(evenBtn, function() {
		this.doStakeMine(this.mEvenInfo);
    }, this, true, true);
    bg.addChild(evenBtn);
    var evenRateLabel = laya.jointSprite([
        laya.createImageLabel("x" + G.EVEN_RATE, "res/Picture/number_normal_blue_", -4),
        UICommon.createImage(ResURL("number_normal_blue_bei.png"))
    ], -5);
    evenRateLabel.pos(118, 56);
    evenRateLabel.scaleX = 1.2;
    evenRateLabel.scaleY = 1.2;
    evenBtn.addChild(evenRateLabel);
	this.mEvenInfo = this.createStakeInfo(evenBtn, 120, 30);
};

// 创建神奇宝贝区域
UIGame.createRegionPokemon = function(bg) {
    // 撤销按钮
    var cancelBtn = UICommon.createImage(ResURL("cbnet_bet_btn_cancel_01.png"), 570, 280);
    this.onClick(cancelBtn, function() {
        this.undoStakeMine(this.mPokemonGreenInfo);
		this.undoStakeMine(this.mPokemonRedInfo);
		this.undoStakeMine(this.mPokemonPurpleInfo);
		this.undoStakeMine(this.mPokemonBlueInfo);
		this.undoStakeMine(this.mPokemonYellowInfo);
		this.undoStakeMine(this.mPokemonOrangeInfo);
    }, this, true, true);
    bg.addChild(cancelBtn);
    // 绿色神奇宝贝
    var pokemonGreenBtn = UICommon.createImage(ResURL("btn_bet_colour_green.png"), 190, 370);
    this.onClick(pokemonGreenBtn, function() {
		this.doStakeMine(this.mPokemonGreenInfo);
    }, this, true, true);
    bg.addChild(pokemonGreenBtn);
    var pokemonGreenRateLabel = laya.jointSprite([
        laya.createImageLabel("x" + G.POKEMON_GREEN_RATE, "res/Picture/number_normal_", -4),
        UICommon.createImage(ResURL("number_normal_black_bei.png"))
    ], -5);
    pokemonGreenRateLabel.pos(79, 75);
    pokemonGreenBtn.addChild(pokemonGreenRateLabel);
	this.mPokemonGreenInfo = this.createStakeInfo(pokemonGreenBtn, 80, 33);
    // 红色神奇宝贝
    var pokemonRedBtn = UICommon.createImage(ResURL("btn_bet_colour_red.png"), 360, 370);
    this.onClick(pokemonRedBtn, function() {
		this.doStakeMine(this.mPokemonRedInfo);
    }, this, true, true);
    bg.addChild(pokemonRedBtn);
    var pokemonRedRateLabel = laya.jointSprite([
        laya.createImageLabel("x" + G.POKEMON_RED_RATE, "res/Picture/number_normal_", -4),
        UICommon.createImage(ResURL("number_normal_black_bei.png"))
    ], -5);
    pokemonRedRateLabel.pos(79, 75);
    pokemonRedBtn.addChild(pokemonRedRateLabel);
	this.mPokemonRedInfo = this.createStakeInfo(pokemonRedBtn, 80, 33);
    // 紫色神奇宝贝
    var pokemonPurpleBtn = UICommon.createImage(ResURL("btn_bet_colour_purple.png"), 530, 370);
    this.onClick(pokemonPurpleBtn, function() {
		this.doStakeMine(this.mPokemonPurpleInfo);
    }, this, true, true);
    bg.addChild(pokemonPurpleBtn);
    var pokemonPurpleRateLabel = laya.jointSprite([
        laya.createImageLabel("x" + G.POKEMON_PURPLE_RATE, "res/Picture/number_normal_", -4),
        UICommon.createImage(ResURL("number_normal_black_bei.png"))
    ], -5);
    pokemonPurpleRateLabel.pos(79, 75);
    pokemonPurpleBtn.addChild(pokemonPurpleRateLabel);
	this.mPokemonPurpleInfo = this.createStakeInfo(pokemonPurpleBtn, 80, 33);
    // 蓝色神奇宝贝
    var pokemonBlueBtn = UICommon.createImage(ResURL("btn_bet_colour_blue.png"), 190, 470);
    this.onClick(pokemonBlueBtn, function() {
		this.doStakeMine(this.mPokemonBlueInfo);
    }, this, true, true);
    bg.addChild(pokemonBlueBtn);
    var pokemonBlueRateLabel = laya.jointSprite([
        laya.createImageLabel("x" + G.POKEMON_GREEN_RATE, "res/Picture/number_normal_", -4),
        UICommon.createImage(ResURL("number_normal_black_bei.png"))
    ], -5);
    pokemonBlueRateLabel.pos(79, 75);
    pokemonBlueBtn.addChild(pokemonBlueRateLabel);
	this.mPokemonBlueInfo = this.createStakeInfo(pokemonBlueBtn, 80, 33);
    // 黄色神奇宝贝
    var pokemonYellowBtn = UICommon.createImage(ResURL("btn_bet_colour_yellow.png"), 360, 470);
    this.onClick(pokemonYellowBtn, function() {
		this.doStakeMine(this.mPokemonYellowInfo);
    }, this, true, true);
    bg.addChild(pokemonYellowBtn);
    var pokemonYellowRateLabel = laya.jointSprite([
        laya.createImageLabel("x" + G.POKEMON_RED_RATE, "res/Picture/number_normal_", -4),
        UICommon.createImage(ResURL("number_normal_black_bei.png"))
    ], -5);
    pokemonYellowRateLabel.pos(79, 75);
    pokemonYellowBtn.addChild(pokemonYellowRateLabel);
	this.mPokemonYellowInfo = this.createStakeInfo(pokemonYellowBtn, 80, 33);
    // 橘色神奇宝贝
    var pokemonOrangeBtn = UICommon.createImage(ResURL("btn_bet_colour_orange.png"), 530, 470);
    this.onClick(pokemonOrangeBtn, function() {
		this.doStakeMine(this.mPokemonOrangeInfo);
    }, this, true, true);
    bg.addChild(pokemonOrangeBtn);
    var pokemonOrangeRateLabel = laya.jointSprite([
        laya.createImageLabel("x" + G.POKEMON_PURPLE_RATE, "res/Picture/number_normal_", -4),
        UICommon.createImage(ResURL("number_normal_black_bei.png"))
    ], -5);
    pokemonOrangeRateLabel.pos(79, 75);
    pokemonOrangeBtn.addChild(pokemonOrangeRateLabel);
	this.mPokemonOrangeInfo = this.createStakeInfo(pokemonOrangeBtn, 80, 33);
};

// 创建精灵球数区域
UIGame.createRegionBall = function(bg) {
    // 撤销按钮
    var cancelBtn = UICommon.createImage(ResURL("cbnet_bet_btn_cancel_01.png"), 570, 558);
    this.onClick(cancelBtn, function() {
        this.undoStakeMine(this.mBallInfo1);
		this.undoStakeMine(this.mBallInfo2);
		this.undoStakeMine(this.mBallInfo3);
		this.undoStakeMine(this.mBallInfo4);
		this.undoStakeMine(this.mBallInfo5);
		this.undoStakeMine(this.mBallInfo6);
		this.undoStakeMine(this.mBallInfo7);
    }, this, true, true);
    bg.addChild(cancelBtn);
    // 球数(1)
    var ballBtn1 = UICommon.createImage(ResURL("btn_bet_count_big.png"), 183, 655);
    this.onClick(ballBtn1, function() {
        this.doStakeMine(this.mBallInfo1);
    }, this, true, true);
    bg.addChild(ballBtn1);
    var ballAreaLabel1 = laya.createImageLabel(G.BALL_AREA1[0] + "-" + G.BALL_AREA1[1], "res/Picture/number_normal_red_", -4);
    ballAreaLabel1.pos(83, 30);
    ballBtn1.addChild(ballAreaLabel1);
    var ballRateLabel1 = laya.jointSprite([
        laya.createImageLabel("x" + G.BALL_RATE1, "res/Picture/number_normal_red_", -4),
        UICommon.createImage(ResURL("number_normal_red_bei.png"))
    ], -5);
    ballRateLabel1.pos(83, 65);
    ballBtn1.addChild(ballRateLabel1);
	this.mBallInfo1 = this.createStakeInfo(ballBtn1, 85, 35);
    // 球数(2)
    var ballBtn2 = UICommon.createImage(ResURL("btn_bet_count_small.png"), 329, 655);
    this.onClick(ballBtn2, function() {
        this.doStakeMine(this.mBallInfo2);
    }, this, true, true);
    bg.addChild(ballBtn2);
    var ballAreaLabel2 = laya.createImageLabel(G.BALL_AREA2[0] + "-" + G.BALL_AREA2[1], "res/Picture/number_normal_red_", -4);
    ballAreaLabel2.anchorX = 0.5;
    ballAreaLabel2.anchorY = 0.5;
    ballAreaLabel2.pos(57, 30);
    ballBtn2.addChild(ballAreaLabel2);
    var ballRateLabel2 = laya.jointSprite([
        laya.createImageLabel("x" + G.BALL_RATE2, "res/Picture/number_normal_red_", -4),
        UICommon.createImage(ResURL("number_normal_red_bei.png"))
    ], -5);
    ballRateLabel2.pos(57, 65);
    ballBtn2.addChild(ballRateLabel2);
	this.mBallInfo2 = this.createStakeInfo(ballBtn2, 57, 35);
    // 球数(3)
    var ballBtn3 = UICommon.createImage(ResURL("btn_bet_count_small.png"), 448, 655);
    this.onClick(ballBtn3, function() {
        this.doStakeMine(this.mBallInfo3);
    }, this, true, true);
    bg.addChild(ballBtn3);
    var ballAreaLabel3 = laya.createImageLabel(G.BALL_AREA3[0] + "-" + G.BALL_AREA3[1], "res/Picture/number_normal_red_", -4);
    ballAreaLabel3.anchorX = 0.5;
    ballAreaLabel3.anchorY = 0.5;
    ballAreaLabel3.pos(57, 30);
    ballBtn3.addChild(ballAreaLabel3);
    var ballRateLabel3 = laya.jointSprite([
        laya.createImageLabel("x" + G.BALL_RATE3, "res/Picture/number_normal_red_", -4),
        UICommon.createImage(ResURL("number_normal_red_bei.png"))
    ], -5);
    ballRateLabel3.pos(57, 65);
    ballBtn3.addChild(ballRateLabel3);
	this.mBallInfo3 = this.createStakeInfo(ballBtn3, 57, 35);
    // 球数(4)
    var ballBtn4 = UICommon.createImage(ResURL("btn_bet_count_small.png"), 567, 655);
    this.onClick(ballBtn4, function() {
        this.doStakeMine(this.mBallInfo4);
    }, this, true, true);
    bg.addChild(ballBtn4);
    var ballAreaLabel4 = laya.createImageLabel(G.BALL_AREA4[0] + "-" + G.BALL_AREA4[1], "res/Picture/number_normal_red_", -4);
    ballAreaLabel4.anchorX = 0.5;
    ballAreaLabel4.anchorY = 0.5;
    ballAreaLabel4.pos(57, 30);
    ballBtn4.addChild(ballAreaLabel4);
    var ballRateLabel4 = laya.jointSprite([
        laya.createImageLabel("x" + G.BALL_RATE4, "res/Picture/number_normal_red_", -4),
        UICommon.createImage(ResURL("number_normal_red_bei.png"))
    ], -5);
    ballRateLabel4.pos(57, 65);
    ballBtn4.addChild(ballRateLabel4);
	this.mBallInfo4 = this.createStakeInfo(ballBtn4, 57, 35);
    // 球数(5)
    var ballBtn5 = UICommon.createImage(ResURL("btn_bet_count_small.png"), 158, 765);
    this.onClick(ballBtn5, function() {
        this.doStakeMine(this.mBallInfo5);
    }, this, true, true);
    bg.addChild(ballBtn5);
    var ballAreaLabel5 = laya.createImageLabel(G.BALL_AREA5[0] + "-" + G.BALL_AREA5[1], "res/Picture/number_normal_red_", -4);
    ballAreaLabel5.anchorX = 0.5;
    ballAreaLabel5.anchorY = 0.5;
    ballAreaLabel5.pos(57, 30);
    ballBtn5.addChild(ballAreaLabel5);
    var ballRateLabel5 = laya.jointSprite([
        laya.createImageLabel("x" + G.BALL_RATE5, "res/Picture/number_normal_red_", -4),
        UICommon.createImage(ResURL("number_normal_red_bei.png"))
    ], -5);
    ballRateLabel5.pos(57, 65);
    ballBtn5.addChild(ballRateLabel5);
	this.mBallInfo5 = this.createStakeInfo(ballBtn5, 57, 35);
    // 球数(6)
    var ballBtn6 = UICommon.createImage(ResURL("btn_bet_count_small.png"), 278, 765);
    this.onClick(ballBtn6, function() {
        this.doStakeMine(this.mBallInfo6);
    }, this, true, true);
    bg.addChild(ballBtn6);
    var ballAreaLabel6 = laya.createImageLabel(G.BALL_AREA6[0] + "-" + G.BALL_AREA6[1], "res/Picture/number_normal_red_", -4);
    ballAreaLabel6.anchorX = 0.5;
    ballAreaLabel6.anchorY = 0.5;
    ballAreaLabel6.pos(57, 30);
    ballBtn6.addChild(ballAreaLabel6);
    var ballRateLabel6 = laya.jointSprite([
        laya.createImageLabel("x" + G.BALL_RATE6, "res/Picture/number_normal_red_", -4),
        UICommon.createImage(ResURL("number_normal_red_bei.png"))
    ], -5);
    ballRateLabel6.pos(57, 65);
    ballBtn6.addChild(ballRateLabel6);
	this.mBallInfo6 = this.createStakeInfo(ballBtn6, 57, 35);
    // 球数(7)
    var ballBtn7 = UICommon.createImage(ResURL("btn_bet_count_big.png"), 425, 765);
    this.onClick(ballBtn7, function() {
        this.doStakeMine(this.mBallInfo7);
    }, this, true, true);
    bg.addChild(ballBtn7);
    var ballAreaLabel7 = laya.createImageLabel(G.BALL_AREA7[0] + "-" + G.BALL_AREA7[1], "res/Picture/number_normal_red_", -4);
    ballAreaLabel7.anchorX = 0.5;
    ballAreaLabel7.anchorY = 0.5;
    ballAreaLabel7.pos(83, 30);
    ballBtn7.addChild(ballAreaLabel7);
    var ballRateLabel7 = laya.jointSprite([
        laya.createImageLabel("x" + G.BALL_RATE7, "res/Picture/number_normal_red_", -4),
        UICommon.createImage(ResURL("number_normal_red_bei.png"))
    ], -5);
    ballRateLabel7.pos(83, 65);
    ballBtn7.addChild(ballRateLabel7);
	this.mBallInfo7 = this.createStakeInfo(ballBtn7, 85, 35);
};

// 创建房间玩家区域
UIGame.createRegionPlayer = function(bg) {

};

// 创建底部区域
UIGame.createRegionBottom = function(bg) {
    // 倒计时
    this.mCountdownLabel = laya.createImageLabel(0, "res/Picture/number_cd_", -5);
    this.mCountdownLabel.pos(477, 930);
    bg.addChild(this.mCountdownLabel);
};

// 开始倒计时
UIGame.startCountdown = function() {
    this.doCountdown = function(countdownLabel, countdownNum) {
        laya.callAfter(1, function() {
            --countdownNum;
            if (countdownNum < 0) {
				UISetup.close();
                UILottery.openFront(true, false, false, this.mCoin, this.getStakeInfo());
                return;
            }
            countdownLabel.setString(countdownNum);
            this.doCountdown(countdownLabel, countdownNum);
        }, this);
    };
    this.mCountdownLabel.setString(G.COUNTDOWN);
    if (G.COUNTDOWN > 0) {
        this.doCountdown(this.mCountdownLabel, G.COUNTDOWN);
    }
};

// 添加赛豆
UIGame.addCoin = function(coin) {
    coin = isNaN(coin) ? 0 : coin;
    this.mCoin += coin;
    this.mCoinLabel.setString(this.mCoin);
};
