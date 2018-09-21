var niuNiuHandler = require('niuNiuHandler');
var niuniuPokerHandler = require('niuniuPokerHandler');
cc.Class({
    extends: cc.Component,

    properties: {
        maskBg: cc.Sprite,
        actNode: cc.Node,
        skeNode: cc.Node,
        effectAc: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.actNode.active = false;
        this.skeNode.active = false;
        this.effectAc.active = false;
        this._fanInfo = null;
        this.niuniuPokerType = niuniuPokerHandler.getPokerType();
    },

    initFanInfo : function (data, type) {
        cc.log('data = '+data);
        // 1 设置纹理
        if (data == null) {
            return;
        }
        this._fanInfo = data;
        if (this._fanInfo == this.niuniuPokerType.NIU_Little && type == 0) {
            // 如果是小牛牛
            var adsp = this.skeNode.getComponent(dragonBones.ArmatureDisplay);
            adsp.playAnimation("newAnimation",-1);
            this.skeNode.parent.active = true;
            this.skeNode.active = true;
        }else {

            var self = this;
            var iconUrl;
            if (type == 0) {
                iconUrl = cc.url.raw("resources/niuNiuTable/pokerType/"+ this._fanInfo +".png");
            } else if (type == 1) {
                iconUrl = cc.url.raw("resources/hundredNiuNiu/uiResources/table/pokerType/"+ this._fanInfo +".png");
            }
            cc.loader.load(iconUrl, function (error, texture) {
                if (!error && texture) {
                    self.actNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    self.actNode.getComponent(cc.Animation).play('niuNiuPokerTypeAnimation');
                }
            });
            self.actNode.active = true;
        }
    },
    //翻牌动作
    pokerTypeAnim: function () {
        this.actNode.scaleX = 0.5;
        this.actNode.scaleY = 0.5;
        var action1 = cc.scaleTo(0.17, 1.1, 1.1);
        var action2 = cc.scaleTo(0.1, 1, 1);
        this.actNode.runAction(cc.sequence(action1, action2));
    },
    //特殊牌型特效
    pokerAnimation: function () {
        this.effectAc.parent.active = true;
        this.effectAc.active = true;
        var anim = this.effectAc.getComponent(dragonBones.ArmatureDisplay);
        anim.playAnimation('newAnimation',1);
        var self = this;
        this.scheduleOnce(function(){
            this.effectAc.active = false;
        },1.5);
    },
    changeMaskBg: function (data) {
        var url = '';
        if (data == null) {
            return;
        }else if (data > this.niuniuPokerType.NIU_NONE && data <= this.niuniuPokerType.NIU_NIU) {
            url = cc.url.raw("resources/hundredNiuNiu/uiResources/table/pokerType/mengban.png");
        } else {
            url = cc.url.raw("resources/hundredNiuNiu/uiResources/table/pokerType/mengban2.png");
        }
        var texture = cc.textureCache.addImage(url);
        this.maskBg.spriteFrame = new cc.SpriteFrame(texture);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
