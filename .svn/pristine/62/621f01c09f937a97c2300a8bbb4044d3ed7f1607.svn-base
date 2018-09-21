var gameDefine = require('gameDefine');
var errorCode = require('errorCode');

var topHandler = {

};

module.exports = topHandler;

topHandler.getCoinTopList = function() {
    GameNet.getInstance().request("game.topHandler.getCoinlist", null, function (rtn) {
        if(rtn){
            sendEvent('updateCoinTopList', rtn);
        }
    });
};