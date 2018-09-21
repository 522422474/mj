var roomHandler = require('roomHandler');
var errorCode = require('errorCode');

var competitionHandler = {
    gameListData:{},
};

module.exports = competitionHandler;

competitionHandler.setGameListData = function (data) {
    this.gameListData = data;
};
competitionHandler.setGameListData = function () {
    return this.gameListData;
};
competitionHandler.getPeopleNum = function (templateId) {
    for (var key in this.gameListData) {
        if (this.gameListData[key].templateId === templateId) {
            return this.gameListData[key].players.length;
        }
    }
};

competitionHandler.isApply = function (templateId,uid) {
    for (var key in this.gameListData) {
        if (this.gameListData[key].templateId === templateId) {
            return this.gameListData[key].players.indexOf(uid) != -1;
        }
    }
};

//用户请求协议
competitionHandler.getActivityList = function() {
    GameNet.getInstance().request("game.activityHandler.getActivityList", {}, function (rtn) {
        if (rtn.code == errorCode.Success) {
            competitionHandler.gameListData = rtn.result;
            // competitionHandler.setGameListData(rtn.result);
            sendEvent('onActivityList');
        }
    });
};
competitionHandler.apply = function(templateId) {
    GameNet.getInstance().request("game.activityHandler.apply", {templateId:templateId}, function (rtn) {
    });
};
competitionHandler.cancel = function(templateId) {
    GameNet.getInstance().request("game.activityHandler.cancel", {templateId:templateId}, function (rtn) {
    });
};
competitionHandler.giveUp = function() {
    GameNet.getInstance().request("game.activityHandler.giveUp", {}, function (rtn) {
    });
};

//注册交互消息
competitionHandler.registMessage = function() {
    WriteLog("registMessage 比赛交互消息");
    GameNet.getInstance().setCallBack('onActivityList', function (data) {
        WriteLog("do event onActivityList  " + JSON.stringify(data.result));
        competitionHandler.gameListData = data.result;
        //competitionHandler.setGameListData(data.result);
        sendEvent('onActivityList');
    });
};
