var game = require('gameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        wildCard: cc.Sprite,
        wildIcon: cc.Sprite,
    },

    onLoad: function () {

    },

    onDestroy: function () {

    },

    onEnable: function () {
        var wildCards = game.getGameData().game.wildcard;
        if (wildCards.length > 0) {
            var texture = cc.textureCache.addImage(cc.url.raw('resources/mjcard2d/mj_face_xia_shou_' + wildCards[0] + '.png'));
            this.wildCard.spriteFrame = new cc.SpriteFrame(texture);
        }

        var wildIconUrl = game.getWildIcon();
        if (wildIconUrl != '') {
            var texture = cc.textureCache.addImage(cc.url.raw(wildIconUrl));
            this.wildIcon.spriteFrame = new cc.SpriteFrame(texture);
        }
    }
});