var soundMngr = require('SoundMngr');
var RoomHandler = require('roomHandler');
var matchHandler = require('matchHandler');
var gameDefine = require('gameDefine');
var configMgr = require('configMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        layer_join: cc.Node,
        room_number: cc.String
    },

    onLoad: function () {
        this.resetNumber();
    },
    onEnable: function () {
    },
    onDestroy: function () {
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

    enterNumber: function (evt, data) {
        soundMngr.instance.playAudioOther('button');
        if (this.room_number.length < 6) {
            this.room_number += data;
            this.showNumber();
            if (this.room_number.length >= 6) {
                RoomHandler.enterRoom(this.room_number);
            }
        }
    },

    deleteNumber: function (evt) {
        soundMngr.instance.playAudioOther('button');
        this.room_number = this.room_number.substring(0, this.room_number.length - 1);
        this.showNumber();
    },

    resetNumber: function (evt) {
        if(evt){
            soundMngr.instance.playAudioOther('button');
        }
        this.room_number = '';
        this.showNumber();
    },

    showNumber: function () {
        for (var i = 1; i <= this.room_number.length; i++) {
            var number = this.room_number.substr(i - 1, 1);
            var sprite = cc.find('panel/enter_number/room_number/number' + i, this.layer_join);
            sprite.getComponent("cc.Label").string = number;
            sprite.active = true;
        }
        for (var i = 6; i > this.room_number.length; i--) {
            var node = cc.find('panel/enter_number/room_number/number' + i, this.layer_join);
            node.active = false;
        }
    },

    enterRoom: function (evt) {
        soundMngr.instance.playAudioOther('button');
        if (this.room_number !== '') {
            RoomHandler.enterRoom(this.room_number);
        }
    },

    backToHome: function (evt) {
        soundMngr.instance.playAudioOther('button');
        this.layer_join.active = false;
    }
});