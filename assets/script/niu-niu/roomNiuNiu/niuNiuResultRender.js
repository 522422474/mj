var roomHandler = require('roomHandler'); 
var niuNiuHandler = require('niuNiuHandler');
var niuniuPokerHandler = require('niuniuPokerHandler');
cc.Class({
    extends: cc.Component,
    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        maxWinner: cc.Node,
        nameLbl: cc.Label,
        userIdLbl: cc.Label,
        niuNiuNumLbl: cc.Label,
        wuNiuNumLbl: cc.Label,
        winNumLbl: cc.Label,
        selfBgFrame: cc.Node, //自己背景框
        creatorIcon: cc.Node, //房主图标
        headIcon: cc.Node,
        roomScoreLbl: cc.Label,
        fonts: [cc.Font],
        _playerInfo: null,

        infoNode: cc.Node,

    },

    onLoad: function () {

    },

    initUI: function () {
        var player = this._playerInfo; // 玩家信息

        JSON.stringify("结算玩家数据  " + JSON.stringify(player));

        //玩家信息
        this.nameLbl.string = getShortStr(player.name,10);
        this.userIdLbl.string = "ID " + player.uid;
        if (player.uid === GameData.player.uid) {
            this.nameLbl.node.color = new cc.Color(254,255,215);
            this.userIdLbl.node.color = new cc.Color(254,255,215);
        }else {
            this.nameLbl.node.color = new cc.Color(210,172,111);
            this.userIdLbl.node.color = new cc.Color(210,172,111);
        }
        var self = this;
        if(player.headimgurl != null && player.headimgurl != '')
        {
            cc.loader.load({url: player.headimgurl, type: 'png'}, function (error, texture) {
                if (!error && texture) {
                   self.headIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                }
            });
        }

        //重要指标次数统计
        // this.showTypeNum(player.uid);

        //总分
        var score = roomHandler.scores[player.uid];
        if (score > 0) {
            this.roomScoreLbl.string = "+"+score;
            this.roomScoreLbl.node.color = new cc.Color(117,190,92);
        }else if (score < 0) {
            this.roomScoreLbl.string = score;
            this.roomScoreLbl.node.color = new cc.Color(255,92,92);
        }else if (score == 0) {
            this.roomScoreLbl.string = score;
            this.roomScoreLbl.node.color = new cc.Color(235,224,129);
        }

        //大赢家标识
        var GetScoreMaxScore = function() {
            var maxScore = [];
            for (var key in roomHandler.scores) {
                maxScore.push(roomHandler.scores[key]);
            }
            var index = 0;
            for (var i = 1; i < maxScore.length; i++) {
                if (maxScore[i] && maxScore[i] > maxScore[index]) {
                    index = i;
                }
            }
            return maxScore[index];
        }
        if (GetScoreMaxScore() == score) {
            this.maxWinner.active = true;
        }
        //this.selfBgFrame.active = player.uid == GameData.player.uid;

        //房主标记
        this.creatorIcon.active = player.uid == roomHandler.room.creator;   

    },
    getActiveNode: function(){
        return this.infoNode;
    },
    showTypeNum: function (uid) {
        var recordData = roomHandler.getRecordData();
        var niuniuNum = 0;
        var wuNiuNum = 0;
        var winNum = 0;
        if (recordData.length <= 0){
            
        }else{
            var niuniuPokerType = niuniuPokerHandler.getPokerType();
            for (var i = 0; i < recordData.length; i++) {
                var roundData = recordData[i];
                if (roundData.score[uid] > 0) {
                    winNum++;
                }
                if (roundData.result[uid] == niuniuPokerType.NIU_NIU) {
                    niuniuNum++;
                }else if (roundData.result[uid] == niuniuPokerType.NIU_NONE) {
                    wuNiuNum++;
                }
            }
        }
        this.niuNiuNumLbl.string = niuniuNum;
        this.winNumLbl.string = winNum;
        this.wuNiuNumLbl.string = wuNiuNum;
    },
    initData : function (playerInfo) {
        this._playerInfo = playerInfo;
        if (this._playerInfo) {
            this.initUI();
        }
    }
});