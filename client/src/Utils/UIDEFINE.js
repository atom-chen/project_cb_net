/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-11
 ** Brief:	ui define
 ***********************************************************************/
//----------------------------------------------------------------------
// 定义界面
function UIDEFINE(clsName, nodeCls) {
	var cls = {};
	cls._className = clsName;
	var parent = null;
	var isParentStage = false;
	// 检测父节点
	function checkParent(parentNode) {
		if (!parent) {
			parent = Laya.stage;
			isParentStage = true;
		}
		if (parentNode) {
			if (parent != parentNode) {
				cls.close();
			}
			parent = parentNode;
			isParentStage = false;
		}
	}
	// 获取节点
	function getNode() {
		if ('function' == typeof(nodeCls)) {
			return new nodeCls();
		}
	}
	// 打开底层界面(显示在底层)
	cls.openBack = function() {
		try {
			checkParent(Game.NODE_UI_BACK);
            if (UI.isOpened(cls)) {
                return;
            }
			console.log("open back ui >>> className: " + cls._className);
			cls._children = {};
			var args = [cls, cls._className, getNode(), false, null, parent];
			for (var i = 0, len = arguments.length; i < len; ++i) {
				args.push(arguments[i]);
			}
            var ui = UI.open.apply(UI, args);
			if (isParentStage) {
				ui.root.zOrder = 1;
			}
		} catch (exception) {
			alert(exception.stack);
		}
	}
	// 打开中间界面(显示在中间层,触摸事件可穿透给低层界面)
	cls.openMiddle = function () {
		try {
			checkParent(Game.NODE_UI_MIDDLE);
            if (UI.isOpened(cls)) {
                return;
            }
			console.log("open middle ui >>> className: " + cls._className);
			cls._children = {};
			var args = [cls, cls._className, getNode(), false, null, parent];
			for (var i = 0, len = arguments.length; i < len; ++i) {
				args.push(arguments[i]);
			}
            var ui = UI.open.apply(UI, args);
			if (isParentStage) {
				ui.root.zOrder = 2;
			}
		} catch (exception) {
			alert(exception.stack);
		}
	};
	// 打开上层界面(显示在上层,并吞吃低层界面的触摸事件)
	cls.openFront = function (focus, showGray, showBounce) {
		try {
			checkParent(Game.NODE_UI_FRONT);
            if (UI.isOpened(cls)) {
                return;
            }
			console.log("open front ui >>> className: " + cls._className);
			cls._children = {};
			focus = ('boolean' == typeof(focus)) ? focus : true;
			var args = [cls, cls._className, getNode(), true, function (event) {
				if (laya.events.Event.CLICK == event.type && !focus) {
					cls.close();
				}
			}, parent];
			for (var i = 3, len = arguments.length; i < len; ++i) {
				args.push(arguments[i]);
			}
			var ui = UI.open.apply(UI, args);
			if (isParentStage) {
				ui.root.zOrder = 3;
			}
			// 显示灰色背景
			showGray = ('boolean' == typeof(showGray)) ? showGray : false;
			if (showGray) {
				var grayImage = new laya.ui.Image(ResURL("image_bg_gray.png"));
				if (grayImage && !grayImage.destroyed) {
					grayImage.scaleX = Laya.Browser.clientWidth / grayImage.width;
					grayImage.scaleY = Laya.Browser.clientHeight / grayImage.height;
					grayImage.anchorX = 0.5;
					grayImage.anchorY = 0.5;
					grayImage.pos(Laya.stage.width / 2, Laya.stage.height / 2);
					grayImage.zOrder = 1;
					ui.root.addChild(grayImage);
				}
				// 灰色背景管理
				UI.mFrontGrayTable = 'undefined' == typeof(UI.mFrontGrayTable) ? [] : UI.mFrontGrayTable;
				var maxZOrder = -1/0;
				var maxZOrderGray = null;
				for (var j = 0, l = UI.mFrontGrayTable.length; j < l; ++j) {
					var zOrder = UI.mFrontGrayTable[j].root.zOrder;
					if (zOrder >= maxZOrder) {
						maxZOrder = zOrder;
						maxZOrderGray = UI.mFrontGrayTable[j].image;
					}
				}
				if (ui.root.zOrder >= maxZOrder) {
					if (maxZOrderGray && !maxZOrderGray.destroyed) {
						maxZOrderGray.visible = false;
					}
					if (grayImage && !grayImage.destroyed) {
						grayImage.visible = true;
					}
				} else {
					if (maxZOrderGray && !maxZOrderGray.destroyed) {
						maxZOrderGray.visible = true;
					}
					if (grayImage && !grayImage.destroyed) {
						grayImage.visible = false;
					}
				}
				UI.mFrontGrayTable.push({name:cls._className, root:ui.root, image:grayImage});
			}
			// 弹性效果
			showBounce = ('boolean' == typeof(showBounce)) ? showBounce : false;
			if (showBounce) {
				var orignalScaleX = ui.node.scaleX;
				var orignalScaleY = ui.node.scaleY;
				laya.utils.Tween.to(ui.node, {scaleX:orignalScaleX * 1.1, scaleY:orignalScaleY * 1.1}, 120, null, laya.utils.Handler.create(null, function() {
					laya.utils.Tween.to(ui.node, {scaleX:orignalScaleX, scaleY:orignalScaleY}, 120);
				}, null, false));
			}
		} catch (exception) {
			console.log(exception);
			alert(exception.stack);
		}
	};
	// 打开顶层界面(显示在顶层,触摸事件可穿透给低层界面)
	cls.openTop = function () {
		try {
			checkParent(Game.NODE_UI_TOP);
            if (UI.isOpened(cls)) {
                return;
            }
			console.log("open top ui >>> className: " + cls._className);
			cls._children = {};
			var args = [cls, cls._className, getNode(), false, null, parent];
			for (var i = 0, len = arguments.length; i < len; ++i) {
				args.push(arguments[i]);
			}
            var ui = UI.open.apply(UI, args);
			if (isParentStage) {
				ui.root.zOrder = 4;
			}
		} catch (exception) {
			alert(exception.stack);
		}
	};
	// 关闭界面
	cls.close = function () {
		try {
            if (!UI.isOpened(cls)) {
                return;
            }
			console.log("close ui <<< className: " + cls._className);
			UI.close(cls, cls._className);
			for (var key in cls) {
				if (cls.hasOwnProperty(key) && 'function' != typeof(cls[key]) && '_className' != key) {
					delete cls[key];
				}
			}
			cls._children = {};
			// 灰色背景管理
			UI.mFrontGrayTable = 'undefined' == typeof(UI.mFrontGrayTable) ? [] : UI.mFrontGrayTable;
			for (var i = 0, len = UI.mFrontGrayTable.length; i < len; ++i) {
				if (UI.mFrontGrayTable[i].name == cls._className) {
					UI.mFrontGrayTable.splice(i, 1);
					break;
				}
			}
			var maxZOrder = -1/0;
			var maxZOrderGray = null;
			for (var j = 0, l = UI.mFrontGrayTable.length; j < l; ++j) {
				var zOrder = UI.mFrontGrayTable[j].root.zOrder;
				if (zOrder >= maxZOrder) {
					maxZOrder = zOrder;
					maxZOrderGray = UI.mFrontGrayTable[j].image;
				}
			}
			if (maxZOrderGray) {
				maxZOrderGray.visible = true;
			}
		} catch (exception) {
			alert(exception.stack);
		}
	};
	// 获取子节点
	cls.getChild = function (childName) {
		return UI.getChild(cls.root, cls._children, childName);
	};
	// 获取类名
	cls.getClassName = function () {
		return cls._className;
	};
	// 注册点击事件:scaleFlag-开启缩放,soundFlag-开启声音|声音id
	cls.onClick = function (sprite, clickCB, target, scaleFlag, soundFlag) {
		if (!sprite) {
			throw new Error("sprite is null");
		}
		if ('function' != typeof(clickCB)) {clickCB = function(){};}
		var orignalScaleX = sprite.scaleX;
		var orignalScaleY = sprite.scaleY;
		function onScaleAction(scale) {	// 按钮缩放动作
			if (scaleFlag) {
				sprite.scaleX = orignalScaleX*('number' == typeof(scale) ? scale : 1);
				sprite.scaleY = orignalScaleY*('number' == typeof(scale) ? scale : 1);
			}
		}
		function onSoundAction() {		// 按钮按下声音
			if ('boolean' == typeof(soundFlag) && soundFlag) {
                AudioModel.playSound(2001);
            } else if ('number' == typeof(soundFlag) && soundFlag > 0) {
                AudioModel.playSound(soundFlag);
            }
		}
		var mouseDownFlag = false
		sprite.on(laya.events.Event.MOUSE_DOWN, null, function() {
			mouseDownFlag = true;
			onScaleAction(0.9);
			onSoundAction();
		})
		sprite.on(laya.events.Event.MOUSE_OVER, null, function() {
			if (mouseDownFlag) {
				onScaleAction(0.9);
			}
		})
		sprite.on(laya.events.Event.MOUSE_UP, null, function() {
			mouseDownFlag = false;
			onScaleAction(1);
		})
		sprite.on(laya.events.Event.MOUSE_OUT, null, function() {
			mouseDownFlag = false;
			onScaleAction(1);
		})
		if (laya.ui.Button == sprite.constructor || laya.ui.CheckBox == sprite.constructor || laya.ui.Radio == sprite.constructor) {
			sprite.clickHandler = laya.utils.Handler.create(this, function() {
				mouseDownFlag = false;
				clickCB.apply(target, [sprite]);
			}, [], false);
		} else {
			sprite.on(laya.events.Event.CLICK, null, function(event) {
				mouseDownFlag = false;
				clickCB.apply(target, [sprite]);
			});
		}
	};
	return cls;
}
//----------------------------------------------------------------------
// 更新界面
function UIUPDATE(dt) {
	if ('object' == typeof(UI) && 'function' == typeof(UI.update)) {
		UI.update(dt);
	}
}
//----------------------------------------------------------------------
// 清空界面
function UICLEAR() {
	UI.closeAll();
	UI.mClsTable = 'undefined' == typeof(UI.mClsTable) ? {} : UI.mClsTable;
	for (var key in UI.mClsTable) {
		if (UI.mClsTable.hasOwnProperty(key)) {
			for (var k in UI.mClsTable[key]) {
				if (UI.mClsTable[key].hasOwnProperty(k)) {
					if ('function' != typeof(UI.mClsTable[key][k]) && '_className' != k) {
						delete UI.mClsTable[key][k];
					}
				}
			}
		}
	}
	UI.mDelayLayerTable = [];
	UI.mCurrDelayLayer = null;
	UI.mFrontGrayTable = [];
}
//----------------------------------------------------------------------
// 添加延迟界面
function UIDELAYPUSH(layer, focus, showGray, showBounce) {
	UI.mDelayLayerTable = 'undefined' == typeof(UI.mDelayLayerTable) ? [] : UI.mDelayLayerTable;
	var delay = {};
	delay.layer = layer;
    delay.focus = 'boolean' != typeof(focus) ? true : focus;
    delay.show_gray = 'boolean' != typeof(showGray) ? true : showGray;
    delay.show_bounce = 'boolean' != typeof(showBounce) ? true : showBounce;
	delay.params = Array.prototype.slice.call(arguments, 4);
	UI.mDelayLayerTable.push(delay);
}
//----------------------------------------------------------------------
// 弹出延迟界面
function UIDELAYPOP(layer) {
	if (UI.isOpened(layer) || UI.isOpened(UI.mCurrDelayLayer)) {
		return false;
	}
	UI.mDelayLayerTable = 'undefined' == typeof(UI.mDelayLayerTable) ? [] : UI.mDelayLayerTable;
	for (var i = 0, len = UI.mDelayLayerTable.length; i < len; ++i) {
		if (!layer || layer === UI.mDelayLayerTable[i].layer) {
            var delay = UI.mDelayLayerTable[i];
			UI.mCurrDelayLayer = delay.layer;
			var args = [delay.focus, delay.show_gray, delay.show_bounce];
			for (var j = 0, l = delay.params.length; j < l; ++j) {
				args.push(delay.params[j]);
			}
			openFront.apply(delay.layer, args);
			UI.mDelayLayerTable.splice(i, 1);
			return true;
		}
	}
    UI.mCurrDelayLayer = null;
    return false;
}
//----------------------------------------------------------------------