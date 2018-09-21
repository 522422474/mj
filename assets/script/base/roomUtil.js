var exp = module.exports;

exp.getRoomString = function(roomId) {
	if (GameData.room.id >= 100000) {
		return roomId.toString();
	} else if (GameData.room.id >= 10000) {
		return '0' + GameData.room.id;
	} else if (GameData.room.id >= 1000) {
		return '00' + GameData.room.id;
	} else if (GameData.room.id >= 100) {
		return '000' + GameData.room.id;
	} else if (GameData.room.id >= 10) {
		return '0000' + GameData.room.id;
	} else if (GameData.room.id >= 1) {
		return '00000' + GameData.room.id;
	} else {
		return '000000';
	}
};

exp.getTimeString = function() {
	var t = new Date();
	var h = t.getHours();
	var m = t.getMinutes();
	h = h < 10 ? '0'+h : h;
	m = m < 10 ? '0'+m : m;
	var str = (h + ':' + m);
	return str;
};

exp.getPower = function() {
	try {
		if (cc.sys.OS_ANDROID == cc.sys.os) {
			jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "electricQuantity", "()V");
		} else if (cc.sys.OS_IOS == cc.sys.os) {
			jsb.reflection.callStaticMethod("AppController", "electricQuantity");
		}
	} catch (e) {
		WriteLog('Get energy error:'+JSON.stringify(e));
	}
};
