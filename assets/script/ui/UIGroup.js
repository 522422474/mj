var soundMngr = require('SoundMngr');
var RoomHandler = require('roomHandler');
var matchHandler = require('matchHandler');
var gameDefine = require('gameDefine');
var configMgr = require('configMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        create_btn: cc.Button,
        join_btn: cc.Button,
        back_btn: cc.Button
    },

    onLoad: function () {
        //创建和进入按钮控制
        this.refreshCreateOrBackBtn();
        require('util').registEvent('onRoomClose', this, this.refreshCreateOrBackBtn);
    },
    onEnable: function () {
    },
    onDestroy: function () {
        unrequire('util').registEvent('onRoomClose', this, this.refreshCreateOrBackBtn);
    },

    refreshCreateOrBackBtn: function () {
        if (GameData.roomClose) {
            GameData.player.roomid = undefined;
        }
        if (GameData.player.roomid == undefined || GameData.player.roomid == 0) {
            this.create_btn.node.active = true;
            this.back_btn.node.active = false;
        } else {
            this.create_btn.node.active = false;
            this.back_btn.node.active = true;
        }
    },
    loadSpriteImg: function(sprite, imgUrl){
        if (sprite == undefined || imgUrl == undefined || imgUrl.length <= 0) {
            return;
        }
        var texture = cc.textureCache.addImage(cc.url.raw(imgUrl));
        if(texture){
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        }
    },

    createBtnClicked: function (evt) {
        if (inCD(1000)) {
            return;
        }
        soundMngr.instance.playAudioOther('button');
        openView('UICreate');
        // this.layer_create.on(cc.Node.EventType.TOUCH_START, function (evt) {
        //     evt.stopPropagation();
        // });
    },
    backBtnClicked: function (evt) {
        soundMngr.instance.playAudioOther('button');
        RoomHandler.enterRoom(GameData.player.roomid);
        this.refreshCreateOrBackBtn();
    },
    joinBtnClicked: function (evt) {
        if (inCD(1000)) {
            return;
        }
        soundMngr.instance.playAudioOther('button');
        if (GameData.player.roomid == undefined || GameData.player.roomid <= 0) {
            openView('UIJoin');
        } else {
            createMessageBox('您已在房间中,不能加入别的房间,是否返回房间?',
                function () {
                    RoomHandler.enterRoom(GameData.player.roomid);
                },
                function () {}
            );
        }
        // this.layer_join.on(cc.Node.EventType.TOUCH_START, function (evt) {
        //     evt.stopPropagation();
        // });
    }
});