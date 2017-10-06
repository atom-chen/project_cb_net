/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-11
 ** Brief:	ui manager
 ***********************************************************************/
function UIManager() {
	var mUITable = {};
	var manager = {};
	manager.createUI = function(name, node, onEventCF, target, modal) {
		if (mUITable[name]) {
			throw new Error("exist ui [" + name + "] aleady");
		}
		node = node || new laya.ui.View();
		node.size(node.width || Laya.stage.width, node.height || Laya.stage.height);
		node.anchorX = 0.5;
		node.anchorY = 0.5;
		node.pos(Laya.stage.width / 2, Laya.stage.height / 2);
		node.mouseEnabled = true;
		node.mouseThrough = true;
		node.zOrder = 2;	// add to zOrder 2
		var root = new laya.ui.View();
		root.size(Laya.stage.width, Laya.stage.height);
		root.anchorX = 0.5;
		root.anchorY = 0.5;
		root.pos(Laya.stage.width / 2, Laya.stage.height / 2);
		root.mouseEnabled = true;
		root.mouseThrough = 'boolean' == typeof(modal) ? (modal ? false : true) : true;
		function onEvent(event) {
			if ('function' == typeof(onEventCF) && event) {
				onEventCF.apply(target, [event]);
			}
		}
		root.on(laya.events.Event.ADDED, this, onEvent);
		root.on(laya.events.Event.CLICK, this, onEvent);
		root.on(laya.events.Event.DISPLAY, this, onEvent);
		root.on(laya.events.Event.DRAG_END, this, onEvent);
		root.on(laya.events.Event.DRAG_MOVE, this, onEvent);
		root.on(laya.events.Event.DRAG_START, this, onEvent);
		root.on(laya.events.Event.MOUSE_DOWN, this, onEvent);
		root.on(laya.events.Event.MOUSE_MOVE, this, onEvent);
		root.on(laya.events.Event.MOUSE_OUT, this, onEvent);
		root.on(laya.events.Event.MOUSE_OVER, this, onEvent);
		root.on(laya.events.Event.MOUSE_UP, this, onEvent);
		root.on(laya.events.Event.REMOVED, this, onEvent);
		root.on(laya.events.Event.UNDISPLAY, this, onEvent);
		root.addChild(node);
		var ui = {name: name, root: root, node: node};
		mUITable[name] = ui;
		return ui;
	};
	manager.destroyUI = function(name) {
		var ui = mUITable[name];
		if (!ui) {
			return;
		}
		ui.root.removeSelf();
		ui.root.destroy();
		delete mUITable[name];
	};
	manager.destroyAllUI = function() {
		for (var name in mUITable) {
			if (mUITable.hasOwnProperty(name)) {
				mUITable[name].root.removeSelf();
				mUITable[name].root.destroy();
			}
		}
		mUITable = {};
	};
	manager.getUI = function(name) {
		return mUITable[name];
	};
	return manager;
}
//----------------------------------------------------------------------
UI = 'undefined' == typeof(UI) ? UIManager() : UI;
UI.mLayerTable = 'undefined' == typeof(UI.mLayerTable) ? [] : UI.mLayerTable;
// open ui
UI.open = function(layer, name, node, modal, onEventCF, parent) {
	var ui = this.getUI(name);
	if (ui) {
		return ui;
	}
	ui = this.createUI(name, node, function ( event) {
		if ('function' == typeof(onEventCF)) {
			onEventCF(event);
		}
		if ('function' == typeof(layer.onTouch)) {
			layer.onTouch(event);
		}
	}, this, modal);
	if (parent) {
		parent.addChild(ui.root);
	}
	EventDispatcherHang(layer);
	layer.root = ui.root;
	layer.node = ui.node;
	if ('function' == typeof(layer.onStart)) {
        layer.onStart.apply(layer, Array.prototype.slice.call(arguments, 6));
	}
	this.mLayerTable.push(layer);
	return ui;
};
//----------------------------------------------------------------------
// close single ui
UI.close = function(layer, name) {
	var ui = this.getUI(name);
	if (!ui) {
		return false;
	}
	for (var i = 0, len = this.mLayerTable.length; i < len; ++i) {
		if (layer == this.mLayerTable[i]) {
			this.mLayerTable.splice(i, 1);
			break;
		}
	}
	if ('function' == typeof(layer.unbind)) {
		layer.unbind();
	}
	if ('function' == typeof(layer.onDestroy)) {
		layer.onDestroy();
	}
	delete layer.root;
	delete layer.node;
	this.destroyUI(name);
	return true;
};
//----------------------------------------------------------------------
// close all ui
UI.closeAll = function() {
	for (var i = 0, len = this.mLayerTable.length; i < len; ++i) {
		if ('function' == typeof(this.mLayerTable[i].unbind)) {
			this.mLayerTable[i].unbind();
		}
		if ('function' == typeof(this.mLayerTable[i].onDestroy)) {
			this.mLayerTable[i].onDestroy();
		}
		delete this.mLayerTable[i].root;
		delete this.mLayerTable[i].node;
	}
	this.destroyAllUI();
	this.mLayerTable = [];
};
//----------------------------------------------------------------------
// update ui per frames
UI.update = function(dt) {
	for (var i = 0, len = this.mLayerTable.length; i < len; ++i) {
		if ('function' == typeof(this.mLayerTable[i].onUpdate)) {
			this.mLayerTable[i].onUpdate(dt);
		}
	}
};
//----------------------------------------------------------------------
// get latest ui
UI.getLatest = function() {
	if (0 == this.mLayerTable.length) {
		return;
	}
	return this.mLayerTable.indexOf(this.mLayerTable.length - 1);
};
//----------------------------------------------------------------------
// check is ui open
UI.isOpened = function(layer) {
	if (!layer) {
		return false;
	}
	for (var i = 0, len = this.mLayerTable.length; i < len; ++i) {
		if (layer == this.mLayerTable[i]) {
			return true;
		}
	}
	return false;
};
//----------------------------------------------------------------------
// get child node
UI.getChild = function(root, children, childName) {
	if (undefined == root || null == root) {
		throw new Error("not support root for null");
	}
	if (!(children && !(children instanceof Array) && 'object' == typeof(children))) {
		throw new Error("not support children for " + typeof(children));
	}
	if (undefined != children[childName] && null != children[childName]) {
		return children[childName];
	}
	function getChildImpl(node) {
		if (!node) {
			return null;
		}
		for (var i = 0; i < node.numChildren; ++i) {
			var child = node.getChildAt(i);
            children[child.name] = child;
			if (childName == child.name) {
				return child;
			}
			child = getChildImpl(child);
			if (child) {
				return child;
			}
		}
	}
	return getChildImpl(root);
};
//----------------------------------------------------------------------