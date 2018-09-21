var gameDefine = require('gameDefine');
var RoomHandler = require('roomHandler');
var gameHandler = require('hongzhongData');
var roomUtil = require('roomUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        deleteRoomBtn: cc.Node,
        quitRoomBtn: cc.Node
    },

    onLoad: function () {
    },
    onDestroy: function () {
    },

    onEnable: function () {

        //设置基本界面显示
        this.setUIBaseInfo();
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
        var title = "红中麻将 " + "房间号:" + roomData.id;
        if (roomData.opts.costType == 4) {
            title = "红中麻将 " + "(代开)" + "房间号:" + roomData.id;
        }
        var des = this.getInviteStr();
        // wxShareWeb(title, des);
        wxShareText(title, des);
    },
    getInviteStr: function () {
        var roomData = RoomHandler.getRoomData();
        var str1 = "玩法:";
        var str2 = ",请您快速加入对局.";
        var playStr = getRuleStrHongZhong(roomData.opts);
        return str1 + playStr + str2;
    },
    onShareResult: function () {
        wxShareTimeline("红中麻将", "还等嘛!我在红中麻将等你!");
    },
    onShareFriend: function () {
        wxShareWeb("红中麻将", "还等嘛!我在红中麻将等你!");
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
    //复制房间号
    onCopyRoomInfo: function () {
        var roomData = RoomHandler.getRoomData();
        var title = "红中麻将," + "房间号:" + roomData.id + ",";
        var des = this.getInviteStr();
        wxShareCommond(title + des);
    },
});
