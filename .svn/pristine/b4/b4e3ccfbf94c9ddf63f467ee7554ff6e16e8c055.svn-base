var configMgr = require('configMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        gongzhonghao: cc.Label,
    },

    onLoad: function () {
        this.showNumLabel();
    },
    showNumLabel : function () {

        var WXConfig = configMgr.getAgentWeChat();
        if (!WXConfig) return;
        this.gongzhonghao.string = WXConfig.accounts.number;
    },
    close: function () {
        closeView(this.node.name);
    }
});
