var soundMngr = require('SoundMngr');
var RoomHandler = require('roomHandler');
var matchHandler = require('matchHandler');
var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
var errorCode = require('errorCode');

cc.Class({
    extends: cc.Component,

    properties: {
        getPanel: cc.Node,
        goToPanel: cc.Node,

        timeNode: cc.Node,
        getBtnNode: cc.Node
    },

    onLoad: function () {

    },
    onDestroy: function () {

    },
    onEnable: function () {
        this.initUIPanel();
    },

    showUIPanel: function(show){
        this.getPanel.active = show;
        this.goToPanel.active = !show;
    },
    initUIPanel: function(){
        cc.log('..benefitCount:'+GameData.player.benefitCount);
        GameData.player.benefitCount == undefined ? GameData.player.benefitCount = 2 : null;
        this.timeNode.getComponent(cc.Label).string = '每天可领取'+(2 - GameData.player.benefitCount)+'/2次';
    },

    getBtnClick: function(event){
        soundMngr.instance.playAudioOther('button');
        GameNet.getInstance().request("game.playerHandler.getBenefitCoin", null, function(rtn) {});
        this.onClose();
        createMoveMessage('领取成功。');
    },
    goToBtnClick: function(event){
        soundMngr.instance.playAudioOther('button');
        var fun = function(panel){
            if(panel){
                var template = panel.getComponent('shoppingPanel');
                if(template){
                    template.showPanel(2);
                }
            }
        };
        openView("shoppingPanel", undefined, fun);
        this.onClose();
    },

    onClose: function(event){
        soundMngr.instance.playAudioOther('button');
        closeView(this.node.name);
    }
});