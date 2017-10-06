/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-12
 ** Brief:	laya扩展函数
 ***********************************************************************/
laya = laya || {};
//----------------------------------------------------------------------
// 延迟调用,duration:延迟时间(秒数)
laya.callAfter = function(duration, callCF, target) {
	callCF = 'function' == typeof(callCF) ? callCF : function(){};
	if (isNaN(duration) || duration <= 0) {
		Laya.timer.callLater(target, callCF, Array.prototype.slice.call(arguments, 3));
		return;
	} 
	Laya.timer.once(duration*1000, target, callCF, Array.prototype.slice.call(arguments, 3));
};
//----------------------------------------------------------------------
// 改变节点父节点
laya.changeParent = function(sprite, parent, zOrder) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	if (!parent || parent.destroyed) {
		throw new Error("parent is null");
	}
	sprite.removeSelf();
	sprite.zOrder = 'number' == typeof(zOrder) ? zOrder : sprite.zOrder;
	parent.addChild(sprite);
};
//----------------------------------------------------------------------
// 获取世界坐标
laya.getWorldPosition = function(sprite) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	sprite.anchorX = isNaN(sprite.anchorX) ? 0 : sprite.anchorX;
	sprite.anchorY = isNaN(sprite.anchorY) ? 0 : sprite.anchorY;
	var pos = {x:sprite.anchorX*sprite.width, y:sprite.anchorY*sprite.height};
	return sprite.localToGlobal(pos, false);
};
//----------------------------------------------------------------------
// 获取本地坐标
laya.getLocalPosition = function(sprite, worldPos) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	return sprite.globalToLocal(worldPos, false);
};
//----------------------------------------------------------------------
// 设置坐标偏移
laya.setPositionOffset = function(sprite, offsetPos) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	sprite.pos(sprite.x + offsetPos.x, sprite.y + offsetPos.y);
};
//----------------------------------------------------------------------
// 创建骨骼动画,例.fullTextureName:"res/Effect/test.png",fullDataName:"res/Effect/test.sk",isSupportDressup:是否支持换装
laya.createArmature = function(fullTextureName, fullDataName, isSupportDressup, playCF, pauseCF, stopCF, target) {
	// 获取资源
	var texture = laya.net.Loader.getRes(fullTextureName);
	var data = laya.net.Loader.getRes(fullDataName);
	// 解析骨骼
	var factory = new laya.ani.bone.Templet();
	var armature = null;
	factory.on(laya.events.Event.COMPLETE, this, function() {
		// 创建骨骼动画
		armature = factory.buildArmature(isSupportDressup ? 1 : 0);
		armature.on(laya.events.Event.PLAYED, this, function() {
			if ('function' == typeof(playCF)) {
				armature.timer.callLater(target, playCF, Array.prototype.slice.call(arguments, 7));
			}
		});
		armature.on(laya.events.Event.PAUSED, this, function() {
			if ('function' == typeof(pauseCF)) {
				armature.timer.callLater(target, pauseCF, Array.prototype.slice.call(arguments, 7));
			}
		});
		armature.on(laya.events.Event.STOPPED, this, function() {
			if ('function' == typeof(stopCF)) {
				armature.timer.callLater(target, stopCF, Array.prototype.slice.call(arguments, 7));
			}
		});
	});
	factory.parseData(texture, data, 60);
	return armature;
};
//----------------------------------------------------------------------
// 创建粒子节点,例.path:"res/Effect/",fileName:"test.part",autoRemove:粒子播放完自动删除
laya.createParticle = function(path, fileName, autoRemove) {
	if ('/' != path[path.length - 1] && '\\' != path[path.length - 1]) {
		path += '/';
	}
	var oldBasePath = Laya.URL.basePath;
	Laya.URL.basePath += path;
	if (-1 == fileName.lastIndexOf('.part')) {
		fileName += '.part';
	}
	var particle = new Laya.Particle2D();
	Laya.loader.load(fileName, Handler.create(this, function(setting) {
        particle.setParticleSetting(setting);
		Laya.URL.basePath = oldBasePath;
		if (autoRemove) {
			particle.timerOnce(setting.duration*1000, this, function() {
				particle.stop();
				particle.removeSelf();
				particle.destroy();
				particle = undefined;
			})
		}
    }), null, Loader.JSON);
	return particle;
};
//----------------------------------------------------------------------
// 创建进度条,bgImage:进度条背景资源路径,barImage:进度条资源路径(大小需要同背景一样),barMaskImage:遮罩资源路径(大小需要同进度条一样),duration:缓动时间(秒数)
laya.createProgress = function(bgImage, barImage, barMaskImage, duration) {
	duration = (isNaN(duration) || duration <= 0) ? 1 : duration;
	// 进度条背景
	var progressBg = new laya.display.Sprite();
	progressBg.loadImage(bgImage);
	progressBg.cacheAs = "bitmap";
	// 进度条
	var progressBar = new laya.display.Sprite();
	progressBar.loadImage(barImage);
	progressBar.pos((progressBg.width - progressBar.width)/2, (progressBar.height - progressBg.height)/2);
	progressBg.addChild(progressBar);
	// 进度条遮罩
	var progressBarMask = new laya.display.Sprite();
	progressBarMask.loadImage(barMaskImage);
	progressBarMask.scaleX = 1;
	progressBar.mask = progressBarMask;
	// 外部接口定义
	var progressValue = progressBarMask.scaleX;
	var delta = 1/(duration*60);
	progressBarMask.frameLoop(1, this, function() {
		if (progressBarMask.scaleX < progressValue) {
			progressBarMask.scaleX += delta;
			progressBarMask.scaleX = progressBarMask.scaleX > progressValue ? progressValue : progressBarMask.scaleX;
		} else if (progressBarMask.scaleX > progressValue) {
			progressBarMask.scaleX -= delta;
			progressBarMask.scaleX = progressBarMask.scaleX < progressValue ? progressValue : progressBarMask.scaleX;
		} else {
			return;
		}
		progressBar.repaint();
	});
	progressBg.getValue = function() {		// 获取进度(0-1)
		return progressValue;
	};
	progressBg.setValue = function(value, tweenFlag) {	// 设置进度,value:进度值(0-1),tweenFlag:是否缓动
		value = (isNaN(value) || value < 0) ? 0 : (value > 1 ? 1 : value);
		progressValue = value;
		if (!tweenFlag) {	// 立即执行
			progressBarMask.scaleX = progressValue;
			progressBar.repaint();
		}
	};
	progressBg.setValue(0);
	return progressBg;
};
//----------------------------------------------------------------------
// 创建图片标签,例如:str="+0.5",prefix="res/Picture/num_y_",charGap=0
laya.createImageLabel = function(str, prefix, charGap) {
	// 特殊字符映射表
	var specialCharMap = {
		'*':'za', '?':'zq', '"':'zd', '<':'zl', '>':'zr',
		'|':'zv', '\\':'zs', '/':'zb', ':':'zc'
	};
	// 内部创建
	function createImpl(str) {
		str += '';
		if (str.length > 0) {
			var child = new laya.display.Sprite();
			var childWidth = 0;
			var childHeight = 0;
			for (var i = 0, len = str.length; i < len; ++i) {
				if (str.charCodeAt(i) < 33 || str.charCodeAt(i) > 126) {
					throw new Error("str contains error character at [" + i + "]");
				}
				var ch = str[i];
				var name = specialCharMap[ch] ? specialCharMap[ch] : ch;
				var sprite = new laya.display.Sprite();
				sprite.loadImage(('string' == typeof(prefix) ? prefix : "") + name + ".png");
				if (childWidth > 0) {
					childWidth = childWidth + (isNaN(charGap) ? 0 : charGap);
				}
				sprite.pos(childWidth, 0);
				child.addChild(sprite);
				childWidth = childWidth + sprite.width;
				if (sprite.height > childHeight) {
					childHeight = sprite.height;
				}
			}
			child.width = childWidth;
			child.height = childHeight;
			return child;
		}
	}
	var node = new laya.ui.Image();
	node.anchorX = 0.5;
	node.anchorY = 0.5;
	// 设置字符串
	node.setString = function(str) {
		if (this.child && !this.child.destroyed) {
			this.child.removeSelf();
			this.child.destroy();
			delete this.child;
			this.width = 0;
			this.height = 0;
		}
		this.child = createImpl(str);
		if (this.child && !this.child.destroyed) {
			this.addChild(this.child);
			this.width = this.child.width;
			this.height = this.child.height;
		}
	};
	node.setString(str);
	return node;
};
//----------------------------------------------------------------------
// 拼接精灵
laya.jointSprite = function(spriteList, gap) {
	var node = new laya.ui.Image();
	node.anchorX = 0.5;
	node.anchorY = 0.5;
	var nodeWidth = 0;
	var nodeHeight = 0;
	for (var i = 0, len = spriteList.length; i < len; ++i) {
		var sprite = spriteList[i];
		if (sprite && !sprite.destroyed) {
			if (nodeWidth > 0) {
				nodeWidth = nodeWidth + (isNaN(gap) ? 0 : gap);
			}
			var x = nodeWidth + (isNaN(sprite.anchorX) ? 0 : sprite.anchorX) * sprite.width;
			var y = (isNaN(sprite.anchorY) ? 0 : sprite.anchorY) * sprite.height;
			sprite.pos(x, y);
			node.addChild(sprite);
			nodeWidth = nodeWidth + sprite.width;
			if (sprite.height > nodeHeight) {
				nodeHeight = sprite.height;
			}
		}
	}
	node.width = nodeWidth;
	node.height = nodeHeight;
	return node;
};
//----------------------------------------------------------------------
// 延迟动作,duration:延迟时间(秒数)
laya.delayWith = function(sprite, duration, callCF, target) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	callCF = 'function' == typeof(callCF) ? callCF : function(){};
	if (duration <= 0) {
		callCF.apply(target, Array.prototype.slice.call(arguments, 4));
		return;
	}
	sprite.timerOnce(duration*1000, target, callCF, Array.prototype.slice.call(arguments, 4));
};
//----------------------------------------------------------------------
// 执行动作,actions:动作列表,每个动作为{props:{},duration:1,ease:null},props为属性(当为空对象时表示暂停),duration为动作时间(秒数),ease为缓动类型(参考laya.utils.Ease)
laya.runAction = function(sprite, actions, callCF, target) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	callCF = 'function' == typeof(callCF) ? callCF : function(){};
	var args = Array.prototype.slice.call(arguments, 4);
	function innerImpl() {
		if (0 == actions.length) {
			callCF.apply(target, args);
			return;
		}
		var action = actions[0];
		if (sprite && !sprite.destroyed) {
			if (!action.props || (action.props instanceof Array) || 'object' != typeof(action.props)) {
				action.props = {};
			}
			laya.utils.Tween.to(sprite, action.props, action.duration*1000, action.ease, laya.utils.Handler.create(this, function() {
				actions.splice(0, 1);
				innerImpl();
			}, null, false));
		} else {
			callCF.apply(target, args);
		}
	}
	innerImpl();
};
//----------------------------------------------------------------------
// 移动动作,pos:目标坐标,duration:移动时间(秒数),ease:缓动类型(参考laya.utils.Ease)
laya.moveTo = function(sprite, pos, duration, ease, callCF, target) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	callCF = 'function' == typeof(callCF) ? callCF : function(){};
	laya.utils.Tween.to(sprite, {x:pos.x, y:pos.y}, duration*1000, ease, laya.utils.Handler.create(this, function() {
		if (sprite && !sprite.destroyed) {
			sprite.pos(pos.x, pos.y);
		}
		callCF.apply(target, Array.prototype.slice.call(arguments, 5));
	}, null, false));
}
//----------------------------------------------------------------------
// 移动运动(跟随轨迹),posArray:轨迹数组,duration:移动时间(秒数)
laya.moveToWithPath = function(sprite, posArray, duration, callCF, target) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	callCF = 'function' == typeof(callCF) ? callCF : function(){};
	if (0 == posArray.length) {
		callCF.apply(target, Array.prototype.slice.call(arguments, 5));
		return;
	}
	var timeLine = new Laya.TimeLine();
	for (var i = 0, len = posArray.length; i < len; ++i) {
		timeLine.to(sprite, {x:posArray[i].x, y:posArray[i].y}, duration*1000);
	}
	timeLine.on(laya.events.Event.COMPLETE, this, function() {
		var endPos = posArray[posArray.length - 1];
		if (sprite && !sprite.destroyed) {
			sprite.pos(endPos.x, endPos.y);
		}
		callCF.apply(target, Array.prototype.slice.call(arguments, 5));
	});
	timeLine.play(0, false);
};
//----------------------------------------------------------------------
// 位移运动,pos:坐标偏差,duration:移动时间(秒数),ease:缓动类型(参考laya.utils.Ease)
laya.moveBy = function(sprite, pos, duration, ease, callCF, target) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	callCF = 'function' == typeof(callCF) ? callCF : function(){};
	var oldPos = {x:sprite.x, y:sprite.y};
	laya.utils.Tween.to(sprite, {x:oldPos.x + pos.x, y:oldPos.y + pos.y}, duration*1000, ease, laya.utils.Handler.create(this, function() {
		if (sprite && !sprite.destroyed) {
			sprite.pos(oldPos.x + pos.x, oldPos.y + pos.y);
		}
		callCF.apply(target, Array.prototype.slice.call(arguments, 5));
	}, null, false));
}
//----------------------------------------------------------------------
// 淡入动作,duration:淡入时间(秒数)
laya.fadeIn = function(sprite, duration, callCF, target) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	callCF = 'function' == typeof(callCF) ? callCF : function(){};
	sprite.alpha = 0;
	laya.utils.Tween.to(sprite, {alpha:1}, duration*1000, null, laya.utils.Handler.create(this, function() {
		if (sprite && !sprite.destroyed) {
			sprite.alpha = 1;
		}
		callCF.apply(target, Array.prototype.slice.call(arguments, 5));
	}, null, false));
};
//----------------------------------------------------------------------
// 淡出动作,duration:淡出时间(秒数)
laya.fadeOut = function(sprite, duration, callCF, target) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	callCF = 'function' == typeof(callCF) ? callCF : function(){};
	sprite.alpha = 1;
	laya.utils.Tween.to(sprite, {alpha:0}, duration*1000, null, laya.utils.Handler.create(this, function() {
		if (sprite && !sprite.destroyed) {
			sprite.alpha = 0;
		}
		callCF.apply(target, Array.prototype.slice.call(arguments, 5));
	}, null, false));
};
//----------------------------------------------------------------------
// 缩放动作,scaleType:缩放类型(0.xy缩放,1.x缩放,2.y缩放),fromScale:起始缩放系数,toScale:目标缩放系数,duration:缩放时间(秒数)
laya.scaleFromTo = function(sprite, scaleType, fromScale, toScale, duration, callCF, target) {
	if (!sprite || sprite.destroyed) {
		throw new Error("sprite is null");
	}
	callCF = 'function' == typeof(callCF) ? callCF : function(){};
	scaleType = 1 == scaleType ? 1 : (2 == scaleType ? 2 : 0);
	if (0 == scaleType || 1 == scaleType) {
		sprite.scaleX = fromScale;
	}
	if (0 == scaleType || 2 == scaleType) {
		sprite.scaleY = fromScale;
	}
	var props = {
		scaleX: (2 == scaleType ? sprite.scaleX : toScale),
		scaleY: (1 == scaleType ? sprite.scaleY : toScale)
	};
	laya.utils.Tween.to(sprite, props, duration*1000, null, laya.utils.Handler.create(this, function() {
		if (sprite && !sprite.destroyed) {
			if (0 == scaleType || 1 == scaleType) {
				sprite.scaleX = toScale;
			}
			if (0 == scaleType || 2 == scaleType) {
				sprite.scaleY = toScale;
			}
		}
		callCF.apply(target, Array.prototype.slice.call(arguments, 6));
	}, null, false));
};
//----------------------------------------------------------------------