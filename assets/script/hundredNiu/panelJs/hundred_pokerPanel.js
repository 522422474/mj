cc.Class({
    extends: cc.Component,

    properties: {
        chipSp: cc.Sprite,
    },
    onLoad: function () {

    },
    setChipImg: function (num) {
        if (num) {
            var iconUrl = 'resources/hundredNiuNiu/uiResources/table/chips/x_' + num + '.png';
            var texture = cc.textureCache.addImage(cc.url.raw(iconUrl));
            this.chipSp.spriteFrame = new cc.SpriteFrame(texture);
        }
    }
});
