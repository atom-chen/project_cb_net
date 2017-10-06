/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-14
 ** Brief:	开奖界面
 ***********************************************************************/
UILottery = UIDEFINE("UILottery");

UILottery.onStart = function(coin, stakeInfo) {
	console.log("当前金币: " + coin);
	console.log(stakeInfo);
	// 成员变量
	this.mCoin = coin;				// 赛豆
	this.mStakeInfo = stakeInfo;	// 下注信息
	this.CONST_MAX_NUM = 90;		// 90个数字
	this.mCardList = [];			// 6张卡片
	this.mNumBlackList = [];		// 90个数字黑底
	this.mNumImageList = [];		// 90个数字控件
	this.mNumList = [];				// 90个数字,分6组,每组15个
	this.mResultList = [];			// 结果列表(弹出数字)
	this.mResultIdx = 0;			// 当前弹出第几个
	this.mBallSprite = null;		// 球
	this.mNumText = null;			// 弹出数字
	this.mBallEffect = null;		// 球光晕
	this.mCoinText = null;			// 赛豆
	this.mBallText = null;			// 球数
	this.mWinCard = 1;				// 赢得那张卡
	this.mAwardCoin = 0;			// 赢得的赛豆
	this.mCardImageList = [
		ResURL("cardbing_img_cad_1.png"),
		ResURL("cardbing_img_cad_2.png"),
		ResURL("cardbing_img_cad_3.png"),
		ResURL("cardbing_img_cad_4.png"),
		ResURL("cardbing_img_cad_5.png"),
		ResURL("cardbing_img_cad_6.png")
	];
    //
	this.createBg();
	this.createPopNumInfo();
	this.createOddEvenInfo();
	this.createBallList();
	this.createAllCards();
	this.randAllNums();
	this.showStartAnimation();
};

UILottery.onDestroy = function() {
	UIGame.clearStake();	// 清空下注界面下注展示信息
	UIGame.addCoin(this.mAwardCoin);
	UIGame.startCountdown();
};

// 创建背景图
UILottery.createBg = function() {
	// 背景
	var bg = UICommon.createImage(ResURL("cardbing_img_bg.png"), Laya.stage.width/2, Laya.stage.height/2);
    bg.size(Laya.stage.width, Laya.stage.height);
    this.node.addChild(bg);
	// 上面灰条背景
	var topBg = UICommon.createImage(ResURL("cardbing_img_back_01.png"), Laya.stage.width/2, 18);         
	topBg.size(Laya.stage.width, 40);
	topBg.pivot(topBg.width/2, topBg.height);
	this.node.addChild(topBg);        
	// 中间灰条背景
	var midBg = UICommon.createImage(ResURL("lottery_back_00.png"), Laya.stage.width/2, 495);      
	midBg.pivot(midBg.width/2, midBg.height/2);
	this.node.addChild(midBg);
	// 赛豆文字图片
	var coinTextImage = UICommon.createImage(ResURL("cardbing_word_yy.png"), 130, 18);
	this.node.addChild(coinTextImage);
	// 赛豆文字
	var coinText = new laya.display.Text();
	coinText.font = ResURL("cardbing_number_white.fnt");
	coinText.text = this.mCoin;
	coinText.scaleX = 1.2;
	coinText.scaleY = 1.2;
	coinText.pivot(0, coinText.height/2);
	coinText.pos(175, 18);
	this.node.addChild(coinText);
	this.mCoinText = coinText;
	// 球数文字图片
	var ballTextImage = UICommon.createImage(ResURL("lottery_word_qs.png"), Laya.stage.width/2 - 45, 503);
	this.node.addChild(ballTextImage);
	// 球数文字
	var ballText = new laya.display.Text();
	ballText.text = this.formatNumStr(0);
	ballText.font = ResURL("cardbing_number_award.fnt");
	ballText.pivot(ballText.width/2, ballText.height);
	ballText.pos(Laya.stage.width/2 + 45, 520);
	ballText.scaleX = 1.7;
	ballText.scaleY = 1.7;
	this.node.addChild(ballText);
	this.mBallText = ballText;
	// 底部背景
	var bottomBg = UICommon.createImage(ResURL("lottery_back_03.png"), Laya.stage.width/2, 878);
	this.node.addChild(bottomBg);
};

// 创建弹出数字信息
UILottery.createPopNumInfo = function() {
	// 球
	var ballSprite = new laya.display.Sprite();
	ballSprite.loadImage(ResURL("cardbing_img_ball_1.png"));
	ballSprite.pivot(ballSprite.width/2, ballSprite.height/2);
	ballSprite.pos(Laya.stage.width/2, 365);
	this.node.addChild(ballSprite);
	this.mBallSprite = ballSprite;
	// 弹出数字
	var numText = new laya.display.Text();
	numText.text = this.formatNumStr(0);
	numText.font = ResURL("cardbing_number_black.fnt");
	numText.pivot(numText.width/2, numText.height/2);
	numText.pos(Laya.stage.width/2, 365);
	this.node.addChild(numText);
	this.mNumText = numText;
	// 光晕节点
	var ballEffect = new laya.display.Sprite();
	ballEffect.pos(Laya.stage.width/2, 365);
	this.node.addChild(ballEffect);
	this.mBallEffect = ballEffect;
};

// 创建下注信息(我)
UILottery.createStakeMine = function(value, x, y) {
	var mineImage = UICommon.createImage(ResURL("cbnet_bet_in_mine.png"), x, y);
	var mineLabel = laya.createImageLabel(value, "res/Picture/number_bet_green_", -3);
	mineLabel.anchorX = 1;
	mineLabel.pos(100, 13);
	mineImage.addChild(mineLabel);
	return mineImage;
};

// 创建奇偶下注信息
UILottery.createOddEvenInfo = function() {
	var bg = UICommon.createImage(ResURL("lottery_back_01.png"), Laya.stage.width/2 + 200, 373);
	this.node.addChild(bg);
	// 奇数
	if (this.mStakeInfo.odd > 0) {
		var oddImage = UICommon.createImage(ResURL("lottery_word_js.png"), 85, 20);
		bg.addChild(oddImage);
		var oddMine = this.createStakeMine(this.mStakeInfo.odd, 85, 55);
		bg.addChild(oddMine);
	}
	// 偶数
	if (this.mStakeInfo.even > 0) {
		var evenImage = UICommon.createImage(ResURL("lottery_word_os.png"), 85, 90);
		bg.addChild(evenImage);
		var evenMine = this.createStakeMine(this.mStakeInfo.even, 85, 125);
		bg.addChild(evenMine);
		if (this.mStakeInfo.odd <= 0) {
			evenImage.pos(85, 20);
			evenMine.pos(85, 55);
		}
	}
	if (this.mStakeInfo.odd <= 0 && this.mStakeInfo.even <= 0) {
		bg.visible = false;
	} else if (this.mStakeInfo.odd + this.mStakeInfo.even > 0) {
		if (this.mStakeInfo.odd <= 0 || this.mStakeInfo.even <= 0) {
			bg.size(bg.width, bg.height/2);
		}
	}
}

// 创建列表
UILottery.createBallList = function() {
	var list = new laya.ui.List();
	list.itemRender = BallItem;
	list.vScrollBarSkin = "";
	list.renderHandler = new laya.utils.Handler(this, function(cell, index) {
		var dataSource = list.array[index];
		if (dataSource) {
			cell.setBallArea(dataSource.ball_area[0], dataSource.ball_area[1]);
			cell.setRate(dataSource.rate);
			cell.setStake(dataSource.stake);
		}
	});
	list.repeatX = 1;
	list.repeatY = 3;
	list.anchorX = 0.5;
	list.anchorY = 1;
	list.pos(Laya.stage.width/2, 943);
	this.node.addChild(list);
	var dataSourceList = [];
	if (this.mStakeInfo.ball1 > 0) {
		dataSourceList.push({ball_area:G.BALL_AREA1, rate:G.BALL_RATE1, stake:this.mStakeInfo.ball1});
	}
	if (this.mStakeInfo.ball2 > 0) {
		dataSourceList.push({ball_area:G.BALL_AREA2, rate:G.BALL_RATE2, stake:this.mStakeInfo.ball2});
	}
	if (this.mStakeInfo.ball3 > 0) {
		dataSourceList.push({ball_area:G.BALL_AREA3, rate:G.BALL_RATE3, stake:this.mStakeInfo.ball3});
	}
	if (this.mStakeInfo.ball4 > 0) {
		dataSourceList.push({ball_area:G.BALL_AREA4, rate:G.BALL_RATE4, stake:this.mStakeInfo.ball4});
	}
	if (this.mStakeInfo.ball5 > 0) {
		dataSourceList.push({ball_area:G.BALL_AREA5, rate:G.BALL_RATE5, stake:this.mStakeInfo.ball5});
	}
	if (this.mStakeInfo.ball6 > 0) {
		dataSourceList.push({ball_area:G.BALL_AREA6, rate:G.BALL_RATE6, stake:this.mStakeInfo.ball6});
	}
	if (this.mStakeInfo.ball7 > 0) {
		dataSourceList.push({ball_area:G.BALL_AREA7, rate:G.BALL_RATE7, stake:this.mStakeInfo.ball7});
	}
	list.array = dataSourceList;
};

function BallItem() {
	BallItem.__super.call(this);
	this.size(540, 30);
	// 名称
	var nameText = new laya.display.Text();
	nameText.color = "#FFFFFF";
	nameText.text = "消耗球数";
	nameText.fontSize = 20;
	nameText.bold = true;
	nameText.pivot(0, 0);
	nameText.pos(20, 0);
	this.addChild(nameText);
	// 球数
	this.ballText = new laya.display.Text();
	this.ballText.color = "#00FF00";
	this.ballText.text = "25-35";
	this.ballText.fontSize = 20;
	this.ballText.bold = true;
	this.ballText.pivot(0, 0);
	this.ballText.pos(110, 0);
	this.addChild(this.ballText);
	// 倍率
	this.rateText = new laya.display.Text();
	this.rateText.color = "#00FF00";
	this.rateText.text = "2.0";
	this.rateText.fontSize = 20;
	this.rateText.bold = true;
	this.rateText.pivot(0, 0);
	this.rateText.pos(250, 0);
	this.addChild(this.rateText);
	// 赌注
	this.stakeText = new laya.display.Text();
	this.stakeText.color = "#00FF00";
	this.stakeText.text = "3000赛豆";
	this.stakeText.fontSize = 20;
	this.stakeText.bold = true;
	this.stakeText.pivot(this.stakeText.width, 0);
	this.stakeText.pos(490, 0);
	this.addChild(this.stakeText);
	// 设置球数区域
	this.setBallArea = function(start, end) {
		this.ballText.text = start + "-" + end;
	};
	// 设置倍率
	this.setRate = function(rate) {
		this.rateText.text = rate;
	};
	// 设置赌注
	this.setStake = function(stake) {
		this.stakeText.text = stake + "赛豆";
	};
}
Laya.class(BallItem, "BallItem", laya.ui.Box);

// 创建所有卡片
UILottery.createAllCards = function() {
	var leftX = Laya.stage.width/2 - 263;
	var midX = Laya.stage.width/2 - 75;
	var rightX = Laya.stage.width/2 + 113;
	var cardPosList = [	// 卡片位置
		{x:leftX, y:58}, {x:midX, y:58}, {x:rightX, y:58}, 
		{x:leftX, y:555}, {x:midX, y:555}, {x:rightX, y:555}
	];
	for (var i = 0, len = cardPosList.length; i < len; ++i) {
		var p = cardPosList[i];
		var card = this.createCard(i);		
		card.pos(p.x + card.width/2, p.y + card.height/2);
		this.node.addChild(card);
		this.mCardList.push(card);
	}
};

// 创建单张卡片
UILottery.createCard = function(index) {
	var blackImageList = [
		ResURL("black_grid1.png"),
		ResURL("black_grid2.png"),
		ResURL("black_grid3.png"),
		ResURL("black_grid4.png"),
		ResURL("black_grid5.png"),
		ResURL("black_grid6.png")
	];
	var card = new laya.ui.Image(this.mCardImageList[index]);
	card.pivot(card.width/2, card.height/2);
	var num = index*15;
	for (var y = 0; y < 5; ++y) {
		for (var x = 0; x < 3; ++x) {
			++num;
			// 数字黑底
			var blackImage = new laya.display.Sprite();
			blackImage.loadImage(blackImageList[index]);
			blackImage.pos(x*43+8, y*43+4);
			card.addChild(blackImage);
			this.mNumBlackList.push(blackImage);
			// 数字控件
			var numImage = this.createNum(num);
			numImage.pos(x*43+16, y*43+20);  
			card.addChild(numImage);
			this.mNumImageList.push(numImage);
		}
	}
	var stakeList = [
		this.mStakeInfo.pokemon_green,
		this.mStakeInfo.pokemon_red,
		this.mStakeInfo.pokemon_purple,
		this.mStakeInfo.pokemon_blue,
		this.mStakeInfo.pokemon_yellow,
		this.mStakeInfo.pokemon_orange
	];
	if (stakeList[index] > 0) {
		var mineImage = this.createStakeMine(stakeList[index], 75, 225);
		card.addChild(mineImage);
	}
	return card;
};

// 创建单个数字
UILottery.createNum = function(num) {
	var numText = new laya.display.Text();
	numText.text = this.formatNumStr(num);
	numText.font = ResURL("cardbing_number_white.fnt");
	return numText;
};

// 格式化数字
UILottery.formatNumStr = function(num) {
	num += "";
	if (num.length < 2) {
		num = "0" + num;
	}
	return num;
};

// 90个随机数字
UILottery.randAllNums = function() {
	// 先放入90个数字
	this.mNumList = [];
	for (var i = 1; i <= this.CONST_MAX_NUM; ++i) {
		this.mNumList.push(i);
	}
	// 接着随机交换数字
	for (var j = 0; j < this.CONST_MAX_NUM; ++j) {
		var index = this.randInt(this.CONST_MAX_NUM);
		var temp = this.mNumList[j];
		this.mNumList[j] = this.mNumList[index];
		this.mNumList[index] = temp;
	}
	// 最后画出这些数字
	for (var k = 0; k < this.CONST_MAX_NUM; ++k) {
		this.mNumBlackList[k].visible = true;
		this.mNumImageList[k].visible = true;
		this.mNumImageList[k].text = this.formatNumStr(this.mNumList[k]);
	}
};

// 模仿C语言的随机数
UILottery.randInt = function(max) {
	return Math.floor(Math.random()*10000000)%max; 
};

// 显示开场动画
UILottery.showStartAnimation = function() {
	// 中间那个球要隐藏
	this.mBallSprite.alpha = 0;
	this.mNumText.visible = false;
	// 6张卡也要隐藏
	for (var i = 0, len = this.mCardList.length; i < len; ++i) {
		this.mCardList[i].visible = false;
	}
	// 骨骼动画
	var ani = laya.createArmature(ResURL("faka.png"), ResURL("faka.sk"), false, null, null, function() {
		ani.removeSelf();
		ani.destroy();
	}, this);
	ani.pos(Laya.stage.width/2, Laya.stage.height/2 + 8);
	ani.playbackRate(G.SPEED);
	ani.play(0);
	this.node.addChild(ani);
	// 最后一段动画,回调太晚,只能用定时器衔接
	Laya.timer.once(2500/G.SPEED, this, function() {
		// 隐藏所有数字
		this.showAllNums(false);
		// 6张卡也要显示
		var count = this.mCardList.length;
		for (var j = 0, l = this.mCardList.length; j < l; ++j) {
			var card = this.mCardList[j];
			card.visible = true;
			// 翻卡动画
			this.skewOneCardAni(card, function() {
				if (--count <= 0) {
					this.reqResult();
					// this.close();
				}
			});                      
		}
	});
};

// 显示所有数字
UILottery.showAllNums = function(flag) {
	for (var i = 0; i < this.CONST_MAX_NUM; ++i) {
		this.mNumBlackList[i].visible = flag;
		this.mNumImageList[i].visible = flag
	}
};

// 翻卡动画
UILottery.skewOneCardAni = function(card, callback) {
	var oldY = card.y;
	Laya.timer.once(600/G.SPEED, this, function() {
		// 翻卡动画
		laya.utils.Tween.to(card, {y:oldY-20, skewY:5, scaleX:0.0, scaleY:0.95}, 160/G.SPEED, null, Handler.create(this, function() {
			// 显示所有数字
			this.showAllNums(true);
			laya.utils.Tween.to(card, {y:oldY, skewY:0, scaleX:1, scaleY:1}, 160/G.SPEED, null, Handler.create(this, callback));                         
		}));
	});
};

// 请求结果
UILottery.reqResult = function() {
	// 卡信息
	var cardInfo = {};
	cardInfo.card1 = this.mNumList.slice(0, 15);
	cardInfo.card2 = this.mNumList.slice(15, 30);
	cardInfo.card3 = this.mNumList.slice(30, 45);
	cardInfo.card4 = this.mNumList.slice(45, 60);
	cardInfo.card5 = this.mNumList.slice(60, 75);
	cardInfo.card6 = this.mNumList.slice(75, 90);
	var cardStr = JSON.stringify(cardInfo);
	console.log(cardStr);
	// 下注信息
	var betInfo = [];
	betInfo.push(this.mStakeInfo.odd);
	betInfo.push(this.mStakeInfo.even);
	betInfo.push(this.mStakeInfo.pokemon_green);
	betInfo.push(this.mStakeInfo.pokemon_red);
	betInfo.push(this.mStakeInfo.pokemon_purple);
	betInfo.push(this.mStakeInfo.pokemon_blue);
	betInfo.push(this.mStakeInfo.pokemon_yellow);
	betInfo.push(this.mStakeInfo.pokemon_orange);
	betInfo.push(this.mStakeInfo.ball1);
	betInfo.push(this.mStakeInfo.ball2);
	betInfo.push(this.mStakeInfo.ball3);
	betInfo.push(this.mStakeInfo.ball4);
	betInfo.push(this.mStakeInfo.ball5);
	betInfo.push(this.mStakeInfo.ball6);
	betInfo.push(this.mStakeInfo.ball7);
	var betStr = JSON.stringify(betInfo);
	console.log(betStr);
	// 用户名
	var username = laya.net.LocalStorage.getItem("username");
	if ('string' != typeof(username) || 0 == username.length) {
		username = UICommon.createUniqueId(19);
		laya.net.LocalStorage.setItem("username", username);
	}
	console.log(username);
	// 密码
	var password = "123456";
	console.log(password);
	// 发送请求给服务器
	var url = G.SERVER_URL;
	var content = "method=Account.start&card=" + cardStr + "&bet=" + betStr + "&username=" + username + "&password=" + password;
	UICommon.httpSend("get", url, content, [], function(data) {
		console.log("收到数据:" + data);
		this.mResultList = [];
		var resp = JSON.parse(data);
		if (0 == resp.code) {
			this.mResultList = resp.result.ball;			// 命中的球
			this.mResultList = this.mResultList instanceof Array ? this.mResultList : [];
			this.mAwardCoin = parseInt(resp.result.bet);	// 获得的赛豆
			this.mAwardCoin = isNaN(this.mAwardCoin) ? 0 : this.mAwardCoin;
			this.showResult();
		} else {
			UIPrompt.show("Account.start => 返回错误:" + resp.code);
		}
	}, function() {
		UIPrompt.show("httpGet请求错误");
	}, this);
};

// 获取球的索引值
UILottery.getBallColorIndex = function(num) {
	var idx = this.mNumList.indexOf(num);
	return Math.floor(idx/15) + 1;
};

// 算出哪张卡赢了
UILottery.calcWinCard = function() {
	for (var i = 0; i < 6; ++i) {
		var n = 0;
		for (var j = 0; j < 15; ++j) { // 每张卡15个数字
			var v = this.mNumList[i*15 + j];
			if (this.mResultList.indexOf(v) >= 0) {
				++n;
			}
		}
		if (15 == n) {
			return i + 1;
		}
	}
	return null;
};

// 显示结果
UILottery.showResult = function() {
	// 算出哪张卡赢了(服务端没推)
	this.mWinCard = this.calcWinCard();
	console.log("获胜卡: " + this.mWinCard);
	this.mResultIdx = 0;
	// 播放球浮出动画,然后才逐个数字显示
	var num = this.mResultList[this.mResultIdx];
	var colorIdx = this.getBallColorIndex(num);
	// 球颜色变化
	this.mBallSprite.loadImage(ResURL("cardbing_img_ball_" + colorIdx + ".png"));
	// 先放到下方，等会儿飞上来
	this.mBallSprite.pos(Laya.stage.width/2, 375+190);
	this.mBallSprite.scale(0.3, 0.3);
	laya.utils.Tween.to(this.mBallSprite, {alpha:1, y:365, scaleX:1, scaleY:1}, 120/G.SPEED, null, Handler.create(this, function(){
		// 中间那个数字要显示
		this.mNumText.visible = true;
		this.showOneNum();
	}));
};

// 逐个数字弹出显示
UILottery.showOneNum = function() {
	if (this.mResultList.length <= this.mResultIdx) {
		// 最后一个数字播完要隐藏
		Laya.timer.once(1000/G.SPEED, this, function() {
			// 中间那个球要隐藏
			this.mBallSprite.alpha = 0;
			this.mNumText.visible = false;
		});
		// 播放胜利动画
		this.showWinAni();
		return;
	}
	// 光晕特效
	var ani = laya.createArmature(ResURL("faguang.png"), ResURL("faguang.sk"), false, null, null, function() {
		ani.removeSelf();
		ani.destroy();
	}, this);
	ani.pos(0, 0);
	ani.playbackRate(G.SPEED);
	ani.play(0);
	this.mBallEffect.addChild(ani);
	// 球颜色变化
	var num = this.mResultList[this.mResultIdx];
	++this.mResultIdx;
	var colorIdx = this.getBallColorIndex(num);
	this.mBallSprite.loadImage(ResURL("cardbing_img_ball_" + colorIdx + ".png"));
	this.mBallText.text = this.formatNumStr(this.mResultIdx);
	// 开格子特效
	var idx = this.mNumList.indexOf(num);
	var gridLight = new laya.ui.Image(ResURL("black_grid_light.png"));
	gridLight.alpha = 0;
	var card = this.mCardList[colorIdx - 1];
	card.addChild(gridLight);
	var black = this.mNumBlackList[idx];
	gridLight.pos(black.x - 12, black.y - 12);	// 图片没切好,先这样对齐
	laya.utils.Tween.to(gridLight, {alpha:1}, 160/G.SPEED, null, Handler.create(this, function(){
		this.mNumImageList[idx].visible = false;
		this.mNumBlackList[idx].visible = false;
		laya.utils.Tween.to(gridLight, {alpha:0}, 120/G.SPEED, null, Handler.create(this, function(){
			gridLight.removeSelf();
			gridLight.destroy();
		}), 0);
	}));
	// 数字变大又变小特效
	this.mNumText.text = this.formatNumStr(num);
	laya.utils.Tween.to(this.mNumText, {scaleX:1.79, scaleY:1.79}, 80/G.SPEED, null, Handler.create(this, function(){
		laya.utils.Tween.to(this.mNumText, {scaleX:1, scaleY:1}, 80/G.SPEED, null, Handler.create(this, function(){
		}));
	}));
	Laya.timer.once(400/G.SPEED, this, this.showOneNum);
};

// 播放胜利动画
UILottery.showWinAni = function() {
	// 背景
	var bg = new laya.display.Sprite();
	bg.size(Laya.stage.width, Laya.stage.height);
	this.node.addChild(bg);
	// 框
	var frame = new laya.ui.Image(ResURL("cardbing_img_back_01.png"));
	frame.size(Laya.stage.width, 286);
	frame.pivot(frame.width/2, frame.height/2);
	frame.pos(Laya.stage.width/2, Laya.stage.height/2);
	frame.alpha = 0;
	bg.addChild(frame);
	// 卡牌
	var card = new laya.ui.Image(this.mCardImageList[this.mWinCard - 1]);
	card.pivot(card.width, card.height);
	card.pos(card.width, card.height);
	bg.addChild(card);
	// 获胜卡
	var winCard = this.mCardList[this.mWinCard - 1];
	card.pos(winCard.x + card.width/2, winCard.y + card.height/2);
	winCard.visible = false;
	// 矩形光
	var light = new laya.ui.Image(ResURL("fk_guang.png"));
	light.size(card.width + 5, card.height + 10);
	light.pos(-2, -10);
	light.alpha = 0;
	card.addChild(light);
	var winNode = new laya.display.Sprite();
	winNode.pos(Laya.stage.width/2, Laya.stage.height/2);
	bg.addChild(winNode);
	// 平行线
	var uiComlet = new laya.ui.Image(ResURL("cardbing_img_bet_award_complet.png"));
	uiComlet.pivot(uiComlet.width/2, uiComlet.height/2);
	winNode.addChild(uiComlet);
	// 收集完成奖励文字
	var uiTitle = new laya.ui.Image(ResURL("cardbing_word_sjwcjl.png"));
	uiTitle.pivot(uiTitle.width/2, uiTitle.height/2);
	uiTitle.pos(0, -80);
	winNode.addChild(uiTitle);
	// 赛豆
	var uiSaiDou = new laya.ui.Image(ResURL("cardbing_word_sd.png"));
	uiSaiDou.pivot(uiSaiDou.width, uiSaiDou.height/2);
	winNode.addChild(uiSaiDou);
	// 规则说明
	var uiDesc = new laya.display.Text();
	uiDesc.text = "收集完成时，球数越少，奖励越多！";
	uiDesc.color = "#FFFFFF";
	uiDesc.fontSize = 20;
	uiDesc.pivot(uiDesc.width/2, uiDesc.height/2);
	uiDesc.pos(0, 90);
	winNode.addChild(uiDesc);
	// 奖励数字
	var uiRewardNum = new laya.display.Text();
	uiRewardNum.text = this.mAwardCoin;
	uiRewardNum.font = ResURL("cardbing_number_award.fnt");
	uiRewardNum.pivot(0, uiRewardNum.height/2);
	var fScale = 1.8;
	uiRewardNum.scale(fScale, fScale);
	winNode.addChild(uiRewardNum);
	// 赛豆和奖励数字两者共同居中
	var xOffset = -uiRewardNum.width * fScale/2 + uiSaiDou.width/2;
	uiSaiDou.pos(xOffset, +4);
	uiRewardNum.pos(xOffset, 0);
	winNode.alpha = 0;
	winNode.scale(0.5, 0.5);
	// 翻译flash动画 
	var timeLine = new laya.utils.TimeLine();
	timeLine.addLabel("light1",0).to(light,{alpha:1},240,null,0)
			.addLabel("light2",0).to(light,{alpha:0},240,null,0)
			.addLabel("card1",0).to(card,{x: Laya.stage.width/2, 
										y: 300 + card.height,
										scaleX: 1.28,
										scaleY: 1.28,
									},320,null, 0)
			.addLabel("frame",0).to(frame,{alpha:1},320,null,-320)                        
			.addLabel("card2",0).to(card,{x: Laya.stage.width/2, 
										y: 310 + card.height,
										scaleX: 1.30,
										scaleY: 1.30,
									},320,null,0)                                            
			.addLabel("card3",0).to(card,{rotation:-16},360,null,0)                                            
			.addLabel("winNode1",0).to(winNode,{scaleX:1, scaleY:1, alpha:1},160,null,-360)
			.addLabel("winNode2",0).to(winNode,{scaleX:1.05, scaleY:1.05},220,null, -200)
	timeLine.scale = G.SPEED; // 播放速度        
	timeLine.play(0, false);
	timeLine.on(laya.events.Event.COMPLETE, this, function() {
		this.showMoneyChangeAni();
		bg.on("click", this, function(){
			this.close();
		});
	});
};

// 顶部金额改变动画
UILottery.showMoneyChangeAni = function() {
	this.mCoin += this.mAwardCoin;
	this.mCoinText.text = this.mCoin;
};