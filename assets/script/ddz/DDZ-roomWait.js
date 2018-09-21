var soundMngr = require('SoundMngr');
var RoomHandler = require('roomHandler');
var configMgr = require('configMgr');
var gameDefine = require('gameDefine');

cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel: cc.Label,
        roomZh: cc.Label,
        roomNum: cc.Label,
        play_down_player: cc.Node,
        play_left_player: cc.Node,
        play_right_player: cc.Node,
        readyNode: cc.Node,
        lostNode: cc.Node,
        deleteRoomBtn: cc.Node,
        quitRoomBtn: cc.Node,
        wifiNode: cc.Node,
        playintrNode: cc.Node,
        dianchiNode: cc.Node,
        btnRule: cc.Button,
        lostInfo: [],
        readyBtn: cc.Node,
        detain: {
            default: null,
            type: cc.Label
        },

        maskNode: cc.Node,
        QiangDiZhuNode: cc.Node,
        jiaofenNode: cc.Node,

        playerTemplate: cc.Prefab,
        dragonBonesNode: cc.Prefab
    },

    onLoad: function () {
        this.playIntrSize = 'small';
        this.playerSex = 1;
        this.headers = new Array();
        this.RuleBtnBool = false;
        this.isReconnect = false;
        this.showPlayers();

        require('util').registEvent('onRoomInfo', this, this.showPlayers);
        require('util').registEvent('ddz-onReady', this, this.onReady);
        require('util').registEvent('initCards', this, this.showPlayers);
        require('util').registEvent('onCreatorQuit', this, this.onCreatorQuit);
        require('util').registEvent('ddz-onDiZhu', this, this.onDiZhuHandler);
        require('util').registEvent('initTableNode', this, this.showPlayers);
        require('util').registEvent('onPrepareInfo', this, this.onPrepareInfo);
        require('util').registEvent('onJoinerLost', this, this.showJoinerLost);
        require('util').registEvent('onJoinerConnect', this, this.showJoinerConnect);
        require('util').registEvent('onRoomChat', this, this.onRoomChatHandler);
        require('util').registEvent('nativePower', this, this.onNativePowerHandler);
        require('util').registEvent('ddz-onGameAllScore', this, this.onGameAllScoreHandler);
        require('util').registEvent('ddz-onGameStart', this, this.onGameStartHandler);
        require('util').registEvent('onRoomReadyInfo', this, this.onRoomReadyInfoHandler);
        require('util').registEvent('yunwaUploaded', this, this.onYunwaUploaded);
        require('util').registEvent('HideReadyNode', this, this.HideReadyNode);
        require('util').registEvent('AnimationDelayTime', this, this.onGameScoreHandler);
        require('util').registEvent('ddz-showKicking', this, this.showKicking);
        require('util').registEvent('ddz-deputeInfo', this, this.showDeputeInfo);
        require('util').registEvent('dynChat', this, this.dynChatHandler);

        DDZHandler.getInstance().requestReady();
        this.handTimeLabel();
        this.updateTime();
        this.updataWifi();
        this.electricQuantity();
        //添加互动动画
        this.addDynAnimation();

        if(gameDefine.currencyType.Currency_Coin == GameData.room.opts.currencyType)
        {
            this.hideAllReadyStatus();
        }
    },

    onEnable: function () {
        this.readyNode.active = !GameDataDDZ.game.gameStart;
        if (GameData.game.onRoomReadyInfo.data) {
            sendEvent('onRoomReadyInfo', GameData.game.onRoomReadyInfo.data);
        }
    },

    onDestroy: function () {
        unrequire('util').registEvent('onRoomInfo', this, this.showPlayers);
        unrequire('util').registEvent('ddz-onReady', this, this.onReady);
        unrequire('util').registEvent('initCards', this, this.showPlayers);
        unrequire('util').registEvent('onCreatorQuit', this, this.onCreatorQuit);
        unrequire('util').registEvent('ddz-onDiZhu', this, this.onDiZhuHandler);
        unrequire('util').registEvent('initTableNode', this, this.showPlayers);
        unrequire('util').registEvent('onPrepareInfo', this, this.onPrepareInfo);
        unrequire('util').registEvent('onJoinerLost', this, this.showJoinerLost);
        unrequire('util').registEvent('onJoinerConnect', this, this.showJoinerConnect);
        unrequire('util').registEvent('onRoomChat', this, this.onRoomChatHandler);
        unrequire('util').registEvent('nativePower', this, this.onNativePowerHandler);
        unrequire('util').registEvent('ddz-onGameAllScore', this, this.onGameAllScoreHandler);
        unrequire('util').registEvent('ddz-onGameStart', this, this.onGameStartHandler);
        unrequire('util').registEvent('onRoomReadyInfo', this, this.onRoomReadyInfoHandler);
        unrequire('util').registEvent('ddz-onGameScore', this, this.onGameScoreHandler);
        unrequire('util').registEvent('yunwaUploaded', this, this.onYunwaUploaded);
        unrequire('util').registEvent('HideReadyNode', this, this.HideReadyNode);
        unrequire('util').registEvent('AnimationDelayTime', this, this.onGameScoreHandler);
        unrequire('util').registEvent('ddz-showKicking', this, this.showKicking);
        unrequire('util').registEvent('ddz-deputeInfo', this, this.showDeputeInfo);
        unrequire('util').registEvent('dynChat', this, this.dynChatHandler);
    },
    onReady: function() {
        GameDataDDZ.clearObject(GameDataDDZ.kicking);
        sendEvent('initTableNode');
        DDZHandler.getInstance().requestReady();
    },

    onDiZhuHandler: function(){
        this.playQiangDiZhuAnimation();
    },

    onGameScoreHandler: function (data) {
        var AnimationDelayTime = data.detail;
        var self = this;
        this.scheduleOnce(function () {
            self.readyNode.active = true;
        }, AnimationDelayTime);
    },
    HideReadyNode: function () {
        this.readyNode.active = false;
    },
    onGameAllScoreHandler: function (data) {
        for (var i = 0; i < this.headers.length; i++) {
            var headerNode = this.headers[i];
            var playerTemplate = headerNode.getComponent('DDZ-playerTemplate');
            var uid = playerTemplate.uid;

            //如果是金币场，显示玩家身上的金币数量
            if(gameDefine.currencyType.Currency_Coin == GameData.room.opts.currencyType){
                if (GameData.players[uid]) {
                    playerTemplate.setGold(GameData.players[uid].coin);
                }
            } else {
                var score = GameDataDDZ.allScores[uid] == undefined ? 0 : GameDataDDZ.allScores[uid];
                playerTemplate.setCoin(score, 1);
            }
        }

        if (GameDataDDZ.roomsummaryData.gameFlag != undefined)
        {
            sendEvent('initTableNode');
        }

        this.showDetainScore();
        this.hideLostNode();
    },
    onYunwaUploaded: function (data) {
        var soundurl = data.detail;
        ChatHandler.getInstance().sendRecord(soundurl);
    },
    onRoomChatHandler: function (data) {
        var uid = data.detail.uid;
        var type = data.detail.msg.type;
        this.playerSex = GameData.getPlayerSexByUid(data.detail.uid);

        for (var i = 0; i < this.headers.length; i++) {
            var headerNode = this.headers[i];
            if (headerNode.getComponent('DDZ-playerTemplate').uid == uid) {
                var direction = GameData.tablePos[uid];
                var chatNode = cc.find('chat_' + direction, headerNode);
                if (chatNode != null) {
                    var wordNode = cc.find('word', chatNode);
                    var emoNode = cc.find('emo', chatNode);
                    var yuyinNode = cc.find('yuyinNode', chatNode);
                    if (type == 'word') {
                        var content = data.detail.msg.data;

                        var chatBg = cc.find('word/bg', chatNode);
                        var chatLabel = cc.find('word/Label', chatNode).getComponent(cc.Label);
                        var contentStr = content;
                        chatBg.width = 20 + contentStr.length * 24;
                        wordNode.getComponent('HideComponent').show(3);
                        chatLabel.string = contentStr;
                    } else if (type == 'fast') {
                        var soundKey = data.detail.msg.data.sound;
                        var content = data.detail.msg.data.content;
                        var chatBg = cc.find('word/bg', chatNode);
                        var chatLabel = cc.find('word/Label', chatNode).getComponent(cc.Label);
                        var contentStr = getShortStr(content, 10);
                        chatBg.width = contentStr.length * 30;
                        wordNode.getComponent('HideComponent').show(3);
                        chatLabel.string = contentStr;
                        soundMngr.instance.playAudioPokerChat(soundKey, this.playerSex);

                    } else if (type == 'emo') {
                        var animationName = data.detail.msg.data;
                        emoNode.getComponent(cc.Animation).play(animationName);
                        emoNode.getComponent('HideComponent').show(3);
                    } else if (type == 'yuyin') {
                        if (!GameData.isPlayVioce) {
                            return;
                        }
                        var soundurl = data.detail.msg.data;
                        if (cc.sys.OS_ANDROID == cc.sys.os) {
                            jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "playRecord", "(Ljava/lang/String;)V", soundurl);
                        } else if (cc.sys.OS_IOS == cc.sys.os) {
                            jsb.reflection.callStaticMethod("AppController", "playRecord:", String(soundurl));
                        }
                        var yuyinAnim = cc.find('yuyinAnimNode/yuyinAnim', yuyinNode);
                        yuyinAnim.getComponent(cc.Animation).play("yuyinduihua");
                        yuyinNode.getComponent('HideComponent').show(3);

                    }
                }
            }
        }
    },

    getHeadPositionOnUid: function(uid){
        for (var i = 0; i < this.headers.length; i++) {
            var headerNode = this.headers[i];
            if(headerNode == undefined){
                continue;
            }
            var template = headerNode.getComponent('DDZ-playerTemplate');
            if(template == undefined){
                continue;
            }
            if(template.uid != uid){
                continue;
            }
            return headerNode.parent.position;
        }
        return cc.p(0, 0);
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
    },

    showDetain: function() {
        if (GameData.room.opts.detain > 0) {
            this.detain.node.active = true;
            this.detain.string = '押底 : ' + 0; 
        } else if (GameData.room.opts.detain == 0) {
            this.detain.node.active = false;
        }
    },

    showDetainScore: function() {
        if (GameDataDDZ.roomsummaryData.detain != undefined) {
            this.detain.string = '押底 : ' + GameDataDDZ.roomsummaryData.detain;
        } else {
            this.showDetain();
        }
    },

    showReadyIcon: function (direction, showHand, showReading) {
        cc.find('ready_hand_' + direction, this.readyNode).active = showHand;
        cc.find('readying_' + direction, this.readyNode).active = showReading;
    },

    hideLostNode: function() {
        for (var key in this.lostNode.children) {
            this.lostNode.children[key].active = false;
        }
    },

    hideAllReadyStatus: function() {
        cc.find('ready_hand_' + 'left', this.readyNode).active = false;
        cc.find('readying_' + 'left', this.readyNode).active = false;
        cc.find('ready_hand_' + 'right', this.readyNode).active = false;
        cc.find('readying_' + 'right', this.readyNode).active = false;
        cc.find('ready_hand_' + 'down', this.readyNode).active = false;
        cc.find('readying_' + 'down', this.readyNode).active = false;
    },

    onPrepareInfo: function(data) {
        this.hideAllReadyStatus();
        this.readyNode.active = true;
        this.hideTiChuai();
        for (var key in GameDataDDZ.game.onRoomReadyInfo)
        {
            if (GameDataDDZ.game.onRoomReadyInfo[key] == true)
            {
                var tablePos = GameDataDDZ.getPosByUid(key);
                this.showReadyIcon(tablePos, true, false);
            }
        }
        this.onRoomReadyInfoHandler(data);
    },

    showPlayers: function () {
        this.headers = [];

        this.showPlayer('down', this.play_down_player);
        this.showPlayer('right', this.play_right_player);
        this.showPlayer('left', this.play_left_player);

        this.showPlayIntroduce(this.playIntrSize);
        this.setRoomNum();

        var isCreator = GameData.room.creator == GameData.player.uid;
        this.deleteRoomBtn.active = isCreator;
        if (!isCreator) {
            this.quitRoomBtn.x = 6;
        } else {
            this.quitRoomBtn.x = 107;
        }
        this.node.getComponent('DDZ-roomtable').showRoomRule();
        this.connectRecurrence();
    },
    ruleClick: function () {
        if (this.playintrNode.active == true) {
            return;
        }
        this.playintrNode.active = true;
        this.playintrNode.runAction(cc.sequence(
            cc.moveTo(0.5, cc.p(30, 334)),
            cc.delayTime(10),
            cc.moveTo(0.5, cc.p(30, 434)),
            cc.callFunc(this.isRuleBtn, this)
        ));

    },
    isRuleBtn: function () {
        this.playintrNode.active = false;
    },
    onShowPlayIntrClick: function () {
        this.playIntrSize = this.playIntrSize == 'small' ? 'big' : 'small';
        this.showPlayIntroduce(this.playIntrSize);
        cc.find('openBtn', this.playintrNode).rotation = this.playIntrSize == 'small' ? 0 : 180;
    },

    showPlayIntroduce: function (size) {
    },

    showPlayer: function (direction, parent) {
        var playerNode = parent.getChildByName('uiPlayerNode');
        if(playerNode == undefined){
            playerNode = cc.instantiate(this.playerTemplate);
            playerNode.name = 'uiPlayerNode';
            parent.addChild(playerNode);
        }

        var player = GameData.getPlayerByPos(direction);
        if (player != null) {
            parent.active = true;
            playerNode.active = true;

            playerNode.getComponent('DDZ-playerTemplate').setPlayer(player);
            playerNode.getComponent('DDZ-playerTemplate').setName(player.name);
            playerNode.getComponent('DDZ-playerTemplate').setHeadIcon(player.headimgurl);
            playerNode.getComponent('DDZ-playerTemplate').setNamePositionByDir(direction);
            playerNode.getComponent('DDZ-playerTemplate').setIsPlayerIcon(false);

            if (GameDataDDZ.game.dizhuUid != 0) {
                var isdizhu = (GameDataDDZ.game.dizhuUid == player.uid);
                if (isdizhu) {
                    playerNode.getComponent('DDZ-playerTemplate').showPlayerIdentity(true, 1);
                } else {
                    playerNode.getComponent('DDZ-playerTemplate').showPlayerIdentity(true, 2);
                }
            }

            //如果是金币场，显示玩家身上的金币数量
            if(gameDefine.currencyType.Currency_Coin == GameData.room.opts.currencyType){
                playerNode.getComponent('DDZ-playerTemplate').setGold(player.coin);
            } else {
                var score = 0;
                if (GameDataDDZ.roomsummaryData.score != undefined) {
                    score = GameDataDDZ.roomsummaryData.score[player.uid] == undefined ? 0 : GameDataDDZ.roomsummaryData.score[player.uid];
                }
                playerNode.getComponent('DDZ-playerTemplate').setCoin(score, 1);
            }
            this.headers.push(playerNode);

            //设置 tag 值
            playerNode.setTag(player.uid);

            if (player.status == 2) {
                this.showReadyIcon(direction, false, false);
            }
            var isOnLine = RoomHandler.isPlayerOnline(player.uid);
            var disHanderNode = cc.find('Disconnect', playerNode);
            var disNode = cc.find('lost_' + direction, this.lostNode);
            disNode.active = !isOnLine;
            disHanderNode.active = !isOnLine;
        } else {
            parent.active = false;
            this.showReadyIcon(direction, false, false);
        }
    },

    hideTiChuai: function() {
        for (var index = 0; index < this.headers.length; index++)
        {
            var tiChuaiNode = cc.find('tiChuaiNode', this.headers[index]);
            var tiIcon = cc.find('tiIcon', tiChuaiNode);
            var chuaiIcon = cc.find('chuaiIcon', tiChuaiNode);
            tiIcon.active = false;
            chuaiIcon.active = false;
        }
    },
    showPlayerTiChuai: function(parent, dizhuUid, uid) {
        var playerNode = parent.getChildByName('TablePlayerTemplate');
        var tiChuaiNode = cc.find('tiChuaiNode', playerNode);
        if (GameDataDDZ.kicking.kicking[uid] == 1 && uid != dizhuUid)
        {
            var tiIcon = cc.find('tiIcon', tiChuaiNode);
            tiIcon.active = true;
            if (parent == this.play_right_player)
            {
                tiIcon.x = -67;
            }
        }
        else if (GameDataDDZ.kicking.kicking[uid] == 1 && uid == dizhuUid)
        {
            var chuaiIcon = cc.find('chuaiIcon', tiChuaiNode);
            chuaiIcon.active = true;
            if (parent == this.play_right_player)
            {
                chuaiIcon.x = -67;
            }
        }
    },
    //TablePlayerTemplate
    showKicking: function() {
        if (GameDataDDZ.isEmptyObject(GameDataDDZ.kicking)) {
            return;
        }
        for (var key in GameDataDDZ.kicking.kicking)
        {
            var pos = GameDataDDZ.getPosByUid(key);
            if (pos == 'down')
            {
                this.showPlayerTiChuai(this.play_down_player, GameDataDDZ.kicking.dizhu, key);
            }
            else if (pos == 'right')
            {
                this.showPlayerTiChuai(this.play_right_player, GameDataDDZ.kicking.dizhu, key);
            }
            if (pos == 'left')
            {
                this.showPlayerTiChuai(this.play_left_player, GameDataDDZ.kicking.dizhu, key);
            }
        }
    },

    showDeputeInfo: function() {
        for (var key in GameDataDDZ.deputeInfo)
        {
            if (GameDataDDZ.deputeInfo[key] == 0)
            {
                this.showTrusteeship(key, false)
            }
            else if (GameDataDDZ.deputeInfo[key] == 1)
            {
                this.showTrusteeship(key, true);
            }
        }
    },

    showTrusteeship: function(uid, show) {
        for (var index = 0; index < this.headers.length; index++)
        {
            var headerNode = this.headers[index];
            if (headerNode.getComponent('DDZ-playerTemplate').uid == uid) {
                cc.find('trusteeship', headerNode).active = show;
                return;
            }
        }
    },

    connectRecurrence: function() {
        this.showKicking();
        this.showDetainScore();
    },

    onRoomReadyInfoHandler: function (data) {
        this.gotoShowReady('down', data.detail);
        this.gotoShowReady('left', data.detail);
        this.gotoShowReady('right', data.detail);
    },

    gotoShowReady: function (direction, readyInfo) {
        var player = GameData.getPlayerByPos(direction);
        if (player == null) return;
        var uid = player.uid;
        var ready = true;
        if (readyInfo[uid] == undefined || readyInfo[uid] == 0) {
            ready = false;
        }
        this.showReadyIcon(direction, ready, !ready);
        
        if (this.lostInfo == null || this.lostInfo == undefined) {
            return;
        } else {
            for (var i = 0; i < this.lostInfo.length; i++) {
                if (uid == this.lostInfo[i]) {
                    this.showReadyIcon(direction, false, false);
                    cc.find('lost_' + direction, this.lostNode).active = true;
                }
            }
        }
        if (player.status == 2) {
            this.showReadyIcon(direction, false, false);
            cc.find('lost_' + direction, this.lostNode).active = true;
        }
    },

    showJoinerLost: function (data) {
        this.lostInfo.push(data.detail.uid);
        this.showHeaderDisconnect(data.detail.uid, true);
        this.showDisconnectInfo(data.detail, true);
        var nameStr = GameData.getPlayerByUid(data.detail.uid).name;
        createMoveMessage('玩家[' + nameStr + ']掉线了');
        if (GameData.player.uid == data.detail.uid) {
            this.isReconnect = true;
        }
    },

    showJoinerConnect: function (data) {
        if (this.lostInfo == null || this.lostInfo == undefined) {
            return;
        } else {
            for (var i = 0; i < this.lostInfo.length; i++) {
                if (data.detail.uid == this.lostInfo[i]) {
                    this.lostInfo.splice(i, 1);
                }
            }
        }
        this.showDisconnectInfo(data.detail, false);
        this.showHeaderDisconnect(data.detail.uid, false);
    },

    showHeaderDisconnect: function (uid, show) {
        if (this.headers == null) {
            return;
        }
        for (var i = 0; i < this.headers.length; i++) {
            var headerNode = this.headers[i];
            if (headerNode.getComponent('DDZ-playerTemplate').uid == uid) {
                var disNode = cc.find('Disconnect', headerNode);
                disNode.active = show;
                return;
            }
        }
    },

    showDisconnectInfo: function (connectInfo, isDisconnect) {
        var index = GameData.getPlayerIndex(GameData.player.uid);

        if (GameData.room.opts.joinermax == 2) {
            if (index >= 0 && index < GameData.room.opts.joinermax) {
                this.showDisconnectUI('down', index, connectInfo, isDisconnect);
            }
            if (++index < GameData.room.opts.joinermax || (index = 0) >= 0) {
                this.showDisconnectUI('up', index, connectInfo, isDisconnect);
            }
        } else if (GameData.room.opts.joinermax == 3) {
            if (index >= 0 && index < GameData.room.opts.joinermax) {
                this.showDisconnectUI('down', index, connectInfo, isDisconnect);
            }
            if (++index < GameData.room.opts.joinermax || (index = 0) >= 0) {
                this.showDisconnectUI('right', index, connectInfo, isDisconnect);
            }
            if (++index < GameData.room.opts.joinermax || (index = 0) >= 0) {
                this.showDisconnectUI('left', index, connectInfo, isDisconnect);
            }
        } else {
            if (index >= 0 && index < GameData.room.opts.joinermax) {
                this.showDisconnectUI('down', index, connectInfo, isDisconnect);
            }
            if (++index < GameData.room.opts.joinermax || (index = 0) >= 0) {
                this.showDisconnectUI('right', index, connectInfo, isDisconnect);
            }
            if (++index < GameData.room.opts.joinermax || (index = 0) >= 0) {
                this.showDisconnectUI('up', index, connectInfo, isDisconnect);
            }
            if (++index < GameData.room.opts.joinermax || (index = 0) >= 0) {
                this.showDisconnectUI('left', index, connectInfo, isDisconnect);
            }
        }
    },
    showDisconnectUI: function (direction, index, connectInfo, isDisconnect) {
        if (!GameData.joiners[index]) return;
        if (GameData.joiners[index].uid != connectInfo.uid) return;
        if (isDisconnect) {
            cc.find('ready_hand_' + direction, this.readyNode).active = false;
            cc.find('readying_' + direction, this.readyNode).active = false;
        } else {
            if (GameDataDDZ.game.gameStart) {
                cc.find('ready_hand_' + direction, this.readyNode).active = false;
                cc.find('readying_' + direction, this.readyNode).active = false;
            } else {
                var isReadyUid = GameData.joiners[index].uid;
                if (connectInfo.uid != isReadyUid || connectInfo.uid == 0) {
                    cc.find('ready_hand_' + direction, this.readyNode).active = false;
                    cc.find('readying_' + direction, this.readyNode).active = true;
                } else {
                    cc.find('ready_hand_' + direction, this.readyNode).active = true;
                    cc.find('readying_' + direction, this.readyNode).active = false;
                }
            }
        }
        cc.find('lost_' + direction, this.lostNode).active = isDisconnect;
    },
    setRoomNum: function () {
        var startStr = '';
        if (GameData.room.id >= 100000) {
            this.roomNum.string = startStr + GameData.room.id;
        } else if (GameData.room.id >= 10000) {
            this.roomNum.string = startStr + '0' + GameData.room.id;
        } else if (GameData.room.id >= 1000) {
            this.roomNum.string = startStr + '00' + GameData.room.id;
        } else if (GameData.room.id >= 100) {
            this.roomNum.string = startStr + '000' + GameData.room.id;
        } else if (GameData.room.id >= 10) {
            this.roomNum.string = startStr + '0000' + GameData.room.id;
        } else if (GameData.room.id >= 1) {
            this.roomNum.string = startStr + '00000' + GameData.room.id;
        } else {
            this.roomNum.string = startStr + '000000';
        }

        if (GameData.room.opts.roomType == gameDefine.roomType.Room_Match) {
            this.roomZh.node.opacity = 90;
            this.roomNum.node.opacity = 90;
        }
    },

    backBtnClicked: function () {
        if (GameData.room.creator == GameData.player.uid) {
            cc.director.loadScene('home');
        } else {
            DDZHandler.getInstance().quitMjRoom(GameData.room.id);
        }
    },

    wxInviteBtnClicked: function () {
        var title = "经典斗地主 " + "房间号:" + GameData.room.id;
        var des = this.getInviteStr();
        wxShareWeb(title, des);
    },

    getInviteStr: function () {
        var gameTypeStr = '';
        var limitStr = '';
        var str = "玩法:";
        var costTypeArr = ['房主付,','AA制,','赢家付,','代开房付费,',''];
        var detainArr = ['不押,','1分,','2分,','3分,'];
        var jiaofenTypeArr = ['赢家叫分,','轮庄叫分,','霸王叫分,'];
        str += costTypeArr[GameData.room.opts.costType - 1];
        str += jiaofenTypeArr[GameData.room.opts.jiaofenType - 1];
        str += '押底:' + detainArr[GameData.room.opts.detain];

        if(GameData.room.opts.currencyType == gameDefine.currencyType.Currency_Coin){
            gameTypeStr = '金币场 ';

            var serverConfig = configMgr.getServerConfig();
            if(serverConfig && serverConfig.roomCoin){
                var spendData = serverConfig.roomCoin[gameDefine.GameType.Game_Poker_DDZ];
                if(spendData){
                    var index = 0;
                    switch (GameData.room.opts.roundMax){
                        case 6:{
                            index = 0;
                        }break;
                        case 10:{
                            index = 1;
                        }break;
                        case 20:{
                            index = 2;
                        }break;
                    }
                    if(spendData[index]){
                        var cost = spendData[index].enter;
                        var final = cost[GameData.room.opts.joinermax];
                        if(final){
                            limitStr = '进入条件：'+final[GameData.room.opts.scorelv];
                        }
                    }
                }
            }
        }
        if (GameData.room.opts.suppress == true)
        {
            str += "憋三家,";
        } 
        if (GameData.room.opts.kicking == true)
        {
            str += "带踢踹,";
        }
        if (GameData.room.opts.fourFlag == true)
        {
            str += "四带2对,"
        }
        else if (GameData.room.opts.fullMark == true)
        {
            str += "两王或4个2叫满,"
        }
        str += '局数:' + GameData.room.opts.roundMax + '局,';
        var str2 = "请您快速加入对局.";

        var fanshu = GameData.room.opts.fanshu == 15 ? '无限番': (GameData.room.opts.fanshu+'番');
        var des = gameTypeStr + limitStr + str + str2 + fanshu;
        console.log('des = ' + des);
        return des;
    },

    onShareResult: function () {
        wxShareTimeline("经典斗地主", "我在经典斗地主等你!");
    },

    onShareFriend: function () {
        wxShareWeb("经典斗地主", "我在经典斗地主等你!");
    },

    onDeleteRoom: function () {
        createMessageBox('解散房间不扣房卡，是否确定解散？', function () {
            RoomHandler.deleteRoom(GameData.room.id);
        }, function () {});
    },

    onQuitRoom: function () {
        if (GameData.room.creator == GameData.player.uid) {
            cc.director.loadScene('home');
        } else {
            RoomHandler.quitRoom(GameData.room.id);
        }
    },

    onCreatorQuit: function () {
        GameData.player.roomid = undefined;
        if (GameData.room.creator != GameData.player.uid) {
            createMessageBox('房主已经解散房间', function () {
                cc.director.loadScene('home');
            });
        } else {
            cc.director.loadScene('home');
        }
    },

    //复制邀请口令
    onCopyInviteKey: function(){
        var roomId = GameData.room.id;
        if (roomId > 0) {
            var title = "经典斗地主,"+"房间号:"+GameData.room.id+",";
            var des = this.getInviteStr();
            wxShareCommond(title+des);
        }
    },

    //复制房间号
    onCopyRoomInfo: function () {
        // var roomId = GameData.room.id;
        // if (roomId > 0) {
        //     var title = "石狮麻将,"+"房间号:"+GameData.room.id+",";
        //     var des = this.getInviteStr();
        //     textClipboard(title+des);
        // }
    },

    electricQuantity: function () {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "electricQuantity", "()V");
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod("AppController", "electricQuantity");
            }
            this.schedule(this.electricQuantity, 60);
        } catch (e) {
            WriteLog("electricQuantity throw: " + JSON.stringify(e));
        }
    },

    onNativePowerHandler: function (percent) {
        var node = this.dianchiNode.getChildByName("dianchi2");
        node.scaleX = percent.detail / 100;
    },

    updataWifi: function () {
        this.callBackForWifiUI();
        this.schedule(this.callBackForWifiUI, 5);
    },

    callBackForWifiUI: function () {
        var ms = GameNet.getInstance().getPingPong() / 1000.0;
        if (ms < 0.3) {
            this.showWifi(3);
        } else if (ms < 0.6) {
            this.showWifi(2);
        } else if (ms < 1) {
            this.showWifi(1);
        } else {
            this.showWifi(0);
        }
    },

    showWifi: function (index) {
        for (var i = 0; i < 4; i++) {
            var node = cc.find('WiFi-' + (i + 1), this.wifiNode)
            node.active = i == index ? true : false;
        }
    },

    updateTime: function () {
        this.schedule(this.handTimeLabel, 1);
    },

    handTimeLabel: function () {
        var da = new Date();
        var h = da.getHours() + '';
        var m = da.getMinutes() + '';
        h = h.length == 1 ? '0' + h : h;
        m = m.length == 1 ? '0' + m : m;

        this.timeLabel.string = h + ':' + m;
    },

    onGameStartHandler: function (data) {
        this.readyNode.active = !GameDataDDZ.game.gameStart;
        this.hideAllReadyStatus();
    },

    hasName: function (name, nameArry) {
        for (var i = 0; i < nameArry.length; i++) {
            var toName = nameArry[i];
            if (toName == name) return true;
        }
        return false;
    },

    playQiangDiZhuAnimation: function(){
        if(!GameDataDDZ.game.flag){
            return;
        }
        //播放抢地主动画
        this.QiangDiZhuNode.position = cc.p(0, 0);
        this.QiangDiZhuNode.active = true;

        var self = this;
        var func = function(){
            var pos = self.getHeadPositionOnUid(GameDataDDZ.game.dizhuUid);
            var move = cc.moveTo(0.5, cc.p(pos.x, pos.y +45));
            var fun = cc.callFunc(function(){
                self.jiaofenNode.active = false;

                self.QiangDiZhuNode.active = false;
                self.showPlayers();
            });
            self.QiangDiZhuNode.stopAllActions();
            self.QiangDiZhuNode.runAction(cc.sequence(move, fun));
        };
        var animation = this.QiangDiZhuNode.getComponent(dragonBones.ArmatureDisplay);
        animation.playAnimation('qiangdizhu', 1);
        animation.addEventListener(dragonBones.EventObject.COMPLETE, func, this);
    }
});