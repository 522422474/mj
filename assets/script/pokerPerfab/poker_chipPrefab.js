cc.Class({
    extends: cc.Component,

    properties: {
        chipSp: cc.Sprite
    },

    // use this for initialization
    onLoad: function () {

    },
    setChipImg: function (num) {
        if (num) {
            var iconUrl = 'resources/zjh/UI/img/chip/chip_x_' + num + '.png';
            var texture = cc.textureCache.addImage(cc.url.raw(iconUrl));
            this.chipSp.spriteFrame = new cc.SpriteFrame(texture);
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
