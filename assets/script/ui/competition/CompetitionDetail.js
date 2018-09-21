var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
cc.Class({
    extends: cc.Component,

    properties: {
       gameName: cc.Label,

    },

    // use this for initialization
    onLoad: function () {

    },
    initUI: function (GameType) {
      this.gameName.string = this.getGameName(GameType);
    },
    close : function () {
        closeView(this.node.name);
    },
    getGameName: function (GameType) {
        var config = configMgr.getServerConfig();
        var nameStr = '';
        nameStr = config['fight'][GameType].name;
        return nameStr;
    }
});
