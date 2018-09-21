var soundMngr = require('SoundMngr');
var gameDefine = require('gameDefine');
var RuleHandler = require('ruleHandler');
var RoomHandler = require('roomHandler');
var hhdz_roomUtil = require('hhdz_roomUtil');
var hhdz_data = require('hhdz_data');

var roomTable = cc.Class({
    extends: cc.Component,

    properties: {
        BetLayer: cc.Node,
        JetonLayer: cc.Node,
        PokerLayer: cc.Node,
        CountDownLayer: cc.Node,

        CountDownLabel: cc.Label,
        winnerStrNode: cc.Node,
        OnLineNode: cc.Node,

        UIBet: cc.Prefab,

        //变量
        _selectBetId: undefined,    //当前选择的筹码等级
        _jetonMax: undefined,       //筹码创建最大个数（从零开始）
        _jetonPond: [],             //筹码节点数组
        _jetonIndex: 0,             //当前用的筹码下标
        _jetonValueArray: [],       //筹码数值数组
        _countDown: 0,              //下注倒计时
    },

    onLoad: function () {
        require('util').registEvent('rbw-dealCard', this, this.onDealCardHandler);
        require('util').registEvent('rbw-startPour', this, this.onStartPourHandler);
        require('util').registEvent('rbw-onSetPour', this, this.onOnSetPourHandler);
        require('util').registEvent('rbw-result', this, this.onResultHandler);
    },
    onDestroy: function () {
        unrequire('util').registEvent('rbw-dealCard', this, this.onDealCardHandler);
        unrequire('util').registEvent('rbw-startPour', this, this.onStartPourHandler);
        unrequire('util').registEvent('rbw-onSetPour', this, this.onOnSetPourHandler);
        unrequire('util').registEvent('rbw-result', this, this.onResultHandler);
    },
    onEnable: function() {

        this._selectBetId = undefined;
        this._jetonMax = 100;
        this._jetonPond = [];
        this._jetonIndex = 0;
        this._jetonValueArray = [];

        this.initUIShow();
        this.updateTableJetonValue();
        //增加伪筹码
        this.addFakeJetonToTable();
    },

    initUIShow: function(){
        this.CountDownLayer.active = false;
        this.winnerStrNode.active = false;

        this.setAddJetonInteractable(false);

        this.initUIPokerBack();
    },

    onDealCardHandler: function(){
        this.winnerStrNode.active = false;
        this.initUIPokerBack();
    },

    onStartPourHandler: function(){
        this.handleStartPourTimer();
    },

    onOnSetPourHandler: function(data){
        if(data == undefined || data.detail == undefined){
            return;
        }
        this.tablePlayerAddJeton(data.detail);
    },

    onResultHandler: function(){
        var resultInfoData = hhdz_data.getResultInfoData();
        if(resultInfoData == undefined){
            return;
        }
        var cardData = resultInfoData.card;
        if(cardData == undefined){
            return;
        }

        var self = this;
        function runFunc(){
            return new Promise(function(resolve,reject){
                self.openPoker('red');
                var time = self.openPoker('black');
                cc.log('..openPokerTime:'+time);
                resolve(time);
            });
        }
        function runFunc1(time){
            return new Promise(function(resolve,reject){
                setTimeout(function(){
                    var time = self.runWinnerAction(cardData.winner);
                    resolve(time);
                },(time *1000));
            });
        }
        function runFunc2(time){
            return new Promise(function(resolve,reject){
                setTimeout(function(){
                    self.takeBackJetonNode();
                },(time *1000));
            });
        }

        runFunc()
            .then(function(data){
                return runFunc1(data);
            })
            .then(function(data){
                return runFunc2(data);
            })
            .then(function(){})
    },

    initUIPokerBack: function(){
        for(var i = 0;i < 3;i++){
            var redPokerNode = cc.find('red/poker_'+i, this.PokerLayer);
            if(redPokerNode){
                this.loadPokerImg(redPokerNode, 'back');
            }
            var blackPokerNode = cc.find('black/poker_'+i, this.PokerLayer);
            if(blackPokerNode){
                this.loadPokerImg(blackPokerNode, 'back');
            }
        }
    },

    handleStartPourTimer: function () {
        var time = hhdz_data.getStartPourTime();
        if(time == undefined || time <= 0){
            return;
        }
        this._countDown = parseInt(time/1000);

        this.setAddJetonInteractable(true);
        this.schedule(this.updateLastTime, 1);

        var self = this;
        setTimeout(function(){
            self.onLineFakeAddJeton();
        },2000);
    },
    updateLastTime: function () {
        if(this._countDown == undefined || this._countDown <= 0 ){
            this.CountDownLayer.active = false;

            this.setAddJetonInteractable(false);
            this.unschedule(this.updateLastTime);
            return;
        }
        this.CountDownLabel.string = this._countDown--;
        this.CountDownLayer.active = true;
    },

    updateTableJetonValue: function(){
        for(var i = 0;i < 3;i++){
            var valueNode = cc.find('value_'+i, this.JetonLayer);
            if(valueNode){
                this._jetonValueArray[i] === undefined ? this._jetonValueArray[i] = 0 : null;
                valueNode.getComponent(cc.Label).string = this._jetonValueArray[i];
            }
        }
    },

    addFakeJetonToTable: function(){
        var fakeArray = hhdz_roomUtil.getFakeJetonData();
        cc.log('..fake:'+JSON.stringify(fakeArray));
        if(fakeArray == undefined){
            return;
        }
        for(var i = 0;i < fakeArray.length;i++){
            var data = fakeArray[i];
            if(data == null){
                continue;
            }
            var jetonNode = cc.find('region_'+i, this.JetonLayer);
            if(jetonNode == undefined){
                return;
            }
            for(var j = 0;j < data.length;j++){
                var temp = data[j];
                if(temp == undefined){
                    continue;
                }
                for(var k = 0;k < temp.number;k++){
                    this.addJetonNode(temp.lv, i, undefined);
                }
            }
        }
    },

    tablePlayerAddJeton: function(data){
        var template = this.node.getComponent('hhdz_roomHead');
        if(template == undefined){
            return;
        }
        var headArray = template._headArray;
        if(headArray == undefined){
            return;
        }
        for(var i = 0;i < headArray.length;i++){
            //判断大赢家和神算子是同一人，第二位不下注
            if(i == 1 && hhdz_data.checkPlayerSame()){
                continue;
            }
            var headNode = headArray[i];
            if(headArray == undefined){
                continue;
            }
            var headTemplate = headNode.getComponent('hhdz_head');
            if(headTemplate == undefined){
                continue;
            }
            var playerData = headTemplate._player;
            if(playerData == undefined){
                continue;
            }
            if(playerData.uid != data.uid){
                continue;
            }
            headTemplate.runAddJetonAction();

            this.addJetonNode(data.index, data.type, headNode.parent.position);
        }
    },

    setBetsScale: function(){
        for(var i = 0;i < 5;i++){
            var betNode = cc.find('bet_'+i, this.BetLayer);
            if(betNode){
                if(i == this._selectBetId){
                    betNode.scale = 1.1;
                    continue;
                }
                betNode.scale = 1.0;
            }
        }
    },
    setAddJetonInteractable: function(interactable){
        for(var i = 0;i < 5;i++){
            var betNode = cc.find('bet_'+i, this.BetLayer);
            if(betNode){
                betNode.scale = 1.0;
                betNode.getComponent(cc.Button).interactable = interactable;
            }
        }
        this._selectBetId = undefined;

        for(var j = 0;j < 3;j++){
            var jetonNode = cc.find('region_'+j, this.JetonLayer);
            if(jetonNode){
                jetonNode.getComponent(cc.Button).interactable = interactable;
            }
        }
    },

    //添加筹码节点 lv：筹码等级；index：筹码池下标；starPos：开始位置
    addJetonNode: function(lv, index, starPos){
        if(lv == undefined || index == undefined){
            return;
        }
        var jetonNode = cc.find('region_'+index, this.JetonLayer);
        if(jetonNode == undefined){
            return;
        }
        this._jetonIndex > this._jetonMax ? this._jetonIndex = 0 : null;

        var node = this._jetonPond[this._jetonIndex];
        if(node == undefined){
            cc.log('..create uiBet.');
            node = cc.instantiate(this.UIBet);
            node.parent = this.JetonLayer;
            this._jetonPond.push(node);
        }
        this._jetonIndex++;

        var template = node.getComponent('hhdz_bet');
        if(template == undefined){
            return;
        }
        template.setBetId(lv);

        //增加筹码池数值
        this.addJetonValue(lv, index);

        //设置筹码位置或执行动作
        var x = getRandomInt(jetonNode.position.x - jetonNode.width/2, jetonNode.position.x + jetonNode.width/2);
        var y = getRandomInt(jetonNode.position.y - jetonNode.height/2, jetonNode.position.y + jetonNode.height/2);
        var endPos = {x: x, y: y};

        if(starPos){
            template.runActionToTable(starPos, endPos);
        } else {
            template.setBetPosition(endPos);
        }
    },

    //回收筹码节点 index：从第几个开始；number：数量；endPos：回收结束位置
    JetonRunMove: function(index, number, endPos){
        if(index == undefined || number == undefined || endPos == undefined){
            return;
        }
        for(var i = index;i < (index + number);i++){
            var node = this._jetonPond[i];
            if(node){
                var template = node.getComponent('hhdz_bet');
                if(template){
                    template.runActionToPlayer(endPos);
                }
            }
        }
    },

    takeBackJetonNode: function(){
        var template = this.node.getComponent('hhdz_roomHead');
        if(template == undefined){
            return;
        }
        var resultData = hhdz_data.getResultInfoData();
        if(resultData == undefined){
            return;
        }
        var winLoseData = resultData.winLoseInfo;
        if(winLoseData == undefined){
            return;
        }
        this._jetonPond === undefined ? this._jetonPond = [] : null;

        var posData = [];

        //增加桌面上获胜的玩家位置
        for(var i = 0; i < winLoseData.length; i++){
            var data = winLoseData[i];
            if(data == undefined){
                continue;
            }
            if(parseInt(data.score) > 0){
                var pos = template.getHeadPositionByUId(data.uid);
                if(pos == null){
                    continue;
                }
                posData.push(pos);
            }
        }
        //增加自己的位置
        if(resultData.self && resultData.self > 0){
            var selfPos = template.getSelfHeadPosition();
            if(selfPos){
                posData.push(selfPos);
            }
        }
        //增加集体在线玩家位置（输赢是假的，所以每次都发）
        posData.push(this.OnLineNode.position);

        var jetonNum = this._jetonPond.length;
        var number = parseInt( jetonNum/ posData.length);
        var index = 0;

        for(var j = 0; j < posData.length; j++){
            if(j == (posData.length -1)){
                number = jetonNum;
            }
            this.JetonRunMove(index, number, posData[j]);
            jetonNum -= number;
            index += number;
        }
        this._jetonIndex = 0;
        this._jetonValueArray = [];

        this.updateTableJetonValue();
    },

    //增加筹码池数值 lv：筹码等级；index：筹码池数组下标
    addJetonValue: function(lv, index){
        if(lv == undefined || index == undefined){
            return;
        }
        this._jetonValueArray[index] < 0 ? this._jetonValueArray[index] = 0 : null;
        this._jetonValueArray[index] += hhdz_roomUtil.getBetValue(lv);

        this.updateTableJetonValue();
    },

    loadPokerImg: function(node, pokerId){
        if(node == undefined || pokerId == undefined){
            return;
        }
        var textureUrl = hhdz_roomUtil.getPokerImgUrl(pokerId);
        if(textureUrl == null){
            return;
        }
        var texture = cc.textureCache.addImage(cc.url.raw(textureUrl));
        if(texture){
            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        }
    },

    //执行翻牌动作
    pokerRunFlipAndLoadImg: function(node, pokerId){
        var self = this;
        var time = 0.6;
        var scale1 = cc.scaleTo(time/2, 0, 1);
        var scale2 = cc.scaleTo(time/2, 1, 1);
        var fun = cc.callFunc(function(){
            self.loadPokerImg(node, pokerId);
        });
        node.stopAllActions();
        node.runAction(cc.sequence(scale1, fun, scale2));

        return time;
    },
    //执行赢家动画
    runWinnerAction: function(winner){
        var dirStr = null;
        switch (winner){
            case hhdz_roomUtil.WinnerType.Red:{
                dirStr = '红方';
            }break;
            case hhdz_roomUtil.WinnerType.Black:{
                dirStr = '黑方';
            }break;
        }
        if(dirStr == null){
            return;
        }
        this.winnerStrNode.getComponent(cc.Label).string = dirStr;
        this.winnerStrNode.active = true;
        this.winnerStrNode.opacity = 0;

        var time = 1.5;
        var fade1 = cc.fadeIn(time/3);
        //var fade2 = cc.fadeOut(time/3);
        var delay = cc.delayTime(time/3);

        this.winnerStrNode.stopAllActions();
        this.winnerStrNode.runAction(cc.sequence(fade1, delay));

        return time;
    },

    openPoker: function(direction){
        var resultInfoData = hhdz_data.getResultInfoData();
        if(resultInfoData == undefined){
            return;
        }
        var cardData = resultInfoData.card;
        if(cardData == undefined){
            return;
        }
        var data = cardData[direction];
        if(data == undefined){
            return;
        }
        data.card == undefined ? data.card = [] : null;

        var self = this;
        function runFunc(direction, index, time){
            time === undefined ? time = 0 : null;
            return new Promise(function(resolve,reject){
                setTimeout(function(){
                    cc.log('..success runFunc.');

                    var temp = {};
                    var pokerNode = cc.find(direction+'/poker_'+index, self.PokerLayer);
                    if(pokerNode){
                        temp.time = self.pokerRunFlipAndLoadImg(pokerNode, data.card[index]);
                        temp.index = ++index;
                        resolve(temp);
                    } else {
                        temp.time = 0;
                        temp.index = ++index;
                        reject(temp);
                    }
                },(time *1000));
            });
        }

        var time = 0;
        runFunc(direction, 0, 0)
            .then(function(data){
                cc.log('..data.1:'+JSON.stringify(data));
                time += data.time;
                return runFunc(direction, data.index, data.time);
            })
            .then(function(data){
                cc.log('..data.2:'+JSON.stringify(data));
                time += data.time;
                return runFunc(direction, data.index, data.time);
            })
            .then(function(data){
                time += data.time;
                cc.log('..return:'+time);
                return time;
            })
    },

    onLineFakeAddJeton: function(){
        if(this._countDown == undefined || this._countDown <= 1){
            return;
        }
        var fakeData = hhdz_roomUtil.getOnLineFakeAddJetonData();
        if(fakeData == undefined){
            return;
        }
        fakeData.data === undefined ? fakeData.data = [] : null;
        var self = this;

        for(var i = 0;i < fakeData.data.length;){
            this.addJetonNode(fakeData.data[i], fakeData.data[i+1], this.OnLineNode.position);
            i+=2;
        }

        fakeData.time < 1 ? fakeData.time = 1 : null;
        setTimeout(function(){
            self.onLineFakeAddJeton();
        },parseInt(fakeData.time));
    },

    onBetBtnClick: function(event, data){
        soundMngr.instance.playAudioOther('button');
        if(data == undefined){
            return;
        }
        if(data == this._selectBetId){
            return;
        }
        this._selectBetId = data;
        this.setBetsScale();
    },

    onJetonBtnClick: function(event, data){
        soundMngr.instance.playAudioOther('button');
        if(data == undefined){
            return;
        }
        if(this._selectBetId == undefined){
            return;
        }
        var jetonNode = cc.find('region_'+data, this.JetonLayer);
        if(jetonNode == undefined){
            return;
        }
        var betNode = cc.find('bet_'+this._selectBetId, this.BetLayer);
        if(betNode == undefined){
            return;
        }
        //判断玩家金币
        var coin = hhdz_roomUtil.getBetValue(this._selectBetId);
        if(coin == undefined || GameData.player.coin < coin){
            createMoveMessage('金币不足！');
            return;
        }
        var starPos = betNode.position;
        this.addJetonNode(this._selectBetId, data, starPos);

        //发送加注消息
        hhdz_data.setPour(data, this._selectBetId);
    },

    onLeaveBtnClick: function(event){
        soundMngr.instance.playAudioOther('button');

    },

    onSetingBtnClick: function(event){
        soundMngr.instance.playAudioOther('button');
        openView('SettingsPanel');
    },

    onRunChartBtnClick: function(event){
        soundMngr.instance.playAudioOther('button');

        openView('hhdz-runChart', gameDefine.GameType.Game_Poker_HHDZ, null);
    },
});
module.exports = roomTable;