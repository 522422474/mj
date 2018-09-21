var gameDefine = require('gameDefine');
var matchHandler = require('matchHandler');
var configMgr = require('configMgr');
var errorCode = require('errorCode');
var soundMngr = require('SoundMngr');

cc.Class({
    extends: cc.Component,

    properties: {
        selfGolds: cc.Label,
        lvBtnPanel: cc.Node,
        typeTitle: cc.Node
    },

    onLoad: function () {
        require('util').registEvent('onPlayerUpdate', this, this.initUI);
    },
    onDestroy: function () {
        unrequire('util').registEvent('onPlayerUpdate', this, this.initUI);
    },
    onEnable: function () {
        this.initUI();
    },

    initUI: function(){
        this.selfGolds.string = ConversionCoinValue(GameData.player.coin, 0);
        this.selectLv = -1;

        var serverConfig = configMgr.getServerConfig();
        if(serverConfig == undefined){
            cc.log('..serverConfig is undefined.');
            return;
        }
        var matchData = serverConfig.matchCoin;
        if(matchData == undefined){
            cc.log('..serverConfig is undefined.');
            return;
        }
        if(matchHandler == undefined){
            cc.log('..matchHandler is undefined.');
            return;
        }
        var gameData = matchData[matchHandler.selectGameType];
        if(gameData == undefined){
            cc.log('..serverConfig is undefined.');
            return;
        }

        var url = this.getGameTypeTitleImgUrl(matchHandler.selectGameType);
        if(url && url.length > 0){
            var texture = cc.textureCache.addImage(cc.url.raw(url));
            if(texture){
                this.typeTitle.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            }
        }

        for(var ii = 0;ii < 3;ii++){
            var name = 'item'+ (ii+1);
            var btnNode = cc.find(name, this.lvBtnPanel);

            var cost = gameData.cost[ii];
            if (matchHandler.selectGameType == gameDefine.GameType.Game_Niu_Hundred) {
                cost = gameData.zhuang[ii];
            }
            var enter = getMatchCoinEnterLimit(matchHandler.selectGameType, ii) || 0;

            var number = cc.find('number', btnNode);
            var score = cc.find('score', btnNode);
            var goldNum = cc.find('golds/golds_num', btnNode);

            this.initScoreSp(btnNode, matchHandler.selectGameType);
            var localIndex = ii+1;
            this.initBtnNodeSp(btnNode, localIndex, matchHandler.selectGameType);

            number.getComponent(cc.Label).string = ii +'人';
            score.getComponent(cc.Label).string = ConversionCoinValue(cost, 0);
            goldNum.getComponent(cc.Label).string = '≥'+enter;
            if(GameData.player.coin >= enter){
                goldNum.color = new cc.Color(253, 243, 0);
            } else {
                goldNum.color = new cc.Color(255, 0, 0);
            }
            btnNode.tag = ii;
        }
        //this.refreshBtnSelect();
    },

    initScoreSp: function (node, gameType) {
        var scoreBg = cc.find('scoreBg', node);
        var btnUrl = 'resources/home/selectLv/difenkuang.png';
        if (gameType == gameDefine.GameType.Game_Niu_Hundred) {
            btnUrl = 'resources/home/selectLv/difenkuang_beishu.png';
        } else {
            btnUrl = 'resources/home/selectLv/difenkuang.png';
        }

        var texture = cc.textureCache.addImage(cc.url.raw(btnUrl));
        if(texture){
            scoreBg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        }
    },
    initBtnNodeSp: function (node, index, gameType) {
        var textureUrl = 'resources/home/selectLv/chujichang.png';
        switch (index) {
            case 1:
                if (gameType == gameDefine.GameType.Game_Niu_Hundred) {
                    textureUrl = 'resources/home/selectLv/chujichang_beishu.png';
                } else {
                    textureUrl = 'resources/home/selectLv/chujichang.png';
                }
            break;
            case 2:
                if (gameType == gameDefine.GameType.Game_Niu_Hundred) {
                    textureUrl = 'resources/home/selectLv/zhongjichang_beishu.png';
                } else {
                    textureUrl = 'resources/home/selectLv/zhongjichang.png';
                }
            break;
            case 3:
                if (gameType == gameDefine.GameType.Game_Niu_Hundred) {
                    textureUrl = 'resources/home/selectLv/gaojichang_beishu.png';
                } else {
                    textureUrl = 'resources/home/selectLv/gaojichang.png';
                }
            break;
            default:
                textureUrl = '';
            break;
        }
        if (textureUrl && textureUrl.length > 0) {
            var texture = cc.textureCache.addImage(cc.url.raw(textureUrl));
            if(texture){
                node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            }
        }
    },

    refreshBtnSelect: function(){
        for(var ii = 0;ii < 3;ii++){
            var name = 'item'+ (ii+1);
            var btnNode = cc.find(name, this.lvBtnPanel);
            if(ii == this.selectLv){
                btnNode.scale = 1.1;
            } else {
                btnNode.scale = 1.0;
            }
        }
    },
    getGameTypeTitleImgUrl: function(gameType){
        var textureUrl = 'resources/home/match/jb_bt_doudizhu.png';
        switch (gameType){
            case gameDefine.GameType.Game_Mj_Tianjin:
            case gameDefine.GameType.Game_Mj_Shishi:
            case gameDefine.GameType.Game_Mj_AS:
            case gameDefine.GameType.Game_Mj_HZ:
            case gameDefine.GameType.Game_Mj_Heb:
            case gameDefine.GameType.Game_Mj_CC:
            case gameDefine.GameType.Game_MJ_HuaDian:{
                textureUrl = '';
            }break;
            case gameDefine.GameType.Game_Poker_DDZ:
            case gameDefine.GameType.Game_Poker_TianjinDDZ:{
                textureUrl = 'resources/home/match/jb_bt_doudizhu.png';
            }break;
            case gameDefine.GameType.Game_Poker_13shui:{
                textureUrl = '';
            }break;
            case gameDefine.GameType.Game_niu_niu:
            case gameDefine.GameType.Game_Niu_Niu_10:{
                textureUrl = 'resources/home/match/jb_bt_pinshi.png';
            }break;
            case gameDefine.GameType.Game_Niu_Hundred:{
                textureUrl = 'resources/home/match/jb_bt_bairenpinshi.png';
            }break;
            case gameDefine.GameType.Game_TDK:{
                textureUrl = '';
            }break;
            case gameDefine.GameType.Game_Poker_paodekuai:{
                textureUrl = '';
            }break;
            case gameDefine.GameType.Game_Poker_ZJH:{
                textureUrl = 'resources/home/match/jb_bt_sanzhangpai.png';
            }break;
            case gameDefine.GameType.Game_Poker_HHDZ:{
                textureUrl = 'resources/home/match/jb_bt_hhdz.png';
            }break;
        }
        return textureUrl;
    },
    onAddGoldClick: function(){
        soundMngr.instance.playAudioOther('button');
        var fun = function(panel){
            if(panel){
                var template = panel.getComponent('shoppingPanel');
                if(template){
                    template.showPanel(2);
                }
            }
        };

        var shopPanel = cc.director.getScene().getChildByName('Canvas').getChildByName("shoppingPanel");
        if(shopPanel != undefined){
            shopPanel.setLocalZOrder(this.node.getLocalZOrder()+1);
        }
        openView("shoppingPanel", undefined, fun);
    },
    onSelectLvClick: function(evt){
        soundMngr.instance.playAudioOther('button');
        var lv = evt.target.tag;
        if(lv < 0 || lv > 2){
            return;
        }
        // if(lv == this.selectLv){
        //     return;
        // }
        this.selectLv = lv;
        cc.log('..selectLv:'+lv);
        //this.refreshBtnSelect();

        //暂时添加
        this.onBeginMatchClick();
    },
    onBeginMatchClick: function(){
        if (inCD(500)) {
            return;
        }
        if(this.selectLv == undefined){
            cc.log('cur select lv is undefined.');
            return;
        }
        if(checkOpenUISuccour(matchHandler.selectGameType, this.selectLv)){
            return;
        }
        var enter = getMatchCoinEnterLimit(matchHandler.selectGameType, this.selectLv) || 0;
        if(enter > GameData.player.coin){
            createMoveMessage('', errorCode.LessCoin);
            return;
        }
        openView('Loading');

        matchHandler.selectGameLv = this.selectLv;
        matchHandler.signup();
    },
    onBackClick: function(){
        soundMngr.instance.playAudioOther('button');
        closeView(this.node.name);
    },
    update: function (dt) {
    }
});