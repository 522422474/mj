var stateMachine = require('stateMachine');
var hhdz_roomUtil = require('hhdz_roomUtil');
var hhdz_data = require('hhdz_data');

cc.Class({
    extends: stateMachine,

    properties: {

    },

    onLoad: function () {
        require('util').registEvent('rbw-roomStatus', this, this.setRoomStatus);
    },

    onDestroy: function () {
        unrequire('util').registEvent('rbw-roomStatus', this, this.setRoomStatus);
    },

    onEnable: function () {
    },

    setRoomStatus: function(){
        var roomStatus = hhdz_data.getRoomStatus();
        if(roomStatus == undefined){
            return;
        }

    },

});