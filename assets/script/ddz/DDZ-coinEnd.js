var RoomHandler = require('roomHandler');
var matchHandler = require('matchHandler');
var gameDefine = require('gameDefine');
cc.Class({
    extends: cc.Component,

    properties: {
        coinEndNode: cc.Node,
        coinEndLayer: cc.Node,
        resultIcon: cc.Node,
        Player: cc.Node,
        buttonNode: cc.Node
    },

    onLoad: function () {
        require('util').registEvent('coinEndEvent', this, this.onCoinEndEventHandler);
    },

    onDestroy: function() {
        unrequire('util').registEvent('coinEndEvent', this, this.onCoinEndEventHandler);
    },

    onEnable: function(){
        this.onCoinEndEventHandler();
    },

    onCoinEndEventHandler: function(){
        this.updateUIShow();
    },

    onShow: function() {
        this.uiAction();
        this.updateUIShow();
    },

    uiAction: function(){
        this.coinEndNode.active = true;

        this.coinEndLayer.scale = 0.6;

        var scale1 = cc.scaleTo(0.2, 1.2);
        var scale2 = cc.scaleTo(0.2, 0.9);
        var scale3 = cc.scaleTo(0.1, 1.0);

        this.coinEndLayer.stopAllActions();
        this.coinEndLayer.runAction(cc.sequence(scale1, scale2, scale3).easing(cc.easeIn(3.0)));
    },

    updateUIShow: function(){
        if(GameData.room.opts == undefined){
            return;
        }
        if(GameData.room.opts.joinermax) {
            this.hideNodeChild(this.resultIcon);
            for (var i = 0; i < GameData.room.opts.joinermax; i++) {
                this.showPlayer(i);
                this.showMultiple(i);
                this.showScore(i);
                this.showDouble(i);
            }
        }
        this.showButtonNode();
    },

    setName: function (name) {
        if (isChinese(name)) {
            return getShortStr(name, 5);
        } else {
            return getShortStr(name, 10);
        }
    },

    setHeadImg: function(imgurl, node){
        if(imgurl == undefined || imgurl.length <= 0 || node == undefined){
            return;
        }
        cc.loader.load({url: imgurl, type: 'png'}, function(error, texture) {
            if (!error && texture) {
                node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    },

    showPlayer: function(index) {
        var player = GameData.joiners[index];
        if(player == undefined){
            return;
        }
        var playerNode = cc.find('player_' + (index + 1), this.Player);
        var nameNode = cc.find('name', playerNode);
        var headpicNode = cc.find('head', playerNode);
        var identityNode = cc.find('identityIcon', playerNode);

        //显示地主标致
        if (player.uid == GameDataDDZ.game.dizhuUid) {
            identityNode.active = true;
        } else if (player.uid != GameData.game.dizhuUid) {
            identityNode.active = false;
        }
        //昵称字体颜色
        if (GameData.player.uid == player.uid) {
            nameNode.color = new cc.Color(255, 229, 124);
        } else {
            nameNode.color = new cc.Color(123, 253, 255);
        }
        nameNode.getComponent(cc.Label).string = this.setName(player.name);

        this.setHeadImg(player.headimgurl, headpicNode);
    },

    showMultiple: function(index) {
        var player = GameData.joiners[index];
        if(player == undefined){
            return;
        }
        var playerNode = cc.find('player_' + (index + 1), this.Player);
        var multipleNode = cc.find('multiple', playerNode);
        multipleNode.getComponent(cc.Label).string = GameDataDDZ.resultData.boomNum;
    },

    showDouble: function(index) {
        var player = GameData.joiners[index];
        if(player == undefined){
            return;
        }
        var uid = player.uid;
        var playerNode = cc.find('player_' + (index + 1), this.Player);
        if (GameDataDDZ.isEmptyObject(GameDataDDZ.kicking)) {
            return;
        }
        for (var key in GameDataDDZ.kicking.kicking)
        {
            if (key == uid && uid != GameDataDDZ.kicking.dizhu)
            {
                var doubleNode = cc.find('doubleIcon', playerNode);
                if (GameDataDDZ.kicking.kicking[key] == 1) {
                   doubleNode.active = true;     
                } else {
                    doubleNode.active = false;
                }
            }
            else if (key == uid && uid == GameDataDDZ.kicking.dizhu)
            {
                var doubleNode = cc.find('doubleIcon', playerNode);
                if (GameDataDDZ.kicking.kicking[key] == 1) {
                   doubleNode.active = true;     
                } else {
                    doubleNode.active = false;
                }
            }
        }
    },

    showScore: function(index) {
        var playerData = GameData.joiners[index];
        if(playerData == undefined){
            return;
        }
        var uid = playerData.uid;
        var playerNode = cc.find('player_' + (index + 1), this.Player);
        var scoreNode = cc.find('score', playerNode);
        var score = 0;
        //判断金币场
        if(gameDefine.currencyType.Currency_Coin == GameData.room.opts.currencyType) {
            var coinData = RoomHandler.getCoinData();
            if(coinData && coinData.coins && coinData.coins[uid]){
                score = coinData.coins[uid];
            }
        } else {
            if(GameDataDDZ.resultData.score){
                score = GameDataDDZ.resultData.score[uid];
            }
        }

        if (score > 0) {
            scoreNode.color = new cc.Color(255, 229, 124);
            scoreNode.getComponent(cc.Label).string = '+' + score;
            if (uid == GameData.player.uid) {
                var winIcon = cc.find('winIcon', this.resultIcon);
                winIcon.active = true;
            }
        } else if (score < 0) {
            scoreNode.color = new cc.Color(123, 253, 255);
            scoreNode.getComponent(cc.Label).string = score;
            if (uid == GameData.player.uid) {
                var loseIcon = cc.find('loseIcon', this.resultIcon);
                loseIcon.active = true;
            }
        } else {
            scoreNode.color = new cc.Color(132, 255, 123);
            scoreNode.getComponent(cc.Label).string = score;
            if (uid == GameData.player.uid) {
                var dogfallIcon = cc.find('dogfallIcon', this.resultIcon);
                dogfallIcon.active = true;
            }
        }
    },

    showButtonNode: function() {
        if(GameData.room.opts == undefined){
            return;
        }
        if(gameDefine.currencyType.Currency_Coin == GameData.room.opts.currencyType) {
            cc.find('continBtn2', this.buttonNode).active = false;
            cc.find('continBtn', this.buttonNode).active = true;
            cc.find('backBtn', this.buttonNode).active = true;
        } else {
            cc.find('continBtn2', this.buttonNode).active = true;
            cc.find('continBtn', this.buttonNode).active = false;
            cc.find('backBtn', this.buttonNode).active = false;
        }
    },

    showTimer: function() {
        var continBtn = cc.find('continBtn', this.buttonNode);
        var timeNode = cc.find('time', continBtn);
        var count = 6;
        var that = this;
        var timerCallback = function() {
            count--;
            timeNode.getComponent(cc.Label).string = '（' + count + '）';
            if (count <= 0)
            {
                that.unschedule(timerCallback);
                that.btnBackOnClicked();
            }
        };
        this.schedule(timerCallback, 1);
    },

    hideNodeChild: function(parent) {
        for (var key in parent.children) {
            parent.children[key].active = false;
        }
    },

    onSelectGameClick: function(event, customEventData){
        if (inCD(1000)) {
            return;
        }
        if (customEventData == gameDefine.currencyType.Currency_Card)
        {
            if (!GameData.roomClose) 
            {
                DDZHandler.getInstance().requestReady(function (res) {});
                this.coinEndNode.active = false;
                GameDataDDZ.game.dizhuUid = 0;

                sendEvent('initTableNode');
            } else {
                this.coinEndNode.active = false;
                this.node.getComponent('DDZ-roomMain').showSummaryLayer();
            }
            GameDataDDZ.clearObject(GameDataDDZ.kicking);
        } else if (customEventData == gameDefine.currencyType.Currency_Coin){
            matchHandler.selectGameType = GameData.room.opts.gameType;
            matchHandler.selectGameLv = GameData.room.opts.scorelv;

            //GameData.player.roomid = undefined;
            //cc.director.loadScene('home', function(){
                matchHandler.signup();
            //});

            //this.coinEndNode.active = false;
            GameDataDDZ.game.dizhuUid = 0;

            sendEvent('initTableNode');
        }
    },

    btnBackOnClicked: function (evt) {
        GameData.player.roomid = undefined;
        cc.director.loadScene('home');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
