var soundMngr = require('SoundMngr');
var RoomHandler = require('roomHandler');
var matchHandler = require('matchHandler');
var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
var competitionHandler = require('competitionHandler');
var missionHandler = require('missionHandler');


cc.Class({
    extends: cc.Component,

    properties: {
        //玩家信息
        head_node: cc.Node,
        head_name: cc.Label,
        head_identify_num: cc.Label,

        //玩家财富
        head_gold_num: cc.Label,
        roomcard_num: cc.Label,

        //当前显示选择游戏类型
        curSelectUI: cc.Node,

        //底部左侧
        shopBtn:cc.Node,
        taskBtn:cc.Node,
        agentBtn: cc.Node,
        recordBtn:cc.Node,
        serviceBtn:cc.Node,
        settingBtn:cc.Node,
        explainBtn:cc.Node,
        moreBtn: cc.Node,
        moreBase: cc.Node,

        //底部右侧
        groupToggle: cc.Toggle,
        matchToggle: cc.Toggle,
        competitionToggle: cc.Toggle,

        //跑马灯
        paoMadengLabel: cc.Label,
        _paoMadengX: 0,

        //预制
        playerTemplate: cc.Prefab,
        UIGroup: cc.Prefab,
        UIMatch: cc.Prefab,
        UICompetition: cc.Prefab
    },

    onLoad: function () {
        //注册监听
        require('util').registEvent('onGameStart', this, this.showTableLayer);
        require('util').registEvent('ddz-onGameStart', this, this.showDDZTableLayer);
        require('util').registEvent('tjddz-onGameStart', this, this.showTJDDZTableLayer);
        require('util').registEvent('pdk-onGameStart', this, this.showPDKTableLayer);
        require('util').registEvent('openScore', this, this.showTableLayer);
        require('util').registEvent('onPlayerUpdate', this, this.roomcardRefresh);
        require('util').registEvent('refreshActivityRedPoint', this, this.refreshActivityRedPoint);
        require('util').registEvent('onServerNotice', this, handlerServerNotice);
        require('util').registEvent('onMatchData', this, this.onMatchHandler);
        require('util').registEvent('OnPasteboardChanged', this, this.OnPasteboardChanged);
        require('util').registEvent('playerMissionData', this, this.onPlayerMissionHandler);

        cc.game.addPersistRootNode(cc.find('lampNode'));

        /////添加预制
        //当前第一显示选择游戏类型
        this.curSelectType = gameDefine.CurSelectType.group;
        var typeData = cc.sys.localStorage.getItem('homeCurSelectType');
        if (typeData) {
            this.curSelectType = JSON.parse(typeData).type;
        }
        this.refreshCurrentOpenPrefab(this.curSelectType);

        this.runPaoMadeng();

        //玩家基本信息相关
        this.refreshPlayerInfo();
        //公告
        this.refreshNoticeShow();
        //海报
        this.openPosterView();
        //匹配
        this.onMatchHandler();

        if (ReplayDataCenter.openRoundPanel) {
            openView('RecordPanel');
        }
        if (ReplayDataCenter.openReplayPanel) {
            openView('RoundPanel');
        }
        //匹配口令
        this.OnPasteboardChanged();
    },

    onEnable: function () {
        soundMngr.instance.playMusic('sound/wait');

        this.refreshAgentRoomBtn();
        //检测活动更新红点 临时添加 后期需要服务器添加活动相关字段
        if(!GameData.player.agentFlag) {
            sendEvent('refreshActivityRedPoint');
        }
        //检查任务按钮是否显示
        this.onPlayerMissionHandler();
    },
    onDestroy: function () {
        unrequire('util').registEvent('onGameStart', this, this.showTableLayer);
        unrequire('util').registEvent('ddz-onGameStart', this, this.showDDZTableLayer);
        unrequire('util').registEvent('tjddz-onGameStart', this, this.showTJDDZTableLayer);
        unrequire('util').registEvent('pdk-onGameStart', this, this.showPDKTableLayer);
        unrequire('util').registEvent('openScore', this, this.showTableLayer);
        unrequire('util').registEvent('onPlayerUpdate', this, this.roomcardRefresh);
        unrequire('util').registEvent('refreshActivityRedPoint', this, this.refreshActivityRedPoint);
        unrequire('util').registEvent('onServerNotice', this, handlerServerNotice);
        unrequire('util').registEvent('onMatchData', this, this.onMatchHandler);
        unrequire('util').registEvent('OnPasteboardChanged', this, this.OnPasteboardChanged);
        unrequire('util').registEvent('playerMissionData', this, this.onPlayerMissionHandler);
    },

    showTableLayer: function () {
        cc.director.loadScene('table');
    },
    showDDZTableLayer: function () {
        //cc.director.loadScene('table-DDZ');
    },
    showTJDDZTableLayer: function () {
        cc.director.loadScene('table-TJDDZ');
    },
    showPDKTableLayer: function () {
        cc.director.loadScene('table-PDK');
    },
    refreshPlayerInfo: function(){
        if (isChinese(GameData.player.name)) {
            this.head_name.string = getShortStr(GameData.player.name, 5);
        } else {
            this.head_name.string = getShortStr(GameData.player.name, 10);
        }
        var headNode = cc.instantiate(this.playerTemplate);
        headNode.getComponent('playerTemplate').setPlayer(GameData.player);
        headNode.getComponent('playerTemplate').setName('');
        headNode.getComponent('playerTemplate').showZhuang(false);
        headNode.getComponent('playerTemplate').setHeadIcon(GameData.player.headimgurl);
        this.head_node.addChild(headNode);

        //UI数据
        this.head_identify_num.string = GameData.player.uid;
        this.roomcardRefresh();
    },
    roomcardRefresh: function () {
        //房卡
        this.roomcard_num.string = GameData.player.card;
        if (GameData.player.coin != null ||GameData.player.coin != undefined) {
            this.head_gold_num.string = ConversionCoinValue(GameData.player.coin, 0);
        }
    },
    refreshNoticeShow: function(){
        if (GameData.serverNoticeData && GameData.serverNoticeData.length > 0) {

            var nowTime = new Date().valueOf();
            var lastTime = GameData.serverNoticeData[0].lastTime;

            if(false == ComparingDate(nowTime, lastTime)){
                if (!GameData.isRoomRunlampt) {
                    openView("RunlampPanel");
                }
                this.schedule(lampHandler, 1);
                GameData.isRoomRunlampt = true;
            }
        }
        if (GameData.serverNoticeData) {
            if (GameData.serverNoticeData.length > 1) {

                var nowTime = new Date().valueOf();
                var lastTime = GameData.serverNoticeData[0].lastTime;

                if(false == ComparingDate(nowTime, lastTime)){
                    if (!GameData.isRoomRunlampt) {
                        var seq = cc.sequence(cc.delayTime(15), cc.callFunc(function () {
                            openView("RunlampPanel1");
                        }));
                        this.node.runAction(seq);
                    }
                    this.schedule(lampHandler1, 1);
                    GameData.isRoomRunlampt1 = true;
                }
            }
        }
    },
    fangkaAddCBack: function (evt) {
        soundMngr.instance.playAudioOther('button');
        openView('kefuweixin');
    },
    goldAddClick: function(evt){
        soundMngr.instance.playAudioOther('button');
        var fun = function(panel){
            if(panel){
                var template = panel.getComponent('shoppingPanel');
                if(template){
                    template.showPanel(2);
                }
            }
        };
        openView("shoppingPanel", undefined, fun);
    },
    loadSpriteImg: function(sprite, imgUrl){
        if (sprite == undefined || imgUrl == undefined || imgUrl.length <= 0) {
            return;
        }
        var texture = cc.textureCache.addImage(cc.url.raw(imgUrl));
        if(texture){
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        }
    },

    refreshActivityRedPoint: function () {
    },

    runPaoMadeng: function () {
        this._paoMadengX = this.paoMadengLabel.node.x;
        GameData.configData.paomadengIndex = 0;
        this.gotoPaoMadeng();
        this.schedule(this.gotoPaoMadeng, 10);
    },

    gotoPaoMadeng: function () {
        if (!GameData.configData.paomadeng) return;
        var paoMaStr = GameData.configData.paomadeng[GameData.configData.paomadengIndex].content;
        paoMaStr = paoMaStr.replace(/[\n]/ig, '');
        this.paoMadengLabel.string = paoMaStr;
        this.paoMadengLabel.node.x = this._paoMadengX;
        var moveToAction = cc.moveTo(10, cc.p(this._paoMadengX - 570 - this.paoMadengLabel.node.width, this.paoMadengLabel.node.y));
        this.paoMadengLabel.node.runAction(moveToAction);
        GameData.configData.paomadengIndex++;
        if (GameData.configData.paomadengIndex == GameData.configData.paomadeng.length) {
            GameData.configData.paomadengIndex = 0;
        }
    },

    refreshAgentRoomBtn : function(){
        //代开房按钮显示
        /*if(GameData.player.club == undefined
            || Object.keys(GameData.player.club).length <= 0
            || GameData.player.club.clubAdmin != 2){
            this.agentBtn.active = false;
        }else{
            this.agentBtn.active = true;
        }*/
    },
    setMoreBaseShow: function(show){
        this.moreBase.active = show;
    },

    showUIClub: function () {
        soundMngr.instance.playAudioOther('button');
        if (GameData.player.club && Object.keys(GameData.player.club).length > 0) {
            openView("PanelClub");
        } else {
            createMessageBox('您还没有俱乐部，请联系您的代理或推广员', function () {});
        }
    },
    openRecordPanel: function (evt) {
        soundMngr.instance.playAudioOther('button');
        this.setMoreBaseShow(false);
        openView('RecordPanel');
    },
    openSettingsPanel: function (evt) {
        soundMngr.instance.playAudioOther('button');
        this.setMoreBaseShow(false);
        openView('SettingsPanel');
    },
    shareBtnClick: function () {
        soundMngr.instance.playAudioOther('button');
        this.setMoreBaseShow(false);
        openView('SharePanel');
    },
    selectClubClick: function () {
        soundMngr.instance.playAudioOther('button');
        this.setMoreBaseShow(false);
        openView("selectclubPanel");
    },
    openShoppingPanel: function () {
        soundMngr.instance.playAudioOther('button');
        this.setMoreBaseShow(false);
        openView("shoppingPanel");
    },
    openTaskClick: function(){
        soundMngr.instance.playAudioOther('button');
        this.setMoreBaseShow(false);
        openView('UITask');
    },
    openRankClick: function(){
        soundMngr.instance.playAudioOther('button');
        this.setMoreBaseShow(false);
        openView('UICoinRankingList');
    },
    openPushGameClick: function(){
        this.setMoreBaseShow(false);
        if (inCD(3000)) {
            return;
        }
        soundMngr.instance.playAudioOther('button');
        //判断玩家身份
        switch (GameData.player.agentRole){
            case gameDefine.agentRole.agentPower:{
                createMoveMessage('您已经是总代理，请前往公众号查看。');
                return;
            }break;
            case gameDefine.agentRole.agent:{
                createMoveMessage('您已经是代理，请前往公众号查看。');
                return;
            }break;
            case gameDefine.agentRole.push:{
                createMoveMessage('您已经是推广员，请前往公众号查看。');
                return;
            }break;
            case gameDefine.agentRole.ordinary:{
                //判断有效期
                var date = parseInt(new Date().valueOf()/1000);
                var time = GameData.player.qrcodeTime;
                time == undefined ? time = 0 : null;

                if(time > 0 && (time - date) > 0){
                    openView('UIPushGame');
                } else {
                    GameNet.getInstance().request("game.playerHandler.reqPlayerQrcode", null, function (rtn) {
                        if(rtn.qrcodeUrl){
                            GameData.player.qrcodeUrl = rtn.qrcodeUrl;
                            GameData.player.qrcodeTime = rtn.qrcodeTime;
                            openView('UIPushGame');
                        } else {
                            createMoveMessage('请求数据失败。');
                        }
                    });
                }
            }break;
            default: {
                createMoveMessage('请求数据失败。');
            }break;
        }
    },
    agentRoomClick: function () {
        this.setMoreBaseShow(false);
        soundMngr.instance.playAudioOther('button');
        if(GameData.player.club == undefined
            || Object.keys(GameData.player.club).length <= 0
            || GameData.player.club.clubAdmin != 2){
            createMoveMessage('您还不是代理，无法代开房！');
            return;
        }

        RoomHandler.reqAgentRoom();
        RoomHandler.reqAgentResultRoom();

        openView("agentPanel");
    },
    showNotice: function () {
        soundMngr.instance.playAudioOther('button');
        openView("NoticePanel");
    },
    showCreateRoomDDZ: function () {
        soundMngr.instance.playAudioOther('button');
        openView('DDZ-CreateHome');
    },
    openPosterView: function (event) {
        var curDate = new Date();
        if(event && event.target){
            soundMngr.instance.playAudioOther('button');
        } else {
            var data = cc.sys.localStorage.getItem('posterTime');
            if (data != null) {
                var oldDate = new Date(parseInt(JSON.parse(data).time));
                if(ComparingDateInSameDay(oldDate, curDate)){
                    return;
                }
            }
        }
        if(configMgr.getPoster() == undefined
            || configMgr.getPoster().length <= 0) {
            return;
        }
        openView('PosterPanel');
        //记录打开时间
        cc.sys.localStorage.setItem('posterTime', JSON.stringify({time: curDate.valueOf()}));
    },
    onMatchHandler: function(){
        var IsMach = matchHandler.onMatch;
        if(IsMach){
            //无法设置界面显示层级，所以先打开选择界面
            //openView('SelectGamePanel');
            openView('UIMatch');
        }
    },
    moreBtnClick: function(){
        soundMngr.instance.playAudioOther('button');
        var show = this.moreBase.active;
        this.setMoreBaseShow(!show);

        if(!show){
            var scale1 = cc.scaleTo(0.08, 1.1);
            var scale2 = cc.scaleTo(0.05, 1.0);

            this.moreBase.stopAllActions();
            this.moreBase.runAction(cc.sequence(scale1, scale2));
        }
    },
    groupBtnClick: function(){
        this.refreshToggleBtnChecked();
        if (inCD(500)) {
            return;
        }
        soundMngr.instance.playAudioOther('button');
        cc.log('..groupBtnClick');
        if(this.curSelectType == gameDefine.CurSelectType.group){
            return;
        }
        this.refreshCurrentOpenPrefab(gameDefine.CurSelectType.group);
    },
    matchBtnClick: function(){
        this.refreshToggleBtnChecked();
        if (inCD(500)) {
            return;
        }
        soundMngr.instance.playAudioOther('button');
        cc.log('..matchBtnClick');
        var gameList = configMgr.getMatchGameType();
        if(gameList == undefined || gameList.length <= 0){
            createMoveMessage('暂未开启。');
            return;
        }
        if(this.curSelectType == gameDefine.CurSelectType.match){
            return;
        }
        this.refreshCurrentOpenPrefab(gameDefine.CurSelectType.match);
    },
    competitionBtnClick: function(){
        this.refreshToggleBtnChecked();
        if (inCD(500)) {
            return;
        }
        soundMngr.instance.playAudioOther('button');
        cc.log('..competitionBtnClick');
        var gameList = configMgr.getFightGameType();
        if(gameList == undefined || gameList.length <= 0){
            createMoveMessage('暂未开启。');
            return;
        }
        if(this.curSelectType == gameDefine.CurSelectType.competition){
            return;
        }
        this.refreshCurrentOpenPrefab(gameDefine.CurSelectType.competition);
    },
    refreshCurrentOpenPrefab: function(type){

        var template = undefined;
        switch (type){
            case gameDefine.CurSelectType.group:{
                template = cc.instantiate(this.UIGroup);
            }break;
            case gameDefine.CurSelectType.match:{
                template = cc.instantiate(this.UIMatch);
            }break;
            case gameDefine.CurSelectType.competition:{
                competitionHandler.getActivityList();
                template = cc.instantiate(this.UICompetition);
            }break;
        }
        cc.log('..type:'+type);
        if(template == undefined){
            return;
        }

        // for(var ii = 0;ii < this.curSelectUI.getChildrenCount();ii++){
        //     var child = this.curSelectUI.getChildren()[ii];
        //     if(child){
        //         child.active = false;
        //     }
        // }
        var name = 'template_'+type;
        var node = this.curSelectUI.getChildByName(name);
        if(node == undefined){
            node = template;
            node.parent = this.curSelectUI;
            node.name = name;
        }
        node.active = true;

        ///////////////转变动作
        var size = cc.director.getWinSize();

        if(this.curSelectType && type != this.curSelectType){
            //将现在的添加动作移动出去
            var oldNode = this.curSelectUI.getChildByName('template_'+ this.curSelectType);
            if(oldNode){
                var move1 = cc.moveTo(0.3, cc.p(-size.width, 0));

                oldNode.stopAllActions();
                oldNode.runAction(cc.sequence(move1.easing(cc.easeIn(5.0)), cc.callFunc(function(){
                    oldNode.active = false;
                })));

                //将要显示的添加动作移动进来
                node.x = size.width;

                var delay = cc.delayTime(0.05);
                var move2 = cc.moveTo(0.3, cc.p(-20, 0));
                var move3 = cc.moveTo(0.08, cc.p(0, 0));

                node.stopAllActions();
                node.runAction(cc.sequence(delay, move2.easing(cc.easeIn(6.0)), move3));
            }
        }
        this.curSelectType = type;
        this.refreshToggleBtnChecked();
        this.saveHomeCurSelectType();
    },
    refreshToggleBtnChecked: function(){
        switch (this.curSelectType){
            case gameDefine.CurSelectType.group:{
                this.groupToggle.isChecked = true;

                this.matchToggle.isChecked = false;
                this.competitionToggle.isChecked = false;
            }break;
            case gameDefine.CurSelectType.match:{
                this.matchToggle.isChecked = true;

                this.groupToggle.isChecked = false;
                this.competitionToggle.isChecked = false;
            }break;
            case gameDefine.CurSelectType.competition:{
                this.competitionToggle.isChecked = true;

                this.groupToggle.isChecked = false;
                this.matchToggle.isChecked = false;
            }break;
        }
    },
    saveHomeCurSelectType: function(){
        if(this.curSelectType == undefined){
            return;
        }
        var data = {type: this.curSelectType};
        cc.sys.localStorage.setItem('homeCurSelectType', JSON.stringify(data));
    },
    OnPasteboardChanged: function(data){
        WriteLog('home.js OnPasteboardChanged');
        this.getRoomIdByPasteboard();
    },
    getRoomIdByPasteboard:function(){
        WriteLog('home.js getRoomIdByPasteboard');
        var temp = getTextClipboard();
        if (!temp) return;
        var mark1 = "房间号:";
        var index = temp.indexOf(mark1);
        if (index == -1) return;
        var mark2 = "【复制】这条信息后,打开游戏进入牌局。";
        if (temp.indexOf(mark2) == -1) return;
        var length = mark1.length;
        var roomid = temp.substring(index+length, index+length+6);
        if (roomid < 100000 || roomid > 999999) return;
        var selfAgentRoomId = cc.sys.localStorage.getItem('selfAgentRoomId');
        if (selfAgentRoomId == roomid) return;
        RoomHandler.enterRoom(roomid);
    },
    onPlayerMissionHandler: function(){
        var show = !missionHandler.checkAllComplete(GameData.player.mission);
        this.taskBtn.active = show;
    }
});