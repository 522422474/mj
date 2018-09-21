var gameDefine = require('gameDefine');
var configMgr = require('configMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        editCards: cc.EditBox,
        wildCards: cc.EditBox,
    },

    onClose: function() {
        this.node.active = false;
    },

    onSetCards: function () {
        var str = this.editCards.string.split(',');
        var cards = [];
        for (var i = 0; i < str.length; i++) {
            cards.push(parseInt(str[i]));
        }
        var data = {
            roomid: GameData.room.id,
            cards: cards
        };
        GameNet.getInstance().request("game.debugHandler.setCards", data, function (rtn) {
            cc.log('debug rtn: ', JSON.stringify(rtn));
        });
    },

    onSetWildcard: function () {
        var str = this.wildCards.string;
        var data = {
            roomid: GameData.room.id,
            cards: parseInt(str)
        };
        GameNet.getInstance().request("game.debugHandler.setWildCards", data, function (rtn) {});
    },
    
});