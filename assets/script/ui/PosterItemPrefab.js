cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },
    setImg: function (img) {
        if (img){
            var iconUrl = 'resources/zjh/UI/artword/artword_' + img + '.png';
            var texture = cc.textureCache.addImage(cc.url.raw(iconUrl));
            this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        }
    }
});
