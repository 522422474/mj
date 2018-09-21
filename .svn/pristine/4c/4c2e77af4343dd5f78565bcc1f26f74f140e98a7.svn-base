var roomUtil = require('roomUtil');
var roomHandler = require('roomHandler');

cc.Class({
    extends: cc.Component,

    properties: {
        roomNum: cc.Label
    },

    onLoad: function () {

    },

    onDestroy: function () {

    },

    onEnable: function () {
        this.showRoomNum();
    },

    showRoomNum: function () {
        var roomData = roomHandler.getRoomData();
        if (roomData == null) return;

        this.roomNum.string = roomUtil.getRoomString(roomData.id);
    }
});