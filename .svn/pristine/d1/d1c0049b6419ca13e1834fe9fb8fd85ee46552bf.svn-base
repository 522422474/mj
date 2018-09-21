var RoomHandler = require('roomHandler');
var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        /**房卡钻石花费 */
        spend: {
            default: [],
            type: [cc.Label]
        },
        drowArray: {
            default: [],
            type: [cc.Node]
        }
    },

    onLoad: function () {
        this.spendData = undefined;
        this.refreshNiuNiuUI();
    },
    createRoom: function () {
        this.saveNiuNiuRule();
        profileNiuNiu.saveCreateRoomOpts();
        GameData.setGameType(gameDefine.GameType.Game_niu_niu);

        var createData = profileNiuNiu.createRoomOpts;

        var modeTypeData = configMgr.getModeType();
        if(modeTypeData == undefined || modeTypeData.Game_niu_niu == undefined){
            return createData;
        }
        createData.currencyType = modeTypeData.Game_niu_niu.CurrencyType;
        createData.settleType = modeTypeData.Game_niu_niu.SettleType;

        return createData;
    },
    saveNiuNiuRule : function () {
        var panel = this.node;
        // 回合数
        var roundToggleArry = [
            cc.find("/round/ToggleGroup/round10",panel).getComponent(cc.Toggle),
            cc.find("/round/ToggleGroup/round20",panel).getComponent(cc.Toggle),
            cc.find("/round/ToggleGroup/round30",panel).getComponent(cc.Toggle),
        ]
        var selectedRooundType = 10;
        for (var i = 0; i < roundToggleArry.length; i++) {
            if (roundToggleArry[i].isChecked) {
                selectedRooundType = (i + 1)*10;
            }
        }
        profileNiuNiu.createRoomOpts.roundMax = selectedRooundType;
        profileNiuNiu.createRoomOpts.roundRule = selectedRooundType/10;

        // 坐庄方式
        var bossType = 0;
        var bossTypes = [
            cc.find("/bossType/ToggleGroup/boss1",panel).getComponent(cc.Toggle),
            cc.find("/bossType/ToggleGroup/boss2",panel).getComponent(cc.Toggle),
            cc.find("/bossType/ToggleGroup/boss3",panel).getComponent(cc.Toggle),
        ]

        for (var i = 0; i < bossTypes.length; i++) {
            if (bossTypes[i].isChecked) {
                bossType = i + 1;
            }
        }
        profileNiuNiu.createRoomOpts.bossType = bossType;

        //底分
        var baseScore = 0;
        var baseScores = [
            cc.find("/baseScore/toggleGroup/score1",panel).getComponent(cc.Toggle),
            cc.find("/baseScore/toggleGroup/score2",panel).getComponent(cc.Toggle),
            cc.find("/baseScore/toggleGroup/score5",panel).getComponent(cc.Toggle),
        ]

        for (var i = 0; i < baseScores.length; i++) {
            if (baseScores[i].isChecked) {
                baseScore = this.getScoreBeseNum(baseScores[i].node);
            }
        }
        profileNiuNiu.createRoomOpts.scoreBase = baseScore;


        //下注的方式
        var multipleType = 0;
        var multipleTypes = [
            cc.find("/multipleType/ToggleGroup/multiple1",panel).getComponent(cc.Toggle),
            cc.find("/multipleType/ToggleGroup/multiple2",panel).getComponent(cc.Toggle),
        ]

        for (var i = 0; i < multipleTypes.length; i++) {
            if (multipleTypes[i].isChecked) {
                multipleType = i;
            }
        }
        profileNiuNiu.createRoomOpts.multipleType = multipleType;

        // 支付方式
        var cost_type = 0;
        var cost_types = [
            cc.find("/rule_roomPay/toggleGroup/roomOwner",panel).getComponent(cc.Toggle),
            cc.find("/rule_roomPay/toggleGroup/AA",panel).getComponent(cc.Toggle),
            cc.find("/rule_roomPay/toggleGroup/winPlayer",panel).getComponent(cc.Toggle),
        ]
        for (var i = 0; i < cost_types.length; i++) {
            if (cost_types[i].isChecked) {
                cost_type = i + 1;
            }
        }
        profileNiuNiu.createRoomOpts.costType = cost_type;

        profileNiuNiu.createRoomOpts.joinermax = 6;
        profileNiuNiu.createRoomOpts.gameType = 5;
        this.showSpendUI();
    },

    refreshNiuNiuUI: function () {

        var panel = this.node;
        // 回合数
        var roundToggleArry = [
            cc.find("/round/ToggleGroup/round10",panel).getComponent(cc.Toggle),
            cc.find("/round/ToggleGroup/round20",panel).getComponent(cc.Toggle),
            cc.find("/round/ToggleGroup/round30",panel).getComponent(cc.Toggle),
        ]

        for (var i = 0; i < roundToggleArry.length; i++) {
            roundToggleArry[i].isChecked = ((i + 1) ==  profileNiuNiu.createRoomOpts.roundMax/10);
        }

        // 坐庄方式
        var bossType = 0;
        var bossTypes = [
            cc.find("/bossType/ToggleGroup/boss1",panel).getComponent(cc.Toggle),
            cc.find("/bossType/ToggleGroup/boss2",panel).getComponent(cc.Toggle),
            cc.find("/bossType/ToggleGroup/boss3",panel).getComponent(cc.Toggle),
        ]

        for (var i = 0; i < bossTypes.length; i++) {
            bossTypes[i].isChecked = ((i + 1) == profileNiuNiu.createRoomOpts.bossType);

        }

        //底分
        var baseScore = 0;
        var baseScores = [
            cc.find("/baseScore/toggleGroup/score1",panel).getComponent(cc.Toggle),
            cc.find("/baseScore/toggleGroup/score2",panel).getComponent(cc.Toggle),
            cc.find("/baseScore/toggleGroup/score5",panel).getComponent(cc.Toggle),
        ]

        for (var i = 0; i < baseScores.length; i++) {
            baseScores[i].isChecked = (this.getScoreBeseNum(baseScores[i].node) == profileNiuNiu.createRoomOpts.scoreBase);
        }

        //下注的方式

        var multipleTypes = [
            cc.find("/multipleType/ToggleGroup/multiple1",panel).getComponent(cc.Toggle),
            cc.find("/multipleType/ToggleGroup/multiple2",panel).getComponent(cc.Toggle),
        ]

        for (var i = 0; i < multipleTypes.length; i++) {

            multipleTypes[i].isChecked = ((i ) == profileNiuNiu.createRoomOpts.multipleType);
        }

        // 支付方式
        profileNiuNiu.createRoomOpts.costType > 3 ? profileNiuNiu.createRoomOpts.costType = 1 : null;
        var cost_types = [
            cc.find("/rule_roomPay/toggleGroup/roomOwner",panel).getComponent(cc.Toggle),
            cc.find("/rule_roomPay/toggleGroup/AA",panel).getComponent(cc.Toggle),
            cc.find("/rule_roomPay/toggleGroup/winPlayer",panel).getComponent(cc.Toggle),
        ]
        for (var i = 0; i < cost_types.length; i++) {

            cost_types[i].isChecked = ((i + 1) == profileNiuNiu.createRoomOpts.costType);
        }
        this.showSpendUI();
    },
    showSpendUI: function () {
        cc.log("..mode..niuniu6");
        var str1 = "",str2 = "";

        var modeTypeData = configMgr.getModeType();
        if(modeTypeData == undefined || modeTypeData.Game_niu_niu == undefined){
            return;
        }
        var serverConfig = configMgr.getServerConfig();
        if(serverConfig == undefined){
            return;
        }
        this.modeType = modeTypeData.Game_niu_niu.CurrencyType;
        switch (this.modeType){
            case gameDefine.currencyType.Currency_Card:{
                str1 = "房卡";
                this.spendData = serverConfig.roomCard[gameDefine.GameType.Game_niu_niu];
            }break;
            case gameDefine.currencyType.Currency_Coin:{
                str1 = "金";
                this.spendData = serverConfig.roomCoin[gameDefine.GameType.Game_niu_niu];
            }break;
        }
        if (!this.spendData) {
            cc.log('..spendData is undefined');
            return;
        }
        var cost;
        //当前选择的是几人房
        var number = 6;
        for(var key = 0;key < Object.keys(this.spendData).length;key++){
            var final = 0;
            if(this.modeType == gameDefine.currencyType.Currency_Card){
                cost = this.spendData[key+1].cost;
                final = cost[number].final;
                this.spend[key].string = '（'+str1+'*' + final + '）';
            } else {
                cost = this.spendData[key].cost;
                final = cost[number].final;
                str2 = "/局";

                this.spend[key].string = '';//'（'+ final +str1 + str2+'）';
            }
            //如果费用为零，显示红线
            if (final == 0) {
                this.drowArray[key].active = true;
            } else {
                this.drowArray[key].active = false;
            }
        }
    },
    getScoreBeseNum: function (node) {
        var nameStr = node.name;
        var num = nameStr.substring(5,nameStr.length);
        return parseInt(num);
    },
});
