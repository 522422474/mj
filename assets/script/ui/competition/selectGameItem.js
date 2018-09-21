var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
var competitionHandler = require('competitionHandler');
cc.Class({
    extends: cc.Component,

    properties: {
        gameName:   cc.Label,
        peopleNum:  cc.Label,
        rewardNum:  cc.Label,
        rewardIcon: cc.Sprite,
        baoMingBtn: cc.Node,
        cancelBtn:  cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        require('util').registEvent('onActivityList', this, this.refreshUI);
    },
    onDestroy: function () {
        unrequire('util').registEvent('onActivityList', this, this.refreshUI);
    },

    initUI: function (gameType,templateId) {
        this.config = configMgr.getServerConfig();
        this.setGameType(templateId);
        this.setGameIcon(gameType);
        this.setGameName(templateId);
        this.setPoepleNum(templateId);
        this.setBaoMingBtn(templateId);
    },

    refreshUI: function () {
        this.setPoepleNum(this.gameType);
        this.setBaoMingBtn(this.gameType);
    },

    setGameIcon: function (gameType) {
        var url = this.getGameImgIcon(gameType);
        this.addTextureImg(this.node,url);
    },

    setGameName: function (templateId) {
        this.gameName.string = this.config['fight'][templateId].name;
    },

    setGameType: function (templateId) {
        this.gameType = templateId;
    },

    setBaoMingBtn: function (templateId) {
        var isHasFreeTime = GameData.player.freeActivityNum > 0;
        var isHasApply = competitionHandler.isApply(templateId,GameData.player.uid);
        var freeNode = cc.find('free',this.baoMingBtn);
        var costNode = cc.find('cost',this.baoMingBtn);
        freeNode.active = isHasFreeTime;
        costNode.active = !isHasFreeTime;
        //检查是否报名
        this.baoMingBtn.active = !isHasApply;
        this.cancelBtn.active =  isHasApply;

        //检查是否有免费次数
        if (isHasFreeTime) {
            var freeLb =  cc.find('freeNum',freeNode).getComponent(cc.Label);
            freeLb.string = '免费' + GameData.player.freeActivityNum + '次';
        }else {
            var costIcon = cc.find('costIcon',costNode);
            var costData = this.config['fight'][templateId].signCosts;
            var url = '';
            var costStr = '';
            for (var key in costData) {
                if (key == gameDefine.currencyType.Currency_Card){
                    url = 'resources/home/replace/fangka.png';
                }
                costStr = costData[key];
            }
            cc.find('costNum',costNode).getComponent(cc.Label).string = '*' + costStr;
            this.addTextureImg(costIcon,url);
        }
    },

    setPoepleNum: function () {
        var num = competitionHandler.getPeopleNum(this.gameType);
        this.peopleNum.string = num + '/' + 100;
    },
    getGameImgIcon: function (gameType) {
        var url = '';
        switch (gameType) {
            case 'addBtn': {
                url = 'resources/home/match/btn-home-add.png';
            }break;
            case gameDefine.GameType.Game_Mj_Tianjin:{
                url = 'resources/home/match/btn-home-tjmj.png';
            }break;
            case gameDefine.GameType.Game_Mj_Shishi:{
                url = 'resources/home/match/btn-home-ssmj.png';
            }break;
            case gameDefine.GameType.Game_MJ_HuaDian:{
                url = 'resources/home/match/btn-home-hdmj.png';
            }break;
            case gameDefine.GameType.Game_Mj_HZ:{
                url = 'resources/home/match/btn-home-hzmj.png';
            }break;
            case gameDefine.GameType.Game_Mj_CC:{
                url = 'resources/home/match/btn-home-ccmj.png';
            }break;
            case gameDefine.GameType.Game_Mj_Heb:{
                url = 'resources/home/match/btn-home-hebmj.png';
            } break;
            case gameDefine.GameType.Game_Poker_TianjinDDZ: {
                url = 'resources/home/match/doudizhu01.png';
            } break;
            case gameDefine.GameType.Game_Poker_DDZ: {
                url = 'resources/home/match/doudizhu01.png';
            } break;
            case gameDefine.GameType.Game_niu_niu: {
                url = 'resources/home/match/niuniu01.png';
            } break;
            case gameDefine.GameType.Game_Niu_Hundred: {
                url = 'resources/home/match/home_btn_2.png';
            } break;
            case gameDefine.GameType.Game_TDK: {
                url = 'resources/home/match/tiandaken01.png';
            } break;
            case gameDefine.GameType.Game_Poker_13shui: {
                url = 'resources/home/match/shisanshui01.png';
            } break;
            case gameDefine.GameType.Game_Poker_paodekuai: {
                url = 'resources/home/match/paodekuaianniu01.png';
            } break;
            case gameDefine.GameType.Game_Poker_ZJH: {
                url = 'resources/home/match/btn-home-szp.png';
            } break;
            case gameDefine.GameType.Game_Poker_HHDZ: {
                url = 'resources/home/match/btn-home-hhdz.png';
            } break;
        }
        return url;
    },

    //申请报名
    requestApply:function () {
        competitionHandler.apply(this.gameType + '');
    },

    //取消报名
    requestCancel: function () {
        competitionHandler.cancel(this.gameType + '');
    },

    addTextureImg: function (node,url) {
        var texture = cc.textureCache.addImage(cc.url.raw(url));
        node.getComponent(cc.Sprite).spriteFrame = null;
        node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    }

});
