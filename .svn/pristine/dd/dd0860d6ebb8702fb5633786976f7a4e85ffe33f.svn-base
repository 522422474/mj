var ZJH_roomData = require('ZJH-RoomData');
var gameDefine = require('gameDefine');
var roomHandler = require('roomHandler');
cc.Class({
    extends: cc.Component,
    properties: {
        maxWinner: cc.Node,
        nameLbl: cc.Label,
        userIdLbl: cc.Label,
        winNumLbl: cc.Label,
        loseNumLbl: cc.Label,
        creatorIcon: cc.Node, //房主图标
        headIcon: cc.Node,
        roomScoreLbl: cc.Label,
        fonts: [cc.Font],
        _playerInfo: null,
        infoNode: cc.Node

    },

    onLoad: function () {

    },

    initUI: function () {
        var player = this._playerInfo; // 玩家信息

        JSON.stringify("结算玩家数据  " + JSON.stringify(player));

        this.nameLbl.string = getShortStr(player.name,10);
        this.userIdLbl.string = "ID: " + player.uid;

        var self = this;
        this.headIcon.getComponent(cc.Sprite).spriteFrame = null;
        if(player.headimgurl != null && player.headimgurl != '' && player.headimgurl.length > 0)
        {
            cc.loader.load({url: player.headimgurl, type: 'png'}, function (error, texture) {
                if (!error && texture) {
                    self.headIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                }
            });
        }

        this.winNumLbl.string = 0;
        this.loseNumLbl.string = 0;
        var resultInfo = ZJH_roomData.gameResultData;
        for (var key in ZJH_roomData.gameResultData.extraInfo) {
            if (player.uid == key) {
                this.winNumLbl.string = ZJH_roomData.gameResultData.extraInfo[key].winNum;
                this.loseNumLbl.string = ZJH_roomData.gameResultData.extraInfo[key].loseNum;
            }
        }


        var scoreData;
        var eveScore = 0;
        //if (GameData.room.opts.currencyType == gameDefine.currencyType.Currency_Coin) {
        //    if (roomHandler.coinData.coins) {
        //        scoreData = roomHandler.coinData.coins;
        //        eveScore = scoreData[player.uid];
        //    }
        //}else if (GameData.room.opts.currencyType == gameDefine.currencyType.Currency_Card) {
        //    if (ZJH_roomData.gameResultData.socres && ZJH_roomData.gameResultData.socres[player.uid]) {
        //        scoreData = resultInfo.socres;
        //        eveScore = scoreData[player.uid];
        //    }
        //}
        if (ZJH_roomData.gameResultData.socres && ZJH_roomData.gameResultData.socres[player.uid]) {
            scoreData = resultInfo.socres;
            eveScore = scoreData[player.uid];
        }
        if (!eveScore) {
            return
        }
        if (eveScore > 0) {
            this.roomScoreLbl.string = "+"+eveScore;
            this.roomScoreLbl.font = this.fonts[0];
        }else if (eveScore < 0) {
            this.roomScoreLbl.string = eveScore;
            this.roomScoreLbl.font = this.fonts[1];
        }else if (eveScore == 0) {
            this.roomScoreLbl.string = eveScore;
            this.roomScoreLbl.font = this.fonts[2];
        }

        var GetScoreMaxUid = function() {
            var maxScore = [];
            // tempUid = playersInfo[0].player.uid;
            for (var key in scoreData) {
                maxScore.push(scoreData[key]);
            }
            var index = 0;
            for (var i = 1; i < maxScore.length; i++) {
                if (maxScore[i] && maxScore[i] > maxScore[index]) {
                    index = i;
                }
            }
            return maxScore[index];
        }
        if (GetScoreMaxUid() == scoreData[player.uid]) {
            this.maxWinner.active = true;
        }
        this.creatorIcon.active = player.uid == GameData.room.creator;

    },
    getActiveNode: function(){
        return this.infoNode;
    },
    initData : function (playerInfo) {
        if (!playerInfo) return;
        this._playerInfo = playerInfo;
        if (Object.keys(ZJH_roomData.gameResultData).length > 0) {
            this.initUI();
        }
    }
});