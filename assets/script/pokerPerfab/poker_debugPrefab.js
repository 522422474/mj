var configMgr = require('configMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        editCards:cc.EditBox,
        debugBtn :cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var setCardsOpen = configMgr.getSetCardsOpen();
        var debugBtn = cc.find('debugBtn',this.node.parent);
        if (debugBtn) {
            debugBtn.active = setCardsOpen;//!cc.sys.isNative;
        }
    },

    /**
     *
     */
    onOkBtnClick: function () {
        var str = this.editCards.string.split(',');
        var cards = [];
        for (var i=0; i<str.length; i++) {
            cards.push(parseInt(str[i]));
        }
        var data = {roomid: GameData.room.id, cards: cards};
        GameNet.getInstance().request("game.debugHandler.setCards", data, function(rtn) {});
    },
    close: function() {
        this.node.active = false;
    }
});
