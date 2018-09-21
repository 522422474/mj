cc.Class({
    extends: cc.Component,

    properties: {
        xingSp: cc.Node,
        xingAnim: cc.Node,
    },

    onLoad: function () {
        this.xingSp.active = false;
        this.xingAnim.active = false;
    },
    playXingAnimation: function () {
        this.xingAnim.active = true;
        var anim = this.xingAnim.getComponent(dragonBones.ArmatureDisplay);
        anim.playAnimation('newAnimation',1);
        var self = this;
        this.scheduleOnce(function(){
            self.xingAnim.active = false;
            self.xingSp.active = true;
        },1.5);
    },

    cliskShowTips: function () {
        niuniuCreateMoveMessage('神算子已在该区域下注');
    },
});
