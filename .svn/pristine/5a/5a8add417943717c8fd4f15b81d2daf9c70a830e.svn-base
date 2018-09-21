var RoomHandler = require('roomHandler');
cc.Class({
    extends: cc.Component,

    properties: {
        tipsSp: cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {

    },
    
    showBackUI:function (type) {
        var url = '';
        if (type == 'zhuang') {
            url = cc.textureCache.addImage(cc.url.raw('resources/hundredNiuNiu/uiResources/panelUI/backHome/bg_zaiwanyihui_wenzi2.png'));
        } else if (type == 'xian') {
            url = cc.textureCache.addImage(cc.url.raw('resources/hundredNiuNiu/uiResources/panelUI/backHome/bg_zaiwanyihui_wenzi3.png'));
        }
        this.tipsSp.spriteFrame = new cc.SpriteFrame(url);
    },

    quitRoom: function () {
        RoomHandler.quitRoom(RoomHandler.room.id);
    },

    closePanel: function () {
        closeView(this.node.name);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
