var soundMngr = require('SoundMngr');
var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
var RuleHandler = require('ruleHandler');
var RoomHandler = require('roomHandler');
var hongzhongData = require('hongzhongData');

cc.Class({
    extends: cc.Component,

    properties: {
        uiWaitLayer: cc.Node,
        resultLayer: cc.Node,
        dissolveLayer: cc.Node,
        summaryLayer: cc.Node,
        scoreLayer: cc.Node,
        debugLayer: cc.Node,
        mapLayer: cc.Node,
        layerPlayer: cc.Node,

        debugBtn: cc.Node,
        mapBtnNode: cc.Node,

        deleteRoomBtn: cc.Node,
        quitRoomBtn: cc.Node,

        uiResult: cc.Prefab,
        uiSummary: cc.Prefab,
        uiDissolve: cc.Prefab,
        uiScore: cc.Prefab,
        uiMap: cc.Prefab,
        uiDebug: cc.Prefab,
        uiPlayers: cc.Prefab,

        tableUI: {
            default: [],
            type: cc.Node
        }
    },

    onLoad: function () {
        cc.log('..uiMain onLoad.');
        require('util').registEvent('onRoomInfo', this, this.RoomInfoHandler);
        require('util').registEvent('onGameStart', this, this.GameStartHandler);
        require('util').registEvent('onGameScore', this, this.GameScoreHandler);
        require('util').registEvent('onJoinerLost', this, this.showJoinerLost);
        require('util').registEvent('onJoinerConnect', this, this.showJoinerConnect);
        require('util').registEvent('showSummary', this, this.showSummaryLayer);
        require('util').registEvent('onRoomInfo', this, this.onRoomInfoHandler);
        require('util').registEvent('onPrepareInfo', this, this.onRoomReadyInfoHandler);
        require('util').registEvent('onCreatorQuit', this, this.onCreatorQuit);
    },
    onDestroy: function () {
        unrequire('util').registEvent('onRoomInfo', this, this.RoomInfoHandler);
        unrequire('util').registEvent('onGameStart', this, this.GameStartHandler);
        unrequire('util').registEvent('onGameScore', this, this.GameScoreHandler);
        unrequire('util').registEvent('onJoinerLost', this, this.showJoinerLost);
        unrequire('util').registEvent('onJoinerConnect', this, this.showJoinerConnect);
        unrequire('util').registEvent('showSummary', this, this.showSummaryLayer);
        unrequire('util').registEvent('onRoomInfo', this, this.onRoomInfoHandler);
        unrequire('util').registEvent('onPrepareInfo', this, this.onRoomReadyInfoHandler);
        unrequire('util').registEvent('onCreatorQuit', this, this.onCreatorQuit);
    },
    onEnable: function(){
        cc.log('..uiMain onEnable.');
        MjHandler.getInstance().requestReady();
        scheduleLamp(this);

        //初始化数据
        this.initUIData();
        //初始化界面显示
        this.initUIShow();
        //添加玩家头像和玩家状态相关
        this.addPlayers();
        //添加小结算
        this.addUIResult();
        //添加总结算
        this.addUISummary();
        //添加分数
        this.addUIScore();
        //添加解散
        this.addUIDissolve();
        //添加地图节点
        this.addUIMap();
        //添加调牌
        this.addUIDebug();

        //设置基本界面显示
        this.setUIBaseInfo();
    },

    onRoomInfoHandler: function() {
        this.updatePlayersWithRoom();
    },
    onRoomReadyInfoHandler: function() {
        this.updatePlayersReady();
    },

    initUIData: function() {
        cc.log("...room main init data.");

        RuleHandler.instance.setGameType(GameData.client.gameType);

        this._curGameData = undefined;
        //设置当前游戏数据管理
        this.setCurGameData();
    },
    initUIShow: function(){

        this.debugBtn.active = configMgr.getSetCardsOpen();//!cc.sys.isNative;

        this.resultLayer.active = false;
        this.summaryLayer.active = false;
        /*
        if(this._curGameData){
            var gameInfoData = this._curGameData.getGameInfoData();
            if(gameInfoData){
                if (gameInfoData.gameStart) {
                    this.showTableLayer();
                } else {
                    this.showWaitLayer();
                }
            }
        }
        */
        this.setLayerShow();
    },

    setCurGameData: function(){
        var roomData = RoomHandler.getRoomData();
        if(roomData == undefined){
            return;
        }
        switch (roomData.opts.gameType){
            case gameDefine.GameType.Game_Mj_HZ:{
                this._curGameData = hongzhongData;
            }break;
        }
    },
    setLayerShow: function(){
        var roomData = RoomHandler.getRoomData();
        if(roomData){
            if(roomData.status >= gameDefine.RoomState.GAMEING){
                this.showTableLayer();
            } else {
                this.showWaitLayer();
            }
        }
    },

    RoomInfoHandler: function(data){
        if(data == undefined){
            return;
        }
        RoomHandler.onRoomInfoSetData(data.detail);

        this.setCurGameData();
        this.setLayerShow();
        this.addUIResult();
        this.addUISummary();
        this.addUIScore();
    },
    GameStartHandler: function(data){
        if(data == undefined || this._curGameData == undefined){
            return;
        }
        this._curGameData.onGameStartSetData(data.detail);

        this.showTableLayer();
        this.mapCondition();
        this.setMapBtnShow();
    },
    GameScoreHandler: function(data){
        if(data == undefined || this._curGameData == undefined){
            return;
        }
        this._curGameData.onGameScoreSetData(data.detail);

        this.showResultLayer();
    },

    addPlayers: function(){
        var uiPlayersNode = this.layerPlayer.getChildByName('uiPlayers');
        if(uiPlayersNode == undefined){
            uiPlayersNode = cc.instantiate(this.uiPlayers);
            uiPlayersNode.parent = this.layerPlayer;
            uiPlayersNode.name = 'uiPlayers';
        }
        //设置相关状态信息
        this.updatePlayersWithRoom();
    },
    updatePlayersWithRoom: function() {
        var scoreData = RoomHandler.getScoreData();
        var onLineData = RoomHandler.getOnLinesData();
        if(scoreData == undefined || onLineData == undefined){
            return;
        }
        var uiPlayersNode = this.layerPlayer.getChildByName('uiPlayers');
        if (uiPlayersNode) {
            var template = uiPlayersNode.getComponent('tablePlayersControl');
            template.showPlayers();
            template.setPlayerScoreData(scoreData);
            template.setPlayerOnLineData(onLineData);
            this.updatePlayersReady();
        }
    },
    updatePlayersReady: function() {
        var roomData = RoomHandler.getRoomData();
        var readyData = RoomHandler.getRoomReadyData();
        if(roomData == undefined || readyData == undefined){
            return;
        }
        var uiPlayersNode = this.layerPlayer.getChildByName('uiPlayers');
        if (uiPlayersNode) {
            var template = uiPlayersNode.getComponent('tablePlayersControl');
            template.setRoomReadyData(roomData.status, readyData);
        }
    },
    addUIResult: function(){
        var uiResultNode = this.resultLayer.getChildByName('uiResult');
        if(uiResultNode == undefined){
            uiResultNode = cc.instantiate(this.uiResult);
            uiResultNode.parent = this.resultLayer;
            uiResultNode.name = 'uiResult';
        }
        var template = uiResultNode.getComponent('uiRoomResult');
        template._curGameData = this._curGameData;
    },
    addUISummary: function(){
        var uiSummaryNode = this.summaryLayer.getChildByName('uiSummary');
        if(uiSummaryNode == undefined){
            uiSummaryNode = cc.instantiate(this.uiSummary);
            uiSummaryNode.parent = this.summaryLayer;
            uiSummaryNode.name = 'uiSummary';
        }
        var template = uiSummaryNode.getComponent('uiRoomSummary');
        template._curGameData = this._curGameData;
    },
    addUIScore: function(){
        var uiScore = this.scoreLayer.getChildByName('uiScore');
        if(uiScore == undefined){
            uiScore = cc.instantiate(this.uiScore);
            uiScore.parent = this.scoreLayer;
            uiScore.name = 'uiScore';
            uiScore.active = false;
        }
        var template = uiScore.getComponent('uiRoomScore');
        template._curGameData = this._curGameData;
    },
    addUIDissolve: function(){
        var uiDissolveNode = this.dissolveLayer.getChildByName('uiDissolve');
        if(uiDissolveNode == undefined){
            uiDissolveNode = cc.instantiate(this.uiDissolve);
            uiDissolveNode.parent = this.dissolveLayer;
            uiDissolveNode.name = 'uiDissolve';
            uiDissolveNode.active = false;
        }
    },
    addUIMap: function(){
        var uiMap = this.mapLayer.getChildByName('uiMap');
        if(uiMap == undefined){
            uiMap = cc.instantiate(this.uiMap);
            uiMap.parent = this.mapLayer;
            uiMap.name = 'uiMap';
            uiMap.active = false;
        }
    },
    addUIDebug: function(){
        var uiDebug = this.debugLayer.getChildByName('uiDebug');
        if(uiDebug == undefined){
            uiDebug = cc.instantiate(this.uiDebug);
            uiDebug.parent = this.debugLayer;
            uiDebug.name = 'uiDebug';
            uiDebug.active = false;
        }
    },

    showWaitLayer: function () {
        this.uiWaitLayer.active = true;
        this.showTableUI(false);
        this.resultLayer.active = false;
        soundMngr.instance.playMusic('sound/beijyingyue');
    },

    showTableLayer: function () {

        this.showTableUI(true);
        this.uiWaitLayer.active = false;
        this.resultLayer.active = false;
        soundMngr.instance.playMusic('sound/beijyingyue');
    },

    showTableUI: function (show) {
        cc.log("...showTableUI:"+show);
        for (var i = 0; i < this.tableUI.length; i++) {
            var node = this.tableUI[i];
            node.active = show;
        }
    },

    showResultLayer: function () {
        var self = this;
        this.scheduleOnce(function () {
            self.showResultDirectly();
        }, 2);
    },
    showResultDirectly: function () {

        this.resultLayer.active = true;
        this.uiWaitLayer.active = false;
        this.showTableUI(false);

        var uiResultNode = this.resultLayer.getChildByName('uiResult');
        if(uiResultNode){
            var template = uiResultNode.getComponent('uiRoomResult');
            template.onShow();
        }
    },

    showSettingLayer: function (evt) {
        sendEvent("runlamp");
        openView('SettingsPanel');
    },
    showSummaryLayer: function () {
        var roomData = RoomHandler.getRoomData();
        if(roomData == undefined){
            return;
        }
        this.summaryLayer.active = true;
        sendEvent('onShowSummary');

        if (GameData.player.uid == roomData.creator) {
            cc.sys.localStorage.setItem("creatorIsCheckIp", false);
        } else {
            cc.sys.localStorage.setItem("isCheckIp", false);
        }
    },
    showScoreLayer: function () {
        var uiScore = this.scoreLayer.getChildByName('uiScore');
        if(uiScore){
            uiScore.active = true;

            var template = uiScore.getComponent('uiRoomScore');
            template.ShowPlayerScoreItem();
        }
    },
    showDebugLayer: function () {
        var uiDebug = this.debugLayer.getChildByName('uiDebug');
        if(uiDebug){
            uiDebug.active = true;
        }
    },

    showChat: function () {
        if (inCD(3000)) return;
        openView('ChatPanel');
    },
    showJoinerLost: function (data) {
        var uid = data.detail.uid;
        var nameStr = GameData.getPlayerByUid(uid).name;
        createMoveMessage('玩家[' + nameStr + ']掉线了。');
    },
    showJoinerConnect: function (data) {
        var uid = data.detail.uid;
        var nameStr = GameData.getPlayerByUid(uid).name;
        createMoveMessage('玩家[' + nameStr + ']已上线。');
    },
    mapCondition: function () {
        var uiMap = this.mapLayer.getChildByName('uiMap');
        if(uiMap){
            var template = uiMap.getComponent('AMapPanel');
            template.showPlayers();
        }

        var iconUrl;
        if (GameData.danger) {
            iconUrl = 'resources/table/map/weixian.png';
        } else {
            iconUrl = 'resources/table/map/anquan.png';
        }
        if (iconUrl != '') {
            console.log('iconUrl = ' + iconUrl);
            var texture = cc.textureCache.addImage(cc.url.raw(iconUrl));
            this.mapBtnNode.getComponent(cc.Sprite).spriteFrame = null;
            this.mapBtnNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            this.mapBtnNode.active = true;
        }
    },
    showMap: function (eve) {
        var uiMap = this.mapLayer.getChildByName('uiMap');
        if(uiMap){
            uiMap.active = true;

            var template = uiMap.getComponent('AMapPanel');
            template.showPlayers();
        }
    },
    setMapBtnShow: function(){
        var roomData = RoomHandler.getRoomData();
        if(roomData == undefined){
            return;
        }
        if(roomData.opts.joinermax == 2) {
            this.mapBtnNode.active = false;
        } else {
            this.mapBtnNode.active = true;
        }
    },
    onCreatorQuit: function () {
        var roomData = RoomHandler.getRoomData();
        if(roomData == undefined){
            return;
        }
        GameData.player.roomid = undefined;

        if (roomData.creator != GameData.player.uid) {
            createMessageBox('房主已经解散房间', function () {
                cc.director.loadScene('home');
            });
        } else {
            cc.director.loadScene('home');
        }
    },

    setUIBaseInfo: function () {
        var roomData = RoomHandler.getRoomData();
        var isCreator = roomData.creator == GameData.player.uid;
        this.deleteRoomBtn.active = isCreator;
        //this.quitRoomBtn.active = !isCreator;
    },
    backBtnClicked: function () {
        var roomData = RoomHandler.getRoomData();
        if (roomData.creator == GameData.player.uid) {
            cc.director.loadScene('home');
        } else {
            RoomHandler.quitRoom(roomData.id);
        }
    },
    wxInviteBtnClicked: function () {
        var roomData = RoomHandler.getRoomData();
        if(roomData == undefined){
            return;
        }
        var gameName = getGameTypeNameString(roomData.opts.gameType);
        var title = gameName + "房间号:" + roomData.id;
        if (roomData.opts.costType == 4) {
            title = gameName + "(代开)" + "房间号:" + roomData.id;
        }
        var des = this.getInviteStr();
        wxShareText(title, des);
    },
    getInviteStr: function () {
        var roomData = RoomHandler.getRoomData();
        if(roomData == undefined){
            return;
        }
        var str1 = "玩法:";
        var str2 = ",请您快速加入对局.";
        var playStr = getRuleStrHongZhong(roomData.opts);
        return str1 + playStr + str2;
    },
    onDeleteRoom: function () {
        createMessageBox('解散房间不扣房卡，是否确定解散？', function () {
            var roomData = RoomHandler.getRoomData();
            RoomHandler.deleteRoom(roomData.id, 'close');
        }, function () {});
    },
    onQuitRoom: function () {
        var roomData = RoomHandler.getRoomData();
        if (roomData.creator == GameData.player.uid) {
            cc.director.loadScene('home');
        } else {
            RoomHandler.quitRoom(roomData.id);
        }
    },
    //复制房间号
    onCopyRoomInfo: function () {
        var roomData = RoomHandler.getRoomData();
        if(roomData == undefined){
            return;
        }
        var gameName = getGameTypeNameString(roomData.opts.gameType);
        var title = gameName + "房间号:" + roomData.id + ",";
        var des = this.getInviteStr();
        wxShareCommond(title + des);
    }
});