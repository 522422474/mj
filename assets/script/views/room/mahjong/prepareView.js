var gameDefine = require('gameDefine');
var RoomHandler = require('roomHandler');

cc.Class({
    extends: cc.Component,

    properties: {
        handNode: cc.Node,
        readyNode: cc.Node
    },

    onLoad: function () {
        require('util').registEvent('onRoomInfo', this, this.updatePlayerReady);
        require('util').registEvent('onPrepareInfo', this, this.updatePlayerReady);
    },

    onDestroy: function () {
        unrequire('util').registEvent('onRoomInfo', this, this.updatePlayerReady);
        unrequire('util').registEvent('onPrepareInfo', this, this.updatePlayerReady);
    },

    onEnable: function () {
        this.updatePlayerReady();
    },

    updatePlayerReady: function() {
        var posList = ['left', 'right', 'up', 'down'];
        for(var i = 0; i < posList.length; i++){
            this.showReadyIcon(posList[i], false, false);
        }

        var readyData = RoomHandler.getRoomReadyData();
        for (var uid in readyData) {
            var ready1 = !readyData[uid],
                ready2 = readyData[uid],
                direction = GameData.getPlayerPosByUid(uid);
            this.showReadyIcon(direction, ready2, ready1);
        }
    },

    showReadyIcon: function (direction, showHand, showReading) {
        var readyHand = cc.find(direction, this.handNode);
        if (readyHand) readyHand.active = showHand;

        var readying = cc.find(direction, this.readyNode);
        if (readying) readying.active = showReading;
    }
});