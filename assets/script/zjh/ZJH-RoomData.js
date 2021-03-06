var room_ZJH = {
    //创建房间数据
    createRoomOpts: {},
    //游戏内玩家状态的数组
    playersArr:     [],
    obPlayersArr:   [],
    losersArr:      [],
    GiveUpArr:      [],
    //开局信息
    isCompare: false,
    startAnimFinish: true, // 开局动画状态
    isRunAnimation: false,

    //游戏信息
    pokers: {},
    playerPokerType: {},
    gameInfo: {},
    gameResultData: {},

    //游戏状态
    gameState:{
        Zhuang: 1,	//抢庄阶段
        BaseScore: 2, // 下底分阶段
        Chips: 3,	//下注阶段
        Compare: 4,	//比牌阶段
        Settle: 5,	//结算阶段
        End: 6//也是结算
    },

    //配置数据
    CoinChipConfig:{
        '0':[50,100,250,500,1000],
        '1':[300,600,1500,3000,6000],
        '2':[1000,2000,5000,10000,20000]
    },
    PokerCardType :{
        '0': 'sanpai',  // 单牌
        '1': 'duizi',  // 对子
        '2': 'shunzi',  // 顺子
        '3': 'jinhua',  // 三张花色相同的牌
        '4': 'shunjin', // 花色相同的三张连牌
        '5': 'baozi',  // 豹子
        '6': '235', // 2,3,5
    }
};
room_ZJH.initData = function() {
    this.playersArr =   [];
    this.obPlayersArr = [];
    this.GiveUpArr =    [];
    this.losersArr =    [];
    this.pokers =       {};
    this.gameInfo =     {};
    //this.gameResultData = {};
},

module.exports = room_ZJH;

room_ZJH.initCreateRoomOpts = function () {
  var data = cc.sys.localStorage.getItem('createRoomOpts_ZJH');
  if (data != null) {
    room_ZJH.createRoomOpts = JSON.parse(data);
    return;
  }
  room_ZJH.createRoomOpts = {};
  room_ZJH.createRoomOpts.twoThreeFiveBiger = 1; //235吃豹子(默认带)
  room_ZJH.createRoomOpts.compareSuit = 0; //比花色 (默认带)
  room_ZJH.createRoomOpts.chipsType = 0; //筹码 (默认1/2/5/10)
  room_ZJH.createRoomOpts.roundMax = 10; //最大局数 10/20/30 (默认10)
  room_ZJH.createRoomOpts.roundRule = 10; // 与局数对应 10 20 30
  room_ZJH.createRoomOpts.a23Type = 0; //
  room_ZJH.createRoomOpts.canNotLookTurnNum = 3; //闷 0:无比闷 1: 闷一轮 2: 闷两轮 3:闷3轮(默认)
  room_ZJH.createRoomOpts.maxTunNum = 5; // 封顶轮数 5,10,15,20
  room_ZJH.createRoomOpts.costType = 1; //付費類型               默认房主付费
  room_ZJH.createRoomOpts.playerMax = 6; //最大人数
  room_ZJH.createRoomOpts.playerMin = 2; //最小人数
},

room_ZJH.saveCreateRoomOpts = function () {
  if (room_ZJH.createRoomOpts == null || room_ZJH.createRoomOpts == undefined) return;
  cc.sys.localStorage.setItem('createRoomOpts_ZJH', JSON.stringify(room_ZJH.createRoomOpts));
},

room_ZJH.setPlayerArr = function (data) {
    room_ZJH.playersArr = [];
    for (var key in data) {
        if (data[key].length>0) {
            room_ZJH.playersArr.push(parseInt(key));
        }
    }
},
room_ZJH.setLosersArr = function (data) {
    room_ZJH.losersArr = [];
    for (var key in data) {
        if (data[key]) {
            room_ZJH.losersArr.push(parseInt(key));
        }
    }
},

room_ZJH.setGiveUpArr = function (data) {
    room_ZJH.GiveUpArr = [];
    for (var key in data) {
        if (data[key]) {
            room_ZJH.GiveUpArr.push(parseInt(key));
        }
    }
},


room_ZJH.setPosition = function () {
    GameData.tablePos = {};
    var order;
    var index = GameData.getPlayerIndex(GameData.player.uid);
    if (GameData.room.opts == undefined)
    {
        return;
    }
    if (index == 0) order = [0,1,2,3,4,5];
    else if (index == 1) order = [5,0,1,2,3,4];
    else if (index == 2) order = [4,5,0,1,2,3];
    else if (index == 3) order = [3,4,5,0,1,2];
    else if (index == 4) order = [2,3,4,5,0,1];
    else if (index == 5) order = [1,2,3,4,5,0];
    for (var i = 0; i < GameData.joiners.length; i++) {
        if (GameData.joiners[i]) {
            GameData.tablePos[GameData.joiners[i].uid] = order[i];
        }else if (GameData.joiners[i] == null){
            GameData.tablePos['null'] = order[i];
        }
    }
    cc.log('table pos:' + JSON.stringify(GameData.tablePos));
},

room_ZJH.getHandPokerByUid = function (uid) {
    for (var key in room_ZJH.pokers) {
        if (key == uid) {
            return room_ZJH.pokers[key];
        }
    }
    return null;
},

room_ZJH.getPlayerPokerByUid = function (uid) {
    for (var key in room_ZJH.pokers) {
        if (key == uid) {
            return room_ZJH.pokers[key];
        }
    }
    return null;
},

room_ZJH.getPlayerPokerTypeByUid = function (uid) {
    if (Object.keys(room_ZJH.gameInfo).length == 0) {
        return
    }
    for (var key in room_ZJH.playerPokerType) {
        if (key == uid) {
            var pokerType = room_ZJH.playerPokerType[key];
            return room_ZJH.PokerCardType[pokerType];
        }
    }
    return null;
},


room_ZJH.getLivePlayers = function () {
   var livePlayer = [];
    for (var i = 0; i< room_ZJH.playersArr.length; i++) {
        var uid = room_ZJH.playersArr[i];
        if (room_ZJH.losersArr.indexOf(uid) == -1) {
            livePlayer.push(uid);
        }
    }
    return livePlayer;
},

room_ZJH.getWinPlayer = function (uid) {
   var isPlayer = room_ZJH.playersArr.indexOf(uid) != -1;
   var isWin = room_ZJH.losersArr.indexOf(uid) == -1;
    var isLastCmp = room_ZJH.playersArr.length - room_ZJH.losersArr.length == 1;
    if (isPlayer && isWin && isLastCmp) {
        return true;
    }else{
        return false;
    }
},

room_ZJH.getPlayerIsSeePokerByUid = function (uid) {
    if (!room_ZJH.gameInfo.show) {
        return
    }
    for(var key in room_ZJH.gameInfo.show) {
        if (key == uid){
            return room_ZJH.gameInfo.show[key];
        }
    }
},

room_ZJH.getGameAllChips = function () {
    if (Object.keys(room_ZJH.gameInfo).length == 0) {
        return
    }
    var allChipsArr = [];
    for(var key in room_ZJH.gameInfo.chips) {
        for (var j = 0; j<room_ZJH.gameInfo.chips[key].length; j++) {
            allChipsArr.push(room_ZJH.gameInfo.chips[key][j]);
        }
    }
    return allChipsArr;
},

room_ZJH.getPlayerChipsByUid = function (uid) {
    if (Object.keys(room_ZJH.gameInfo).length == 0) {
        return
    }
    var chipNum = 0;
    for (var key in room_ZJH.gameInfo.chips) {
        if (key == uid) {
            for (var j = 0; j<room_ZJH.gameInfo.chips[key].length; j++) {
                chipNum += room_ZJH.gameInfo.chips[key][j];
            }
        }
    }
    return chipNum;
},

room_ZJH.getRoomCoinChipConfig = function (level) {

    return room_ZJH.CoinChipConfig[level];
},

room_ZJH.isGameStart = function () {
    if (Object.keys(room_ZJH.gameInfo).length == 0) {
        return
    }
    if (room_ZJH.gameInfo.currentPlayer == room_ZJH.gameInfo.firstOperatePlayer
        && room_ZJH.gameInfo.curTurnNum == 1) {
        return true;
    }else{
        return false;
    }
},

room_ZJH.isGameEnd = function () {
    if (Object.keys(room_ZJH.gameInfo).length != 0) {
        var loseNum = room_ZJH.losersArr.length;
        if (loseNum == room_ZJH.playersArr.length -1) {
            return true;
        }else{
            return false;
        }
    }else{
        return null;
    }

},

room_ZJH.isObPlayer = function (uid) {
    if (!room_ZJH.playersArr) {
        return
    }
    return room_ZJH.playersArr.indexOf(uid) == -1;
},

room_ZJH.isLoser= function (uid) {
    if (Object.keys(room_ZJH.gameInfo).length == 0) {
        return
    }
    if (room_ZJH.losersArr.indexOf(uid) != -1 && room_ZJH.GiveUpArr.indexOf(uid) == -1) {
        return true;
    }else{
        return false;
    }
    return null
},

room_ZJH.isAddChips = function(uid){
    for (var key in room_ZJH.gameInfo.chips) {
        if (key == uid) {
            if (room_ZJH.gameInfo.chips[key].length > 1){
                return true;
            }else{
                return false;
            }
        }
    }
    return null
};

room_ZJH.isAutoFollow = function(uid){
    for (var key in room_ZJH.gameInfo.auotFollowUids) {
        if (key == uid) {
            if (room_ZJH.gameInfo.auotFollowUids[key]) {
                return true;
            }else{
                return false
            }
        }
    }
    return null
};

room_ZJH.isMingPai= function(uid){
    for (var key in room_ZJH.gameInfo.playerMingPai) {
        if (key == uid) {
            return true;
        }else {
            return false;
        }
    }
    return null;
};

room_ZJH.isFirstTurn= function(uid){
    for (var key in room_ZJH.gameInfo.chips) {
        if (uid == key) {
            if (room_ZJH.gameInfo.chips[key].length == 2) {
                return true;
            }else {
                return false;
            }
        }
    }
    return null;
};


room_ZJH.registMessage = function() {
    room_ZJH.initCreateRoomOpts();
    //游戏信息
    GameNet.getInstance().setCallBack('zhaJinHua-onGameInfo', function (data) {
        WriteLog("do event onGameInfo  " + JSON.stringify(data));
        room_ZJH.gameInfo = data;
        GameData.game.zhuangUid = data.zhuangUid;
        GameData.game.gameStart = true;
        //人物身份（OB,player,loser）
        room_ZJH.setPlayerArr(data.chips);
        room_ZJH.setLosersArr(data.losers);
        room_ZJH.setGiveUpArr(data.playerGiveUps);
        sendEvent('zhaJinHua-onGameInfo');
    });
    ////同步玩家数据
    //加注
    GameNet.getInstance().setCallBack('zhaJinHua-onPlayerAddChips', function (data) {
        WriteLog("do event onPlayerAddChips  " + JSON.stringify(data));
        sendEvent('onPlayerAddChips',data);
    });
    //跟注
    GameNet.getInstance().setCallBack('zhaJinHua-onPlayerFollowChips', function (data) {
        WriteLog("do event onPlayerFollowChips  " + JSON.stringify(data));
        sendEvent('onPlayerFollowChips',data);
    });
    //弃牌
    GameNet.getInstance().setCallBack('zhaJinHua-onPlayerGiveUp', function (data) {
        WriteLog("do event onPlayerGiveUp  " + JSON.stringify(data));
        sendEvent('onPlayerGiveUp',data);
    });
    //比牌
    GameNet.getInstance().setCallBack('zhaJinHua-onPlayerCompare', function (data) {
        WriteLog("do event onPlayerCompare  " + JSON.stringify(data));
        room_ZJH.isCompare = true;
        sendEvent('onPlayerCompare',data);
    });
    //看牌
    GameNet.getInstance().setCallBack('zhaJinHua-onPlayerCheck', function (data) {
        WriteLog("do event onPlayerCheck  " + JSON.stringify(data));
        room_ZJH.pokers[data.uid] = data.cards;
        room_ZJH.playerPokerType[data.uid] = data.type;
        sendEvent('onPlayerCheck',data);
    });
    //亮牌
    GameNet.getInstance().setCallBack('zhaJinHua-onPlayerMingPai', function (data) {
        WriteLog("do event onPlayerMingPai  " + JSON.stringify(data));
        room_ZJH.pokers[data.uid] = data.cards;
        room_ZJH.playerPokerType[data.uid] = data.type;
        sendEvent('onPlayerMingPai',data);
    });
    //调牌
    GameNet.getInstance().setCallBack('zhaJinHua-onShowCardsInfo', function (data) {
        WriteLog("do event zhaJinHua-onShowCardsInfo  " + JSON.stringify(data));
        room_ZJH.pokers[GameData.player.uid] = data.selfCards;
        room_ZJH.playerPokerType[GameData.player.uid] = data.selfType;
        for (var key in data.othersCards) {
            room_ZJH.pokers[key] = data.othersCards[key];
        }
        for (var key1 in data.othersTypes) {
            room_ZJH.playerPokerType[key1] = data.othersTypes[key];
        }
        sendEvent('refreshPoker');
    });
    //小结算
    GameNet.getInstance().setCallBack('zhaJinHua-onZhaJinHuaRunEnd', function (data) {
        WriteLog("do event onZhaJinHuaRunEnd  " + JSON.stringify(data));
        sendEvent('onZhaJinHuaRunEnd',data);
    });
    //总结算
    GameNet.getInstance().setCallBack('zhaJinHua-onZhaJinHuaRoomEnd', function (data) {
        WriteLog("do event onZhaJinHuaRoomEnd   " + JSON.stringify(data));
        GameData.game.close = true;
        GameData.game.gameStart = false;
        room_ZJH.gameResultData = data;
        sendEvent('onZhaJinHuaRoomEnd');
        room_ZJH.initData();
    });
    GameNet.getInstance().setCallBack('zhaJinHua-onGameStart', function (data) {
        WriteLog("do event zhaJinHua-onGameStart  " + JSON.stringify(data));
        GameData.game.gameStart = true;
        GameData.game.close = false;
        room_ZJH.isCompare = false;
        room_ZJH.pokers = {};
        room_ZJH.playerPokerType = {};
        sendEvent('zhaJinHua-onGameStart');
    });


};
room_ZJH.unregistAllMessage = function () {

};

