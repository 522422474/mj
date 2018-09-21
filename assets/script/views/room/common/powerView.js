var roomUtil = require('roomUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        powerNode: cc.Node
    },

    onLoad: function () {
        require('util').registEvent('nativePower', this, this.showPower);
    },

    onDestroy: function () {
        unrequire('util').registEvent('nativePower', this, this.showPower);
    },

    onEnable: function () {
        this.schedule(roomUtil.getPower, 60);
    },

    showPower: function (percent) {
        this.powerNode.scaleX = percent.detail / 100;
    }
});