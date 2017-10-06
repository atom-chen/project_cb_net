/***********************************************************************
 ** Author:	jaron.ho
 ** Date:	2015-08-13
 ** Brief:	数据表
 ***********************************************************************/
DataTB = {mTpltList:{}};
//----------------------------------------------------------------------
// 拷贝数据
DataTB.copydata = function(data) {
	function innerFunc(data) {
        if (undefined == data || null == data || 'object' != typeof(data) || data instanceof HTMLElement) {
            return data;
        }
        var newObj = data.constructor ? new data.constructor : {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                newObj[key] = innerFunc(data[key]);
            } else {
                newObj[key] = innerFunc(data[key]);
            }
        }
        return newObj;
	}
	return innerFunc(data);
};
//----------------------------------------------------------------------
// 初始化
DataTB.init = function(tpltList) {
	if (!(tpltList && !(tpltList instanceof Array) && 'object' == typeof(tpltList))) {
		throw new Error("can't support tpltList type " + typeof(tpltList));
	}
	this.mTpltList = {};
	for (var key in tpltList) {
		if (tpltList.hasOwnProperty(key)) {
			this.mTpltList[key] = this.copydata(tpltList[key]);
		}
	}
};
//----------------------------------------------------------------------
// 重载数据文件
DataTB.reload = function(fileName, tplt) {
	if ('string' != typeof(fileName)) {
		throw new Error("can't support for fileName type " + typeof(fileName));
	}
	if ("_tplt" != fileName.substring(fileName.length - 5)) {
		throw new Error("data table '" + fileName + "' name format is error");
	}
	this.mTpltList[fileName] = this.copydata(tplt);
};
//----------------------------------------------------------------------
// 获取单条数据
DataTB.get = function(fileName, key, mustExist, isRef) {
	if ('string' != typeof(fileName)) {
		throw new Error("can't support for fileName type " + typeof(fileName));
	}
	if ("_tplt" != fileName.substring(fileName.length - 5)) {
		throw new Error("data table '" + fileName + "' name format is error");
	}
	var dataMap = this.mTpltList[fileName];
    if (undefined == dataMap || null == dataMap) {
        throw new Error("dosen't exist data table '" + fileName + "'");
    }
	if ('string' != typeof(key) && 'number' != typeof(key)) {
		throw new Error("can't not support for key type " + typeof(key));
	}
    var row = dataMap[key];
    if (undefined == row || null == row) {
        if (mustExist) {
            throw new Error("can't find key '" + key + "' in data table '" + fileName + "'");
        }
        return;
    }
    return isRef ? row : this.copydata(row);
};
//----------------------------------------------------------------------
// 按条件获取数据
DataTB.filter = function(fileName, filterFunc, isList, isRef) {
	if ('string' != typeof(fileName)) {
		throw new Error("can't support for fileName type " + typeof(fileName));
	}
	if ("_tplt" != fileName.substring(fileName.length - 5)) {
		throw new Error("data table '" + fileName + "' name format is error");
	}
	var dataMap = this.mTpltList[fileName];
    if (undefined == dataMap || null == dataMap) {
		throw new Error("dosen't exist data table '" + fileName + "'");
    }
    var dataList = [];
    if ('function' == typeof(filterFunc)) {
        for (var key in dataMap) {
            if (dataMap.hasOwnProperty(key) && filterFunc(dataMap[key])) {
				if (isList) {
					dataList.push(dataMap[key]);
				} else {
					return isRef ? dataMap[key] : this.copydata(dataMap[key]);
				}
            }
        }
    }
	if (isList) {
		return isRef ? dataList : this.copydata(dataList);
	}
    return null;
};
//----------------------------------------------------------------------
// 获取所有数据
DataTB.getAll = function(fileName, isRef) {
	if ('string' != typeof(fileName)) {
		throw new Error("can't support for fileName type " + typeof(fileName));
	}
	if ("_tplt" != fileName.substring(fileName.length - 5)) {
		throw new Error("data table '" + fileName + "' name format is error");
	}
	var dataMap = this.mTpltList[fileName];
    if (undefined == dataMap || null == dataMap) {
		throw new Error("dosen't exist data table '" + fileName + "'");
    }
	var dataList = [];
	for (var key in dataMap) {
		if (dataMap.hasOwnProperty(key)) {
			dataList.push(dataMap[key]);
		}
	}
    return isRef ? dataList : this.copydata(dataList);
};
//----------------------------------------------------------------------