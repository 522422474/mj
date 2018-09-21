var gameDefine = require('gameDefine');
var soundMngr = require('SoundMngr');
var RoomHandler = require('roomHandler');

cc.Class({
    extends: cc.Component,

    properties: {
        lostNode: cc.Node,
        play_up_player: cc.Node,
        play_down_player: cc.Node,
        play_left_player: cc.Node,
        play_right_player: cc.Node,

        playerTemplate: cc.Prefab,
        dragonBonesNode: cc.Prefab
    },

    onLoad: function () {
        require('util').registEvent('onRoomInfo', this, this.onRoomInfoHandler);
        require('util').registEvent('onGameInfo', this, this.onGameInfoHandler);
        require('util').registEvent('onRoomChat', this, this.onRoomChatHandler);
        require('util').registEvent('dynChat', this, this.onDynChatHandler);
    },
    onDestroy: function () {
        unrequire('util').registEvent('onRoomInfo', this, this.onRoomInfoHandler);
        unrequire('util').registEvent('onGameInfo', this, this.onGameInfoHandler);
        unrequire('util').registEvent('onRoomChat', this, this.onRoomChatHandler);
        unrequire('util').registEvent('dynChat', this, this.onDynChatHandler);
    },
    onEnable: function () {
        this.headers = [];
        this._curGameData = RoomHandler.getCurGameDataOnType();

        //设置头像
        this.showPlayers();
        //设置相关状态标志
        this.updatePlayerOnLine();
        this.updatePlayerZhuang();
        this.updatePlayerTurn();
        this.updatePlayerScore();
        //添加互动动画
        this.addDynAnimation();
    },

    onRoomInfoHandler: function(){
        this.showPlayers();
        this.updatePlayerScore();
        this.updatePlayerOnLine();
    },
    onGameInfoHandler: function(){
        this.updatePlayerZhuang();
        this.updatePlayerTurn();
    },

    addDynAnimation: function(){
        var animationNode = this.node.getChildByName('uiAnimationNode');
        if(animationNode == undefined){
            animationNode = cc.instantiate(this.dragonBonesNode);
            animationNode.parent = this.node;
            animationNode.name = 'uiAnimationNode';
        }
    },

    showPlayers: function () {
        //清空头像存储数组
        this.headers = [];

        this.showPlayer('down', this.play_down_player);
        this.showPlayer('right', this.play_right_player);
        this.showPlayer('up', this.play_up_player);
        this.showPlayer('left', this.play_left_player);
    },
    showPlayer: function (direction, parent) {
        var player = GameData.getPlayerByPos(direction);
        if (player != null) {

            var playerNode = parent.getChildByName('playerNode');
            if(playerNode == undefined){
                playerNode = cc.instantiate(this.playerTemplate);
                playerNode.name = "playerNode";
                playerNode.parent = parent;
            }
            parent.active = true;

            var playerTemplate = playerNode.getComponent('playerTemplate');
            if(playerTemplate){
                playerTemplate.setPlayer(player);
                playerTemplate.setName(player.name);
                playerTemplate.setHeadIcon(player.headimgurl);

                var onLine = RoomHandler.isPlayerOnline(player.uid);
                playerTemplate.setIsOnline(onLine);
            }
            this.headers.push(playerNode);
        } else {
            parent.active = false;
        }
    },
    updatePlayerOnLine: function(){
        var posList = ['left', 'right', 'up', 'down'];
        for(var i = 0;i < posList.length;i++){
            var pos = posList[i];
            var Player = GameData.getPlayerByPos(pos);
            if (Player && !RoomHandler.isPlayerOnline(Player.uid)) {
                this.showLostIcon(pos, false);
            } else {
                this.showLostIcon(pos, true);
            }
        }
    },
    showLostIcon: function(direction, online){
        var lostNode = cc.find(direction, this.lostNode);
        if (lostNode) {
            lostNode.active = !online;
        }
    },
    updatePlayerZhuang: function(){
        if(this._curGameData == undefined){
            return;
        }
        var gameInfoData = this._curGameData.getGameInfoData();
        if(gameInfoData == undefined){
            return;
        }
        for (var i = 0; i < this.headers.length; i++) {
            var headerNode = this.headers[i];
            if(headerNode){
                var playerTemplate = headerNode.getComponent('playerTemplate');
                var zhuangShow = gameInfoData.zhuangUid == playerTemplate.uid ? true : false;
                playerTemplate.showZhuang(zhuangShow);
            }
        }
    },
    updatePlayerTurn: function(){
        if(this._curGameData == undefined){
            return;
        }
        var gameInfoData = this._curGameData.getGameInfoData();
        if(gameInfoData == undefined){
            return;
        }
        for (var i = 0; i < this.headers.length; i++) {
            var headerNode = this.headers[i];
            if(headerNode){
                var uid = headerNode.getComponent('playerTemplate').uid;
                var disNode = cc.find('liuguang', headerNode);
                if(disNode){
                    disNode.active = gameInfoData.turn == uid ? true : false;
                }
            }
        }
    },
    updatePlayerScore: function(){
        var scoreData = RoomHandler.getScoreData();
        if(scoreData == undefined){
            return;
        }
        for (var i = 0; i < this.headers.length; i++) {
            var headerNode = this.headers[i];
            if(headerNode){
                var uid = headerNode.getComponent('playerTemplate').uid;
                var score = scoreData[uid] == undefined ? 0 : scoreData[uid];
                headerNode.getComponent('playerTemplate').setCoin(score);
            }
        }
    },

    onDynChatHandler: function(data){
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

    onRoomChatHandler: function (data) {

        var uid = data.detail.uid;
        var type = data.detail.msg.type;

        for (var i = 0; i < this.headers.length; i++) {

            var headerNode = this.headers[i];
            if (headerNode.getComponent('playerTemplate').uid == uid) {

                var direction = GameData.tablePos[uid];
                var content;

                var chatNode = cc.find('chat_' + direction, headerNode);
                if (chatNode != null) {

                    var wordNode = cc.find('word', chatNode);
                    var emoNode = cc.find('emo', chatNode);
                    var yuyinNode = cc.find('yuyinNode', chatNode);
                    var chatBg = cc.find('word/bg', chatNode);
                    var chatLabel = cc.find('word/Label', chatNode).getComponent(cc.Label);

                    if (type == 'word') {
                        content = data.detail.msg.data;
                        chatLabel.string = content;
                        chatBg.width = 20 + content.length * 24;

                        wordNode.getComponent('HideComponent').show(3);
                    } else if (type == 'fast') {
                        var soundKey = data.detail.msg.data.sound;
                        content = data.detail.msg.data.content;

                        var contentStr = getShortStr(content, 20);
                        chatLabel.string = contentStr;
                        chatBg.width = contentStr.length * 30;

                        var playerSex = GameData.getPlayerSexByUid(uid);
                        soundMngr.instance.playAudioChat(soundKey, playerSex);

                        wordNode.getComponent('HideComponent').show(3);
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
            var template = headerNode.getComponent('playerTemplate');
            if(template == undefined){
                continue;
            }
            if(template.uid != uid){
                continue;
            }
            //return headerNode.convertToWorldSpace(headerNode.parent.position);
            return headerNode.parent.position;
        }
        return 0;
    }
});