var soundMngr = require('SoundMngr');
var gameDefine = require('gameDefine');
var roomHandler = require('roomHandler');
var RuleHandler = require('ruleHandler');
var niuNiuHandler = require('niuNiuHandler');
var NiuNiuPokerHandler = require('niuniuPokerHandler');
cc.Class({
    extends: cc.Component,

    properties: {
        dissolveLayer: cc.Node,
        dissolvePrefab: cc.Prefab,

        summaryLayer: cc.Node,
        summaryPrefab: cc.Prefab,

        debugLayer: cc.Node,
        debugPrefab: cc.Prefab,

        resultLayer: cc.Node,

        waitLayer : cc.Node,  //等待界面
        talkBtn :cc.Button, // 语音按钮
        yuyinNode:cc.Node,

        quitRoomBtn: cc.Node, //退出房间按钮
    },

    // use this for initialization
    onLoad: function () {
        soundMngr.instance.playMusic('shisanshui/sound/sss_table_bg1');
        //初始化数据
        this.initUIData();
        //初始化界面显示
        this.initUIShow();
        //添加解散
        this.addUIDissolve();
        //添加总结算
        this.addUISummary();
        //添加调牌
        this.addUIDebug();



        this.handlerMsg();
        this.talkClick();
        if (GameData.game.onRoomDissolve && Object.keys(GameData.game.onRoomDissolve).length > 0) {
            this.showDissolveLayer(1,1);
        }
    },
    initUIData: function() {
        cc.log("...room main init data.");
        RuleHandler.instance.setGameType(GameData.client.gameType);
        this.setCurGameData();
    },
    initUIShow: function(){
        this.resultLayer.active = false;
        this.summaryLayer.active = false;
        this.dissolveLayer.active = false;
        this.showLayer();
    },

    addUIDissolve: function(){
        var uiDissolveNode = this.dissolveLayer.getChildByName('uiDissolve');
        if(uiDissolveNode == undefined){
            uiDissolveNode = cc.instantiate(this.dissolvePrefab);
            uiDissolveNode.parent = this.dissolveLayer;
            uiDissolveNode.name = 'uiDissolve';
            uiDissolveNode.active = true;
        }
    },
    addUISummary: function(){
        var uiSummaryNode = this.summaryLayer.getChildByName('uiSummary');
        if(uiSummaryNode == undefined){
            uiSummaryNode = cc.instantiate(this.summaryPrefab);
            uiSummaryNode.parent = this.summaryLayer;
            uiSummaryNode.name = 'uiSummary';
        }
    },
    addUIDebug: function(){
        var uiDebug = this.debugLayer.getChildByName('uiDebug');
        if(uiDebug == undefined){
            uiDebug = cc.instantiate(this.debugPrefab);
            uiDebug.parent = this.debugLayer;
            uiDebug.name = 'uiDebug';
            uiDebug.active = false;
        }
    },
    RoomInfoHandler: function(data){
        if(data == undefined){
            return;
        }
        this.setCurGameData();
        this.showLayer();
        this.addUISummary();
    },
    setCurGameData: function(){
        var roomData = roomHandler.getRoomData();
        if(roomData == undefined){
            return;
        }
    },


    showLayer: function () {
        if (GameData.room.status > gameDefine.RoomState.WAIT || roomHandler.readyCountDown > 0) {
            this.showWaitLayer(false);
        } else {
            this.showWaitLayer(true);
        }

        //判断退出按钮是否显示
        if (roomHandler.room.opts.currencyType == gameDefine.currencyType.Currency_Coin){
            this.showCoinQuitRoomBtn();
        } else {
            this.showCardsQuitRoomBtn();
        }
    },
    //房卡场退出按钮显示
    showCardsQuitRoomBtn: function () {
        var playGames = roomHandler.playGame;
        if (playGames[GameData.player.uid] == undefined) return;
        if (playGames[GameData.player.uid] == 0) {
            if (roomHandler.readyData[GameData.player.uid] && roomHandler.readyCountDown > 0) {
                this.quitRoomBtn.active = false;
            }else{
                this.quitRoomBtn.active = true;    
            }
        }else {
            this.quitRoomBtn.active = false;
        }
    },
    //匹配场退出房间按钮显示
    showCoinQuitRoomBtn: function () {
        if (roomHandler.room.opts.currencyType != gameDefine.currencyType.Currency_Coin) return;
        if (roomHandler.readyData[GameData.player.uid] == undefined && roomHandler.readyCountDown > 0) {
            if (niuNiuHandler.readyBtnActive) {
                this.quitRoomBtn.active = false;    
            }else {
                this.quitRoomBtn.active = true;
            }
        }
        var niuniuStatus = niuNiuHandler.status;
        var niuniuGameStatus = NiuNiuPokerHandler.getGameStatus();
        if (niuniuStatus == niuniuGameStatus.WAIT || niuniuStatus == niuniuGameStatus.SETTLE) {
            if (niuNiuHandler.readyBtnActive || niuNiuHandler.gameStart) {
                this.quitRoomBtn.active = false;    
            }else {
                this.quitRoomBtn.active = true;
            }
        }else {
            if (niuNiuHandler.spectator(GameData.player.uid)) {
                this.quitRoomBtn.active = true;   
            }else {
                this.quitRoomBtn.active = false;    
            } 
        }
    },

    showWaitLayer: function (act) {
        this.waitLayer.active = act;
    },

    showSettingLayer: function(evt, data) {
        soundMngr.instance.playAudioOther('button');
        openView('niuniu_settingPrefab', gameDefine.GameType.Game_niu_niu);
    },

    showResultLayer: function () {
        if (!niuNiuHandler.spectator(GameData.player.uid)) {
            // var AnimationDelayTime = 4;
            // var self = this;
            // this.scheduleOnce(function () {
            //     self.showResultDirectly();
            // }, AnimationDelayTime);
        }
    },
    showResultDirectly: function () {
        var flag = true;
        this.resultLayer.active = flag;
        this.waitLayer.active = !flag;
        //table初始化的时候不敢保证这个监听和抛事件谁先执行，改为接口形式
        //sendEvent('onShowResult');
        // if (GameData.contact == true && GameData.joinContact.uid == GameData.player.uid) {
        //     GameData.contact = false;
        // } else {
        //     GameData.contact = false;
        //     GameData.realNum++;
        // }
        this.node.getComponent('niuNiuProcessResult').showUI();
    },

    registShowDisLayer: function () {
        this.showDissolveLayer(1,1);
    },
    showDissolveLayer: function(evt, data) {
        if (data == 1) {
            this.dissolveLayer.active = true;
            this.dissolveLayer.on(cc.Node.EventType.TOUCH_START, function(evt) {evt.stopPropagation();});
        } else {
            this.dissolveLayer.active = false;
        }
    },

    showSummaryLayer: function() {
        this.summaryLayer.active = true;
        this.dissolveLayer.active = false;
        var uiSummaryNode = this.summaryLayer.getChildByName('uiSummary');
        uiSummaryNode.getComponent('niuNiuRoomResult').initUI();
        this.summaryLayer.on(cc.Node.EventType.TOUCH_START, function(evt) {evt.stopPropagation();});
    },

    showDebugLayer: function () {
        var uiDebug = this.debugLayer.getChildByName('uiDebug');
        if(uiDebug){
            uiDebug.active = true;
        }
    },

    showChat:function () {
         if (inCD(2000)) return;
         soundMngr.instance.playAudioOther('button');
         //cc.log('1111111111111111111');
         openView('NiuNiuChatPanel',gameDefine.GameType.Game_niu_niu);
    },
    talkClick:function () {
        var self = this;
        this.talkBtn.node.on(cc.Node.EventType.TOUCH_START,function(event){
            console.log('TOUCH_START');
            soundMngr.instance.playAudioOther('button');
            // WriteLog('TOUCH_START : ');
            //增加连点CD；
            if (inCD(2000)){return;}
            yunwaStartTalk();
            self.yuyinNode.active = true;
            GameData.isPlayVioce = true;
            self.yuyinNode.getComponent(cc.Animation).play("yuyin");
            cc.audioEngine.pauseAll();

        });
        this.talkBtn.node.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            //console.log('TOUCH_MOVE');
            var movePos = event.touch.getLocation();
            var talkBtnWorldPos = this.convertToWorldSpace(this.getPosition());
            var RelativeCoordinatePos = {};
            RelativeCoordinatePos.x = talkBtnWorldPos.x-this.getPosition().x+170;
            RelativeCoordinatePos.y = talkBtnWorldPos.y-this.getPosition().y+50;
            var distance = cc.pDistance(movePos,RelativeCoordinatePos);
            if(distance > this.width*2){
                self.yuyinNode.getComponent(cc.Animation).play("CancelSend");
                GameData.isPlayVioce = false;
                // console.log("distance: movePos this.width/2 "+distance,movePos,this.width/2);
            }
        });
        this.talkBtn.node.on(cc.Node.EventType.TOUCH_END,function(){
            //console.log('TOUCH_END');
            //WriteLog('TOUCH_END : ');
            yunwaStopTalk();
            self.yuyinNode.active = false;
            cc.audioEngine.resumeAll();
        });
        this.talkBtn.node.on(cc.Node.EventType.TOUCH_CANCEL,function(){
            //console.log('TOUCH_CANCEL');
            yunwaStopTalk();
            GameData.isPlayVioce = false;
            self.yuyinNode.active = false;
            cc.audioEngine.resumeAll();
        });
    },

    handlerMsg : function () {
        require('util').registEvent('onRoomInfo', this, this.RoomInfoHandler);
        require('util').registEvent('onPrepareInfo', this, this.showLayer);
        require('util').registEvent('douniu-onGameStart', this, this.showLayer);
        require('util').registEvent('douniu-onGameEnd',this, this.showResultLayer);
        require('util').registEvent('douniu-onGameInfo', this, this.showQuitRoomBtn);  
        require('util').registEvent('onRoomDissolve', this, this.registShowDisLayer);      
    },
    onDestroy : function () {
        unrequire('util').registEvent('onRoomInfo', this, this.RoomInfoHandler);
        unrequire('util').registEvent('onPrepareInfo', this, this.showLayer);
        unrequire('util').registEvent('douniu-onGameStart', this, this.showLayer);
        unrequire('util').registEvent('douniu-onGameEnd',this, this.showResultLayer);
        unrequire('util').registEvent('douniu-onGameInfo', this, this.showQuitRoomBtn);  
        unrequire('util').registEvent('onRoomDissolve', this, this.registShowDisLayer);
        this.unscheduleAllCallbacks();
        niuNiuHandler.initAllData();
        GameData.initGameData(); 
    },
});
