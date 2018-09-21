var roomUtil = require('roomUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel: cc.Label
    },

    onEnable: function () {
        this.showTime();
        this.schedule(this.showTime, 1);
    },

    showTime: function () {
        this.timeLabel.string = roomUtil.getTimeString();
    }
});