var game = require('gameConfig');
var gameDefine = require('gameDefine');
var RoomHandler = require('roomHandler');

cc.Class({
    extends: cc.Component,

    properties: {
        deleteRoomBtn: cc.Node,
        quitRoomBtn: cc.Node
    },

    onLoad: function () {
        require('util').registEvent('onCreatorQuit', this, this.onCreatorQuit);
    },
    
    onDestroy: function () {
        unrequire('util').registEvent('onCreatorQuit', this, this.onCreatorQuit);
    },

    onEnable: function(){
        scheduleLamp(this);

        var roomData = RoomHandler.getRoomData();
        if (roomData.status == gameDefine.RoomState.WAIT) {
            RoomHandler.setReady();
        }
    },

    setUIBaseInfo: function () {
        var roomData = RoomHandler.getRoomData();
        var isCreator = roomData.creator == GameData.player.uid;
        this.deleteRoomBtn.active = isCreator;
        //this.quitRoomBtn.active = !isCreator;
    },
    backBtnClicked: function () {
        var roomData = RoomHandler.getRoomData();
        if (roomData.creator == GameData.player.uid) {
            cc.director.loadScene('home');
        } else {
            RoomHandler.quitRoom(roomData.id);
        }
    },
    wxInviteBtnClicked: function () {
        var roomData = RoomHandler.getRoomData();
        if (roomData == undefined) return;

        var gameName = game.getName();
        var title = (roomData.opts.costType == gameDefine.CostType.Cost_Agent) ? 
                    (gameName + "(代开)" + "房间号:" + roomData.id) : 
                    (gameName + "房间号:" + roomData.id);
        var des = this.getInviteStr();
        wxShareText(title, des);
    },
    getInviteStr: function () {
        var str1 = "玩法:";
        var str2 = ",请您快速加入对局.";
        var playStr = game.getRuleStr();
        return str1 + playStr + str2;
    },
    onDeleteRoom: function () {
        createMessageBox('解散房间不扣房卡，是否确定解散？', function () {
            var roomData = RoomHandler.getRoomData();
            RoomHandler.deleteRoom(roomData.id, 'close');
        }, function () {});
    },
    onQuitRoom: function () {
        var roomData = RoomHandler.getRoomData();
        if (roomData.creator == GameData.player.uid) {
            cc.director.loadScene('home');
        } else {
            RoomHandler.quitRoom(roomData.id);
        }
    },
    onCreatorQuit: function () {
        var roomData = RoomHandler.getRoomData();
        if (roomData == undefined) return;

        GameData.player.roomid = undefined;
        if (roomData.creator != GameData.player.uid) {
            createMessageBox('房主已经解散房间', function () {
                cc.director.loadScene('home');
            });
        } else {
            cc.director.loadScene('home');
        }
    },
    //复制房间号
    onCopyRoomInfo: function () {
        var roomData = RoomHandler.getRoomData();
        if (roomData == undefined) return;

        var gameName = game.getName();
        var title = gameName + "房间号:" + roomData.id + ",";
        var des = this.getInviteStr();
        wxShareCommond(title + des);
    }
});