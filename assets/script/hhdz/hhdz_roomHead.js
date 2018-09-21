var roomUtil = require('roomUtil');
var hhdz_roomUtil = require('hhdz_roomUtil');
var hhdz_data = require('hhdz_data');

cc.Class({
    extends: cc.Component,

    properties: {
        HeadLayer: cc.Node,

        UIHead: cc.Prefab,

        _headArray: []
    },

    onLoad: function () {
        require('util').registEvent('rbw-tableInfo', this, this.onTableInfoHandler);
        require('util').registEvent('rbw-onSetPour', this, this.onOnSetPourHandler);
        require('util').registEvent('rbw-selfSetPour', this, this.onSelfSetPourHandler);
        require('util').registEvent('rbw-result', this, this.onResultHandler);
    },

    onDestroy: function () {
        unrequire('util').registEvent('rbw-tableInfo', this, this.onTableInfoHandler);
        unrequire('util').registEvent('rbw-onSetPour', this, this.onOnSetPourHandler);
        unrequire('util').registEvent('rbw-selfSetPour', this, this.onSelfSetPourHandler);
        unrequire('util').registEvent('rbw-result', this, this.onResultHandler);
    },

    onEnable: function () {
        this._headArray = [];

        this.updateSelfHead();
        this.updatePlayersHead();
    },

    onTableInfoHandler: function(){
        this.updatePlayersHead();
    },

    onOnSetPourHandler: function(data){
        if(data == undefined || data.detail == undefined){
            return;
        }
        this.tablePlayerChangeCoin(data.detail);
    },

    onSelfSetPourHandler: function(data){
        if(data == undefined || data.detail == undefined){
            return;
        }
        this.SelfHeadChangeCoin(data.detail.index);
    },

    onResultHandler: function(){
        var resultInfoData = hhdz_data.getResultInfoData();
        if(resultInfoData == undefined){
            return;
        }
        if(resultInfoData.self == undefined){
            return;
        }
        GameData.player.coin += resultInfoData.self;
        GameData.player.coin < 0 ? GameData.player.coin = 0 : null;
        this.updateSelfHead();
    },

    tablePlayerChangeCoin: function(data){
        if(data == undefined){
            return;
        }
        for(var i = 0; i < this._headArray.length; i++){
            var headNode = this._headArray[i];
            if(headNode == undefined){
                continue;
            }
            var template = headNode.getComponent('hhdz_head');
            if(template == undefined){
                continue;
            }
            if(template._player == undefined){
                continue;
            }
            if(template._player.uid != data.uid){
                continue;
            }
            template._player.coin -= hhdz_roomUtil.getBetValue(data.index);
            template._player.coin < 0 ? template._player.coin = 0 : null;
            template.setPlayerCoin(template._player.coin);
        }
    },

    SelfHeadChangeCoin: function(index){
        if(index == undefined){
            return;
        }
        var parent = cc.find('headNode_self', this.HeadLayer);
        if(parent == undefined){
            return;
        }
        var headNode = parent.getChildByName('uiHead');
        if(headNode == undefined){
            return;
        }
        var template = headNode.getComponent('hhdz_head');
        if(template == undefined){
            return;
        }
        GameData.player.coin -= hhdz_roomUtil.getBetValue(index);
        GameData.player.coin < 0 ? GameData.player.coin = 0 : null;
        this.updateSelfHead();
    },

    updateSelfHead: function(){
        var parent = cc.find('headNode_self', this.HeadLayer);
        if(parent == undefined){
            return;
        }
        var headNode = parent.getChildByName('uiHead');
        if(headNode == undefined){
            headNode = cc.instantiate(this.UIHead);
            headNode.parent = parent;
            headNode.name = 'uiHead';
        }
        var template = headNode.getComponent('hhdz_head');
        if(template){
            template.setPlayerData(GameData.player);
        }
    },

    updatePlayersHead: function(){
        this._headArray = [];
        var tableInfoData = hhdz_data.getTableInfoData();
        if(tableInfoData == undefined){
            return;
        }
        var tablePlayer = tableInfoData.tablePlayer;
        if(tablePlayer == undefined || tablePlayer.length <= 0){
            return;
        }

        var show = false;
        for(var i = 0;i < tablePlayer.length;i++){
            var parent = cc.find('headNode_'+i, this.HeadLayer);
            if(parent == undefined){
                continue;
            }
            show = false;
            var playerData = tablePlayer[i];
            if(playerData){
                var headNode = parent.getChildByName('uiHead');
                if(headNode == undefined){
                    headNode = cc.instantiate(this.UIHead);
                    headNode.parent = parent;
                    headNode.name = 'uiHead';
                }
                var template = headNode.getComponent('hhdz_head');
                if(template){
                    template.setPlayerData(playerData);
                }
                show = true;

                this._headArray.push(headNode);
            }
            parent.active = show;
        }
    },

    getHeadPositionByUId: function(uid){
        for(var i = 0; i < this._headArray.length; i++){
            var headNode = this._headArray[i];
            if(headNode == undefined){
                continue;
            }
            var template = headNode.getComponent('hhdz_head');
            if(template == undefined){
                continue;
            }
            if(template._player == undefined){
                continue;
            }
            if(template._player.uid != uid){
                continue;
            }
            return headNode.parent.position;
        }
        return null;
    },

    getSelfHeadPosition: function(){
        var parent = cc.find('headNode_self', this.HeadLayer);
        if(parent){
            return parent.position;
        }
        return null;
    }
});