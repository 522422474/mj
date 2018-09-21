var game = require('gameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        roomRule: cc.Label,
    },

    onEnable: function () {
        this.showRoomRule();
    },

    showRoomRule: function() {
        this.roomRule.string = game.getRuleStr();
    }
});