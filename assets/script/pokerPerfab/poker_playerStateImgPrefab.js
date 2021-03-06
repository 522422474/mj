cc.Class({
    extends: cc.Component,

    properties: {
        stateImg: cc.Sprite
    },

    // use this for initialization
    onLoad: function () {

    },
    setImg: function(type,scale,posY) {
        if (type){
            var iconUrl = 'resources/zjh/UI/artword/artword_' + type + '.png';
            var texture = cc.textureCache.addImage(cc.url.raw(iconUrl));
            this.stateImg.spriteFrame = new cc.SpriteFrame(texture);
        }
        if (scale){
            this.stateImg.node.scale = scale;
        }
        if (posY) {
            this.stateImg.node.y = posY;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
