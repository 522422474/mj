var game = require('gameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onEnable: function () {
        this.showRuleTips();
    },

    showRuleTips: function() {
        var contentNode = cc.find('small/content', this.node);
        if (contentNode) {
            contentNode.getComponent(cc.Label).string = game.getRuleStr();

            var self = this;
            this.node.active = true;
            this.node.stopAllActions();
            this.node.runAction(cc.sequence(
                cc.moveTo(0.5, cc.p(0, 334)),
                cc.delayTime(10),
                cc.moveTo(0.5, cc.p(0, 434)),
                cc.callFunc(function() {
                    self.node.active = false;
                })
            ));
        }
    }
});