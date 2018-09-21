var soundMngr = require('SoundMngr');
var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
var roomHandler = require('roomHandler');
var niuNiuHandler = require('niuNiuHandler');
var niuniuPokerHandler = require('niuniuPokerHandler');
var _getBossIntr = function (idx) {
    var strs = [
        // "房主坐庄",
        "轮流坐庄",
        // "牛牛坐庄",
        // "自由抢庄",
        "明牌抢庄"
    ]
    return strs[idx];
};

cc.Class({
    extends: cc.Component,

    properties: {
        roomId: cc.Label, // 房间编号
        roomTitle: cc.Node,
        bossType: cc.Label, // 庄位
        roundInfo: cc.Label, // 局数
        scoreBase: cc.Label, // 底分
        playerHeads: [cc.Node],
        readyNode: cc.Node,
        wifiNode: cc.Node,
        playerTemplate: cc.Prefab,
        btnReady: cc.Node,
        btnStart: cc.Node, //开始按钮
        quitRoomBtn: cc.Node, //退出房间按钮
        unStartLayer: cc.Node,
        playintrNode: cc.Node,
        lastTimeLabel: cc.Label,
        resultLayer: cc.Node,
        costTips : cc.Node,

        dragonBonesNode: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        this.headers = new Array();
        this.handlerMsg();
        this.initUi();
        //添加互动动画
        this.addDynAnimation();
    },
    handlerMsg: function () {
        require('util').registEvent('dynChat', this, this.dynChatHandler);
        require('util').registEvent('onRoomInfo', this, this.initPlayers);
        require('util').registEvent("douniu-onGameStart", this, this.initUi);
        require('util').registEvent('onCreatorQuit', this, this.onCreatorQuit);
        require('util').registEvent('onPrepareInfo', this, this.initReadyInfo);
        require('util').registEvent('onJoinerConnect', this, this.initPlayers);
        require('util').registEvent('onRoomChat', this, this.onRoomChatHandler);
        require('util').registEvent('onJoinerLost', this, this.handleJoinerLost);
        require('util').registEvent('alertLottery', this, this.openLotteryPanel);
        require('util').registEvent('yunwaUploaded', this, this.onYunwaUploaded);
        require('util').registEvent('douniu-onGameInfo', this, this.showPlayerRoundInfo);
    },
    onDestroy: function () {
        unrequire('util').registEvent('dynChat', this, this.dynChatHandler);
        unrequire('util').registEvent('onRoomInfo', this, this.initPlayers);
        unrequire('util').registEvent("douniu-onGameStart", this, this.initUi);
        unrequire('util').registEvent('onCreatorQuit', this, this.onCreatorQuit);
        unrequire('util').registEvent('onPrepareInfo', this, this.initReadyInfo);
        unrequire('util').registEvent('onJoinerConnect', this, this.initPlayers);
        unrequire('util').registEvent('onRoomChat', this, this.onRoomChatHandler);
        unrequire('util').registEvent('onJoinerLost', this, this.handleJoinerLost);
        unrequire('util').registEvent('alertLottery', this, this.openLotteryPanel);
        unrequire('util').registEvent('yunwaUploaded', this, this.onYunwaUploaded);
        unrequire('util').registEvent('douniu-onGameInfo', this, this.showPlayerRoundInfo);
        this.unschedule(this.updateLastTime);
    },

    initUi: function () {
        this.readyNode.active = false; //准备
        this.btnStart.active = false; // 开始
        this.costTips.active = false;
        this.TipsFlag = true;
        this.gamestatus = niuNiuHandler.status;
        this.niuniuGameStatus = niuniuPokerHandler.getGameStatus();
        var roomInfo = roomHandler.room;
        this.initPlayers(); //初始化玩家的头像信息
        this.unStartLayer.active = roomInfo.status == gameDefine.RoomState.WAIT;
    },
    showRuleUI: function () {
        var roomInfo = roomHandler.room;
        var opacitys = 0;
        // this.bossType.string = "庄位: " + _getBossIntr(roomInfo.opts.bossType - 1);
        if (roomHandler.room.opts.currencyType == gameDefine.currencyType.Currency_Coin) {
            opacitys = 81;
            this.bossType.string = '';
            this.roundInfo.string = '';
            var roundNums = roomInfo.gameNum+1;
            if (roundNums.toString().length == 1) {
                roundNums = '000'+ roundNums;
            }else if (roundNums.toString().length == 2) {
                roundNums = '00'+ roundNums;
            }else if (roundNums.toString().length == 3) {
                roundNums = '0'+ roundNums;
            }else if (roundNums.toString().length == 4) {
                roundNums = roundNums;
            }
            this.roomId.string = roundNums+roomInfo.id;
            this.roomId.node.x = -118;
            var scoreleve = roomHandler.room.opts.scorelv;
            var baseCoin = getMatchCostTableFinal(gameDefine.GameType.Game_niu_niu, scoreleve);
            this.scoreBase.string = "底分: "+baseCoin;
            this.scoreBase.node.parent.y = this.bossType.node.parent.y;
            this.roomTitle.active = false;    
        }else {
            opacitys = 255;
            this.roomId.string = roomInfo.id;
            this.roundInfo.string = "局数: " + roomInfo.roundNum + " / " + roomInfo.opts.roundMax;
            this.bossType.string = "人数: "+ roomInfo.opts.joinermax;
            this.scoreBase.string = "底分: " + roomInfo.opts.scoreBase;
            this.roomTitle.active = true;
        }
        this.roomId.node.opacity = opacitys;
        this.scoreBase.node.opacity = opacitys;
    },
    initPlayers: function () {
        this.headers = [];
        this.initPlayerHeads();
        var players = GameData.joiners;
        for (var j = 0; j < players.length; j++) {
            var player = players[j];
            if (player != null){
                var localIndex = roomHandler.getLocalPosition(j);
                var headNode = this.playerHeads[localIndex].getChildByName("TableNiuNiuPlayerTemplate");
                headNode.parent.active = true;

                var playerHeadScp = headNode.getComponent("niuNiuPlayerInfo");
                var isOnline = roomHandler.isPlayerOnline(player.uid);
                playerHeadScp.showHeadBg(true);
                playerHeadScp.setPlayer(player);
                playerHeadScp.HeadBtnIsClick(true);
                playerHeadScp.setName(player.name);
                playerHeadScp.setHeadIcon(player.headimgurl);
                playerHeadScp.setIsOnline(isOnline);
                this.headers.push(headNode);
            }
        }
        this.showPlayerRoundInfo();
    },
    initPlayerHeads: function () {
        for (var i = 0; i < this.playerHeads.length; i++) {
            var headNode = this.playerHeads[i].getChildByName("TableNiuNiuPlayerTemplate");
            var playerHeadScp = headNode.getComponent("niuNiuPlayerInfo");
            playerHeadScp.setPlayer({});
            playerHeadScp.showHeadBg(false);
            playerHeadScp.setName('');
            playerHeadScp.HeadBtnIsClick(false);
            playerHeadScp.initHeadIcon();
            if (!niuNiuHandler.readyBtnActive) {
                playerHeadScp.setCoin('');    
            }
            playerHeadScp.setIsOnline(true);
            // 设置玩家下注的倍数
            var betNode = this.playerHeads[i].getChildByName("betNum");
            for (var j = 0; j < betNode.childrenCount; j++) {
                betNode.children[j].active = false;
            }
            // 设置玩家抢庄状态
            var zhuangNode = this.playerHeads[i].getChildByName("numQiang");
            for (var k = 0; k < zhuangNode.childrenCount; k++) {
                zhuangNode.children[k].active = false;
            }
            this.playerHeads[i].active = true;
        }
    },
    showPlayerRoundInfo: function () {
        var players = GameData.joiners;
        for (var j = 0; j < players.length; j++) {
            var player = players[j];
            if (player != null){
                var localIndex = roomHandler.getLocalPosition(j);
                // 设置玩家下注的倍数
                var betNum = niuNiuHandler.playerChips[player.uid];
                var betNode = this.playerHeads[localIndex].getChildByName("betNum");
                for (var i = 0; i < betNode.childrenCount; i++) {
                    betNode.children[i].active = false;
                }
                if (betNum > 0 && betNode.getChildByName(betNum + "jiao")) {
                    betNode.getChildByName(betNum + "jiao").active = true;
                }
                // 设置玩家抢庄状态
                var zhuangNum = niuNiuHandler.playerZhuang[player.uid];
                if (niuNiuHandler.playerZhuang[player.uid] <= 0 && player.uid === niuNiuHandler.zhuangUid) {
                    zhuangNum = 1;
                }
                var zhuangNode = this.playerHeads[localIndex].getChildByName("numQiang");
                for (var i = 0; i < zhuangNode.childrenCount; i++) {
                    zhuangNode.children[i].active = false;
                }
                if (niuNiuHandler.status >= this.niuniuGameStatus.ZHUANG && zhuangNode.getChildByName(zhuangNum + "qiang")) {
                    zhuangNode.getChildByName(zhuangNum + "qiang").active = true;
                }
                if (niuNiuHandler.status >= this.niuniuGameStatus.COMPARE && niuNiuHandler.zhuangUid != player.uid) {
                    for (var i = 0; i < zhuangNode.childrenCount; i++) {
                        zhuangNode.children[i].active = false;
                    }
                }
            }
        }
        this.showRuleUI();
        this.initReadyInfo();
        if (roomHandler.room.opts.currencyType == gameDefine.currencyType.Currency_Coin) {
            this.beginCountDown();
        }
    },
    // 玩家的准备信息 
    initReadyInfo: function () {
        if (roomHandler.room.opts.currencyType == gameDefine.currencyType.Currency_Coin) return;
        if (roomHandler.room.status == gameDefine.RoomState.WAIT || roomHandler.room.status == gameDefine.RoomState.READY) {
            for (var child in this.readyNode.children) {
                this.readyNode.children[child].active = false;
            }
            var players = GameData.joiners;
            for (var j = 0; j < players.length; j++) {
                var userInfo = players[j]; // 房间内玩家的信息
                if (userInfo != null){
                    var localIndex = roomHandler.getLocalPosition(j);
                    // 判断准备按钮是否可用
                    var ready = roomHandler.readyData[userInfo.uid];
                    if (localIndex == 0 && userInfo.uid == GameData.player.uid) {
                        if (ready == false) {
                            if (niuNiuHandler.readyBtnActive 
                                || (this.gamestatus != niuNiuHandler.status 
                                    && niuNiuHandler.status == this.niuniuGameStatus.SETTLE)
                                || (this.gamestatus == niuNiuHandler.status && niuNiuHandler.status == this.niuniuGameStatus.COMPARE)) {
                                this.btnReady.active = ready;
                            }else{
                                this.btnReady.active = !ready;
                            }
                        }else{
                            this.btnReady.active = !ready;
                        }
                    }
                    
                    if (ready) {
                        if (niuNiuHandler.readyBtnActive 
                            || (this.gamestatus != niuNiuHandler.status 
                                && niuNiuHandler.status == this.niuniuGameStatus.SETTLE)
                            || (this.gamestatus == niuNiuHandler.status && niuNiuHandler.status == this.niuniuGameStatus.COMPARE)) {
                            this.readyNode.getChildByName("ready_hand_" + localIndex).active = !ready;
                        }else{
                            this.readyNode.getChildByName("ready_hand_" + localIndex).active = ready;
                        }
                    }else {
                        this.readyNode.getChildByName("ready_hand_" + localIndex).active = ready;
                    } 
                }
            }
            this.readyNode.active = true;
            this.beginCountDown();
        } else {
            this.readyNode.active = false;
            this.btnReady.active = false;
        }
        this.gamestatus = niuNiuHandler.status;
    },
    //开始按钮的回调函数
    onSartBtnClick: function () {
        soundMngr.instance.playAudioOther('button');
        var players = roomHandler.players;
        if (players.length < 2) {
            createMoveMessage("房间内至少有两名玩家");
            return;
        }
        for (var i = 0; i < players.length; i++) {
            var userInfo = players[i];
            if (userInfo == null) continue;
            if (!roomHandler.readyData[userInfo.uid]) {
                createMoveMessage("房间内的玩家必须都要准备");
                return;
            }
        }
        niuNiuHandler.requestStart();
    },
    //复制房间号
    onCopyRoomInfo: function () {
        soundMngr.instance.playAudioOther('button');
        var roomId = roomHandler.room.id;
        if (roomId > 0) {
            var gameType = '';
            if (roomHandler.room.opts.gameType == gameDefine.GameType.Game_Niu_Niu_10) {
                gameType = '拼十(10人),';
            }else if (roomHandler.room.opts.gameType == gameDefine.GameType.Game_niu_niu) {
                gameType = '拼十(6人),';
            }
            var title = gameType + "房间号:" + roomId + ",";
            var roomInfo = roomHandler.room.opts;
            var des = getRuleStrNiuNiu(roomInfo)+",邀请您快速进入";
            wxShareCommond(title + des);
        }
    },
    // 退出房间的按钮
    onQuitRoomBtnClick: function () {
        soundMngr.instance.playAudioOther('button');
        this.quitRoomBtn.active = false;
        if (roomHandler.room.creator == GameData.player.uid) {
            cc.director.loadScene('home');
        } else {
            roomHandler.quitRoom(roomHandler.room.id);
        }
    },

    onCreatorQuit :function()
    {
        GameData.player.roomid = undefined;
        if(roomHandler.room.creator != GameData.player.uid)
        {
            NiuNiuMessageBox('房主已经解散房间', function() {cc.director.loadScene('home');});            
        }
        else
        {
            cc.director.loadScene('home');
        }
    },
    // 玩家信息
    ruleClick : function(){
        soundMngr.instance.playAudioOther('button');
        if(this.playintrNode.active == true){
            return;
        }
        this.playintrNode.active = true;
        this.onShowPlayIntrClick();
        this.playintrNode.runAction(cc.sequence(
            cc.moveTo(0.5,cc.p(30,334)),
            cc.delayTime(10),
            cc.moveTo(0.5,cc.p(30,434)),
            cc.callFunc(this.isRuleBtn,this)
        ));

    },

    isRuleBtn :function(){
        this.playintrNode.active = false;
    },

    onShowPlayIntrClick : function()
    {
        soundMngr.instance.playAudioOther('button');
        this.playIntrSize = this.playIntrSize == 'small' ? 'big' : 'small';
        this.showPlayIntroduce(this.playIntrSize);
        cc.find('openBtn',this.playintrNode).rotation = this.playIntrSize == 'small' ? 0 : 180;
    },

    showPlayIntroduce : function(size)
    {  // console.log('GameData.room.opts '+GameData.room.opts);
        if(!roomHandler.room.opts)return;
        var playStr = '';
        playStr += roomHandler.room.opts.roundMax +'局,';
        playStr +=  '2-6人,';
        if(roomHandler.room.opts.costType == 1){
            playStr +=  '房主付费,';
        }else if(roomHandler.room.opts.costType == 2){
            playStr +=  'AA,';
        }else if(roomHandler.room.opts.costType == 3){
            playStr +=  '赢家付,';
        }

        playStr += '底分:'+roomHandler.room.opts.scoreBase+'分,';

        if(roomHandler.room.opts.multipleType == 0){
            playStr +=  '下注1/2/3/5,';
        }else if(roomHandler.room.opts.multipleType == 1){
            playStr +=  '下注1/2,';
        }
        playStr +=  '明牌抢庄';

        var contentNode = cc.find(size + '/content',this.playintrNode);
        var label = contentNode.getComponent(cc.Label);
        label.string = playStr;
    },

    //微信邀请按钮
    wxInviteBtnClicked: function () {
        soundMngr.instance.playAudioOther('button');
        var gameType = '';
        if (roomHandler.room.opts.gameType == gameDefine.GameType.Game_Niu_Niu_10) {
            gameType = '拼十(10人),';
        }else if (roomHandler.room.opts.gameType == gameDefine.GameType.Game_niu_niu) {
            gameType = '拼十(6人),';
        }
        var title = gameType + "房间号:" + roomHandler.room.id;
        var des = this.getInviteStr();
        wxShareWeb(title, des);
    },
    //-------------------------- 网络监听回调
    // 监听用户离开
    handleJoinerLost: function () {
        this.initPlayers();
    },

    //---------------------------------

    getInviteStr: function () {
        var str = "玩法: " + this.bossType.string + ',' + roomHandler.room.opts.roundMax+ '局,'+ this.scoreBase.string + ',2-'+roomHandler.room.opts.joinermax+'人,';
        if(roomHandler.room.opts.costType == 1){
            str +=  '房主付费';
        }else if(roomHandler.room.opts.costType == 2){
            str +=  'AA';
        }else if(roomHandler.room.opts.costType == 3){
            str +=  '赢家付';
        }
        str = str + ", 请您快速加入";
        cc.log('........str = '+str);
        return str;
    },
    onYunwaUploaded:function (data) {
        var soundurl = data.detail;
         WriteLog('soundurl ：'+ soundurl);
        ChatHandler.getInstance().sendRecord(soundurl);
    },

    onRoomChatHandler : function(data)
    {
        soundMngr.instance.playAudioOther('button');
        var uid = data.detail.uid;
        var type = data.detail.msg.type;
        cc.log('uid = '+uid+',type = '+type);
        var player = roomHandler.getPlayerByUid(uid);
        if (player == null) return;
        var playerSex = player.sex;
        //cc.log(' this.headers:'+ this.headers.length);
        //cc.log(' this.uid:'+ headerNode.getComponent('playerTemplate').uid,uid);
        for(var i = 0; i < this.headers.length; i++)
        {
            var headerNode = this.headers[i];
            cc.log(' this.uid:'+ headerNode.getComponent('niuNiuPlayerInfo').uid,uid);
            if(headerNode.getComponent('niuNiuPlayerInfo').uid == uid)
            { 
                var chatNode = cc.find('chat',headerNode);
                if(chatNode != null)
                {
                    var wordNode = cc.find('word',chatNode);
                    var emoNode = cc.find('emo',chatNode);
                    var yuyinNode = cc.find('yuyinNode',chatNode);
                    if(type == 'word')
                    {
                        var content = data.detail.msg.data;

                        var chatBg = cc.find('word/bg',chatNode);
                        var chatLabel = cc.find('word/Label',chatNode).getComponent(cc.Label);
                        var contentStr = content;
                        chatBg.width = 20+contentStr.length * 24;
                        wordNode.getComponent('HideComponent').show(3);
                        chatLabel.string = contentStr;
                    }
                    else if(type == 'fast')
                    {
                        var soundKey = data.detail.msg.data.sound;
                        var content = data.detail.msg.data.content;
                        var chatBg = cc.find('word/bg',chatNode);
                        var chatLabel = cc.find('word/Label',chatNode).getComponent(cc.Label);
                        var contentStr = getShortStr(content,10);
                        chatBg.width = contentStr.length * 30;
                        wordNode.getComponent('HideComponent').show(3);
                        chatLabel.string = contentStr;
                        cc.log('soundKey:'+soundKey,playerSex);
                        soundMngr.instance.playAudioChat(soundKey,playerSex);
                        
                    }
                    else if(type == 'emo')
                    {
                        var animationName = data.detail.msg.data;
                        emoNode.getComponent(cc.Animation).play(animationName);
                        emoNode.getComponent('HideComponent').show(3);
                    }
                    else if(type == 'yuyin') 
                    {   
                        if(!GameData.isPlayVioce){
                            return;
                        }
                        var soundurl = data.detail.msg.data;
                        if (cc.sys.OS_ANDROID == cc.sys.os)
                        {
                            jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "playRecord", "(Ljava/lang/String;)V",soundurl);
                        } 
                        else if(cc.sys.OS_IOS == cc.sys.os)
                        {
                            jsb.reflection.callStaticMethod("AppController", "playRecord:", String(soundurl));
                        }
                        var yuyinAnim = cc.find('yuyinAnimNode/yuyinAnim',yuyinNode);
                        yuyinAnim.getComponent(cc.Animation).play("yuyinduihua");
                        yuyinNode.getComponent('HideComponent').show(3);

                    }                 
                }           
            }
        }
    },
    clearSignUI: function () {
        var players = GameData.joiners;
        for (var j = 0; j < players.length; j++) {
            var player = players[j];
            if (player != null){
                var localIndex = roomHandler.getLocalPosition(j);
                var headNode = this.playerHeads[localIndex].getChildByName("TableNiuNiuPlayerTemplate");

                var playerHeadScp = headNode.getComponent("niuNiuPlayerInfo");
                 // 设置玩家下注的倍数
                var betNum = niuNiuHandler.playerChips[player.uid];
                var betNode = this.playerHeads[localIndex].getChildByName("betNum");
                for (var i = 0; i < betNode.childrenCount; i++) {
                    betNode.children[i].active = false;
                }

                // 设置玩家抢庄状态
                var zhuangNode = this.playerHeads[localIndex].getChildByName("numQiang");
                for (var i = 0; i < zhuangNode.childrenCount; i++) {
                    zhuangNode.children[i].active = false;
                }
            }
        }
    },
    //房卡牌局倒计时接口
    beginCountDown: function () {
        if (roomHandler.readyCountDown > 0 
            && (roomHandler.room.status == gameDefine.RoomState.WAIT || roomHandler.room.status == gameDefine.RoomState.READY)) {
            this.lastTimeLabel.string = '';
            this.lastTimeLabel.node.active = true;
            this.clearSignUI();
            this.handleCloseTimer();
        }else {
            this.lastTimeLabel.node.active = false;
            this.unschedule(this.updateLastTime);
        }
    },
    //开始倒计时
    handleCloseTimer: function () {
        cc.log('ready start count: roomHandler.readyCountDown = '+roomHandler.readyCountDown);
        this.updateLastTime();
        this.TipsFlag = true;
        this.schedule(this.updateLastTime, 1);
    },
    updateLastTime: function () {
        roomHandler.readyCountDown --;
        cc.log('ready run time: roomHandler.readyCountDown = '+roomHandler.readyCountDown);
        if (niuNiuHandler.status >= this.niuniuGameStatus.ZHUANG && niuNiuHandler.status < this.niuniuGameStatus.SETTLE) {
            this.lastTimeLabel.node.active = false;
            this.unschedule(this.updateLastTime);
            return;
        }
        if (niuNiuHandler.readyBtnActive || roomHandler.readyCountDown <= 0) {
            this.lastTimeLabel.node.active = false;
        } else {
            var firstGame = this.isFirstPlayGame();
            if (this.TipsFlag && firstGame && roomHandler.room.opts.currencyType == gameDefine.currencyType.Currency_Coin) {
                this.showCostTips();
                this.TipsFlag = false;
            }
            this.lastTimeLabel.node.active = true;
        }
        this.lastTimeLabel.string = roomHandler.readyCountDown;
        if (roomHandler.readyCountDown <= 0) {
            this.readyLen = 0;
            this.costTips.active = false;
            this.unStartLayer.active = false;
            this.lastTimeLabel.node.active = false;
            this.unschedule(this.updateLastTime);
        }
    },
    showCostTips: function () {
        var config = configMgr.getServerConfig();
        var scoreLv = roomHandler.room.opts.scorelv;
        var costNum = config['matchCoin'][GameData.client.gameType].cost[scoreLv];
        this.costTips.active = true;
        this.costTips.getComponent(cc.Label).string = '每局消耗' + costNum + '金币';
    },
    isFirstPlayGame: function () {
        var data = roomHandler.getScoreData();
        for (var key in data){
            if (key == GameData.player.uid) {
                if (data[key] == 0) {
                    return true;
                }else {
                    return false;
                }
            }
        }
    },

    openLotteryPanel: function () {
        var roomInfo = roomHandler.room;
        if (roomInfo.roundNum == roomInfo.opts.roundMax) {
            setTimeout(function(){
                openView('GetLottery');
            },7000);
        }else {
            openView('GetLottery');
        }
    },

    getHeadPositionOnUid: function(uid){
        for (var i = 0; i < this.headers.length; i++) {
            var headerNode = this.headers[i];
            if(headerNode == undefined){
                continue;
            }
            var template = headerNode.getComponent('niuNiuPlayerInfo');
            if(template == undefined){
                continue;
            }
            if(template.uid != uid){
                continue;
            }
            return headerNode.parent.position;
        }
        return 0;
    },

    dynChatHandler: function(data){
        if(data == undefined || data.detail == undefined){
            return;
        }

        var index = data.detail.chatId,
            fromUid = data.detail.fromUid,
            toUid = data.detail.toUid;

        var animationNode = this.node.getChildByName('uiAnimationNode');
        if(animationNode){
            var template = animationNode.getComponent('tableDynAnimation');
            if(template){
                var fromPos = this.getHeadPositionOnUid(fromUid);
                var toPos = this.getHeadPositionOnUid(toUid);

                template.playAnimation(index, 0.65, fromPos, toPos);
            }
        }
    },

    addDynAnimation: function(){
        var animationNode = this.node.getChildByName('uiAnimationNode');
        if(animationNode == undefined){
            animationNode = cc.instantiate(this.dragonBonesNode);
            animationNode.parent = this.node;
            animationNode.name = 'uiAnimationNode';
        }
    }
});