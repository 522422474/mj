var RoomHandler = require('roomHandler');
var ZJH_roomData = require('ZJH-RoomData');
var configMgr = require('configMgr');
var gameDefine = require('gameDefine');

cc.Class({
    extends: cc.Component,

    properties: {
        //相关 checkBox

        //局数
        round10: cc.Toggle,
        round20: cc.Toggle,
        round30: cc.Toggle,

        //人数2-6
        player: cc.Toggle,

        //房费
        pay1: cc.Toggle,
        pay2: cc.Toggle,
        pay3: cc.Toggle,
        //玩法

        //筹码
        chouMa1: cc.Toggle,
        chouMa2: cc.Toggle,

        //235吃豹子（默认勾选）
        baoZi: cc.Toggle,

        //比花色（默认勾选）
        huaSe: cc.Toggle,

        //A23大小选项
        A23da: cc.Toggle,
        A23xiao: cc.Toggle,
        A23diLong: cc.Toggle,

        //闷选项(默认3)
        men0: cc.Toggle,
        men1: cc.Toggle,
        men2: cc.Toggle,
        men3: cc.Toggle,

        //封顶轮数(默认20)
        fengDing5: cc.Toggle,
        fengDing10: cc.Toggle,
        fengDing15: cc.Toggle,
        fengDing20: cc.Toggle,

        spendUI: {
            default: [],
            type: [cc.Label]
        },
        drowArray: {
            default: [],
            type: [cc.Node]
        }
    },

    onLoad: function () {

        this.modeType = 1;  //模式类型
        this.spendData = undefined;

        this.refreshUI();
    },
    getModeType: function(){
        return this.modeType;
    },
    createRoom: function () {

        GameData.setGameType(gameDefine.GameType.Game_Poker_ZJH);
        this.saveRuleFromUI();

        var createData = {
            gameType: gameDefine.GameType.Game_Poker_ZJH, //游戏类型
            roundType: 1,
            roundMax: ZJH_roomData.createRoomOpts.roundMax,
            roundRule: ZJH_roomData.createRoomOpts.roundRule,
            joinermax: ZJH_roomData.createRoomOpts.playerMax,
            joinermin: ZJH_roomData.createRoomOpts.playerMin,
            twoThreeFiveBiger: ZJH_roomData.createRoomOpts.twoThreeFiveBiger,
            compareSuit: ZJH_roomData.createRoomOpts.compareSuit,
            chipsType: ZJH_roomData.createRoomOpts.chipsType,
            a23Type: ZJH_roomData.createRoomOpts.a23Type,
            canNotLookTurnNum: ZJH_roomData.createRoomOpts.canNotLookTurnNum,
            maxTunNum: ZJH_roomData.createRoomOpts.maxTunNum,
            roomType: 0,
            costType: ZJH_roomData.createRoomOpts.costType,
            cardType: ZJH_roomData.createRoomOpts.playType,
            clubId: 0,
            currencyType: 1,
            settleType: 1
        };

        var modeTypeData = configMgr.getModeType();
        if(modeTypeData == undefined || modeTypeData.Game_Poker_ZJH == undefined){
            return createData;
        }
        createData.currencyType = modeTypeData.Game_Poker_ZJH.CurrencyType;
        createData.settleType = modeTypeData.Game_Poker_ZJH.SettleType;

        ZJH_roomData.onRoomReadyInfo = {};
        return createData;
    },

    saveRuleFromUI: function () {

        if (this.round10.isChecked) {
            ZJH_roomData.createRoomOpts.roundMax = 10;
            ZJH_roomData.createRoomOpts.roundRule = 10;
        } else if (this.round20.isChecked) {
            ZJH_roomData.createRoomOpts.roundMax = 20;
            ZJH_roomData.createRoomOpts.roundRule = 20;
        } else if (this.round30.isChecked) {
            ZJH_roomData.createRoomOpts.roundMax = 30;
            ZJH_roomData.createRoomOpts.roundRule = 30;
        }
        
        if (this.pay1.isChecked) {
            ZJH_roomData.createRoomOpts.costType = 1;
        } else if (this.pay2.isChecked) {
            ZJH_roomData.createRoomOpts.costType = 2;
        } else if (this.pay3.isChecked) {
            ZJH_roomData.createRoomOpts.costType = 3;
        }

        if (this.huaSe.isChecked) {
            ZJH_roomData.createRoomOpts.compareSuit = 1;
        }else {
            ZJH_roomData.createRoomOpts.compareSuit = 0;
        }

        if (this.baoZi.isChecked) {
            ZJH_roomData.createRoomOpts.twoThreeFiveBiger  = 1;
        }else {
            ZJH_roomData.createRoomOpts.twoThreeFiveBiger  = 0;
        }

        if (this.chouMa1.isChecked) {
            ZJH_roomData.createRoomOpts.chipsType = 0;
        }else if (this.chouMa2.isChecked) {
            ZJH_roomData.createRoomOpts.chipsType = 1;
        }

        if (this.A23diLong.isChecked) {
            ZJH_roomData.createRoomOpts.a23Type = 1;
        }else if (this.A23da.isChecked) {
            ZJH_roomData.createRoomOpts.a23Type = 0;
        }else if (this.A23xiao.isChecked) {
            ZJH_roomData.createRoomOpts.a23Type = 2;
        }

        if (this.men0.isChecked) {
            ZJH_roomData.createRoomOpts.canNotLookTurnNum = 0;
        }else if (this.men1.isChecked) {
            ZJH_roomData.createRoomOpts.canNotLookTurnNum = 1;
        }else if (this.men2.isChecked) {
            ZJH_roomData.createRoomOpts.canNotLookTurnNum = 2;
        }else if (this.men3.isChecked) {
            ZJH_roomData.createRoomOpts.canNotLookTurnNum = 3;
        }

        if (this.fengDing5.isChecked) {
            ZJH_roomData.createRoomOpts.maxTunNum = 5;
        }else if (this.fengDing10.isChecked) {
            ZJH_roomData.createRoomOpts.maxTunNum = 10;
        }else if (this.fengDing15.isChecked) {
            ZJH_roomData.createRoomOpts.maxTunNum = 15;
        }else if (this.fengDing20.isChecked) {
            ZJH_roomData.createRoomOpts.maxTunNum = 20;
        }

        ZJH_roomData.saveCreateRoomOpts();
    },

    refreshUI: function () {
        cc.log('ZJH_roomData.createRoomOpts = '+JSON.stringify(ZJH_roomData.createRoomOpts));
        this.round10.isChecked = ZJH_roomData.createRoomOpts.roundMax == 15;
        this.round20.isChecked = ZJH_roomData.createRoomOpts.roundMax == 20;
        this.round30.isChecked = ZJH_roomData.createRoomOpts.roundMax == 30;

        //应产品需求，将AA和赢家付屏蔽
        this.pay1.isChecked = true;
        this.pay2.isChecked = false;
        this.pay3.isChecked = false;

        this.huaSe.isChecked = ZJH_roomData.createRoomOpts.compareSuit == 1;
        this.baoZi.isChecked = ZJH_roomData.createRoomOpts.twoThreeFiveBiger == 1;
        this.chouMa1.isChecked = ZJH_roomData.createRoomOpts.chipsType == 0;
        this.chouMa2.isChecked = ZJH_roomData.createRoomOpts.chipsType == 1;
        this.A23diLong.isChecked = ZJH_roomData.createRoomOpts.a23Type == 0;
        this.A23da.isChecked = ZJH_roomData.createRoomOpts.a23Type == 1;
        this.A23xiao.isChecked = ZJH_roomData.createRoomOpts.a23Type == 2;
        this.men0.isChecked = ZJH_roomData.createRoomOpts.canNotLookTurnNum == 0;
        this.men1.isChecked = ZJH_roomData.createRoomOpts.canNotLookTurnNum == 1;
        this.men2.isChecked = ZJH_roomData.createRoomOpts.canNotLookTurnNum == 2;
        this.men3.isChecked = ZJH_roomData.createRoomOpts.canNotLookTurnNum == 3;
        this.fengDing5.isChecked = ZJH_roomData.createRoomOpts.maxTunNum == 5;
        this.fengDing10.isChecked = ZJH_roomData.createRoomOpts.maxTunNum == 10;
        this.fengDing15.isChecked = ZJH_roomData.createRoomOpts.maxTunNum == 15;
        this.fengDing20.isChecked = ZJH_roomData.createRoomOpts.maxTunNum == 20;
        this.showSpendUI();
    },
    selectSpendData: function (evt) {
        this.showSpendUI();
    },
    showSpendUI: function () {
        cc.log("..mode..ZJH");
        var str1 = "",str2 = "";

        var modeTypeData = configMgr.getModeType();
        if(modeTypeData == undefined || modeTypeData.Game_Poker_ZJH == undefined){
            return;
        }
        var serverConfig = configMgr.getServerConfig();
        if(serverConfig == undefined){
            return;
        }
        this.modeType = modeTypeData.Game_Poker_ZJH.CurrencyType;
        switch (this.modeType){
            case gameDefine.currencyType.Currency_Card:{
                str1 = "房卡";
                this.spendData = serverConfig.roomCard[gameDefine.GameType.Game_Poker_ZJH];
            }break;
            case gameDefine.currencyType.Currency_Coin:{
                str1 = "金币";
                this.spendData = serverConfig.roomCoin[gameDefine.GameType.Game_Poker_ZJH];
            }break;
        }
        if (!this.spendData) {
            cc.log('..spendData is undefined');
            return;
        }
        for(var key = 0;key < Object.keys(this.spendData).length;key++){
            var final = 0;
            if(this.modeType == gameDefine.currencyType.Currency_Card){
                var cost = this.spendData[key +71].cost;
                //当前选择的是几人房
                var number = 3;
                if (this.player3.isChecked) {
                    number = 3;
                } else if (this.player4.isChecked) {
                    number = 4;
                } else if (this.player5.isChecked) {
                    number = 5;
                } else if (this.player6.isChecked) {
                    number = 6;
                }
                final = cost[number].final;

                //如果选择的是AA付
                if(this.pay2.isChecked){
                    final = Math.ceil(final / number);
                    str2 = "/人";
                }
            } else {
                final = this.spendData[key].cost;
            }
            //如果费用为零，显示红线
            if (final == 0) {
                this.drowArray[key].active = true;
            } else {
                this.drowArray[key].active = false;
            }
            this.spendUI_tdk[key].string = '（'+str1+'*' + final + str2+'）';
        }
    }
});