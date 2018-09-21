var roomHandler = require('roomHandler');
var errorCode = require('errorCode');

var matchHandler = {
	matchTime: 0,
	onMatch: false,

	selectGameType: undefined,	//当前选择的游戏类型
    selectGameLv: undefined		//当前选择的游戏等级
};

module.exports = matchHandler;

matchHandler.signup = function() {
	cc.log('..match game type:'+this.selectGameType+'..lv:'+this.selectGameLv);
	var self = this;
	GameNet.getInstance().request("game.matchHandler.signup", {gameType: this.selectGameType, level: this.selectGameLv}, function (rtn) {
		if (rtn.ret == errorCode.Success) {
			self.matchTime = 0;
			//设置界面的优先级
            var fun = function(panel){
                var SelectGameLvPanel = cc.director.getScene().getChildByName('Canvas').getChildByName("SelectGameLvPanel");
                if(SelectGameLvPanel){
                    panel.setLocalZOrder(SelectGameLvPanel.getLocalZOrder()+2);
                }
			};
			openView('UIMatch', undefined, fun);
		} else {
			var errorChar = '';
			console.log('match ret:'+rtn.ret);
			switch(rtn.ret) {
				case errorCode.lessCoin: {
                    createMoveMessage('', errorCode.LessCoin);
                } break;
				default: {
					errorChar = '匹配失败';
                    messageBoxWithoutCB(errorChar);
                } break;
			}

		}
        closeView('Loading');
	});
};

matchHandler.cancel = function(cb) {
	var self = this;
	GameNet.getInstance().request("game.matchHandler.cancel", {}, function (rtn) {
		if (rtn.ret == errorCode.Success) {
			self.matchTime = 0;
			self.onMatch = false;
			cb();
		}
	});
};

matchHandler.registMessage = function() {

	var self = this;
	GameNet.getInstance().setCallBack('createMatchRoom', function (ret) {
        self.onMatch = false;
        self.matchTime = 0;
		roomHandler.enterRoom(ret.roomid);
	});
    GameNet.getInstance().setCallBack('onMatchData', function (ret) {
        self.onMatch = true;
        self.matchTime = Math.abs(parseInt((new Date().getTime() - ret.time)/1000));

        sendEvent('onMatchData');
    });
};
