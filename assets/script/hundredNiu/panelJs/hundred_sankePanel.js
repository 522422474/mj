var HundredNiuHandler = require('hundredNiuHandler');
var NiuNiuPokerHandler = require('niuniuPokerHandler');
cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        playerInfo: cc.Node,
    },

    onLoad: function () {

    },
    showUI: function (data) {
        this.initUI();
        if ( !data) return;
        this.showList(data);
    },
    initUI: function () {
        this.contentNode.removeAllChildren();
    },
    showList: function (data) {
        var playerInfom = data.players;
        var winNums = data.winNums;
        var guideInfo = HundredNiuHandler.guideInfo;
        if (guideInfo.player != null) {
            var guideId = guideInfo.player.uid;
            for (var j = 0; j < playerInfom.length; j++) {
                var playerData = playerInfom[j];
                if (playerData.uid == guideId) {
                    playerInfom = NiuNiuPokerHandler.itemtoArraytop(playerInfom, j);
                    winNums = NiuNiuPokerHandler.itemtoArraytop(winNums, j);
                }
            }
        }
        for (var i = 0; i < playerInfom.length; i++) {
            var playerData = playerInfom[i];
            var player = this.contentNode.getChildByName('player'+i);
            if(player == undefined){
                player = cc.instantiate(this.playerInfo);
                player.y = -48 - i*this.playerInfo.height;
                this.contentNode.height = (i+1)*this.playerInfo.height;
                player.parent = this.contentNode;
                player.name = 'player'+i;
            }


            var signSp = cc.find('bg/signSp',player);
            var signLb = cc.find('bg/signLb',player);
            var headIcon = cc.find('headNode/headMask/headIcon', player);
            var name = cc.find('headNode/name', player);
            var coin = cc.find('headNode/coin', player);
            if (playerData.name != undefined) {
                this.setName(name, playerData.name);    
            }
            if (playerData.headimgurl != undefined) {
                this.setHeadIcon(headIcon, playerData.headimgurl);    
            }
            if (playerData.coin != undefined) {
                coin.getComponent('cc.Label').string = ConversionCoinValue(playerData.coin, 0);    
            }
            this.showSignSp(signSp, i);
            this.showSignLb(signLb, i);
            this.showWinAndChips(player, winNums[i]);
        }
    },
    setName: function (nameNode, nameLb) {
        nameNode.getComponent('cc.Label').string = getShortStr(nameLb,4);
    },
    setHeadIcon: function(headNode,headimgurl) {
        if (headimgurl == undefined || headimgurl == '' || headimgurl.length <= 0) {
            headNode.getComponent('cc.Sprite').spriteFrame = null;
            return;
        }
        var self = this;
        cc.loader.load({url: headimgurl, type: 'png'}, function (error, texture) {
            if (!error && texture) {
                headNode.getComponent('cc.Sprite').spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    },
    showSignSp: function (signSp, num) {
        var url = '';
        if (HundredNiuHandler.guideInfo.player != null) {
            if (num == 0) {
                url = cc.textureCache.addImage(cc.url.raw('resources/hundredNiuNiu/uiResources/panelUI/xian/shensuanzi.png'));
            }else if (num == 1) {
                url = cc.textureCache.addImage(cc.url.raw('resources/hundredNiuNiu/uiResources/panelUI/xian/dafuhao.png'));
            } else if (num > 1) {
                signSp.active = false;
                return;
            }
        } else {
            if (num == 0) {
                url = cc.textureCache.addImage(cc.url.raw('resources/hundredNiuNiu/uiResources/panelUI/xian/dafuhao.png'));
            }else if (num >= 1) {
                signSp.active = false;
                return;
            }
        };

        signSp.getComponent('cc.Sprite').spriteFrame = new cc.SpriteFrame(url);
        signSp.active = true;
    },
    showSignLb: function (signLb, num) {
        if ((HundredNiuHandler.guideInfo.player != null && num <= 1) 
            || (HundredNiuHandler.guideInfo.player == null && num < 1)) {
            signLb.active = false;
            return;
        }
        if (HundredNiuHandler.guideInfo.player != null) {
            signLb.getComponent('cc.Label').string = num;    
        } else {
            signLb.getComponent('cc.Label').string = (num+1);
        }
        signLb.active = true;
    },
    showWinAndChips: function (playerNode, num) {
        // var chipsNum = cc.find('xiazhu/xiazhuNum', playerNode);
        // chipsNum.getComponent('cc.Label').string = '100万';
        var winNum = cc.find('winNode/winNum', playerNode);
        winNum.getComponent('cc.Label').string = num;
    },
    close: function() {
        closeView(this.node.name);
    },
});
