var game = require('gameConfig');
var errorCode = require('errorCode');

var MahjongProtocol = module.exports;

MahjongProtocol.requestDisCard = function (card, callback) {
    GameNet.getInstance().request("room.hzhmjHandler.discard", {card: card}, function (rtn) {
        cc.log('room.hzhmjHandler.discard:%d', rtn.result);
        callback(rtn);
    });
};
MahjongProtocol.requestPass = function (callback) {
    GameNet.getInstance().request("room.hzhmjHandler.pass", {}, function (rtn) {
        cc.log('room.hzhmjHandler.pass response:%d', rtn.result);
        if (rtn.result == errorCode.Fail) {
            createMoveMessage('请等待其他玩家选择');
        }
        callback(rtn);
    });
};
MahjongProtocol.requestChiCard = function (actionData, callback) {
    GameNet.getInstance().request("room.hzhmjHandler.chi", {cards: actionData.cards}, function (rtn) {
        cc.log('room.hzhmjHandler.chi response:%d', rtn.result);
        callback(rtn);
    });
};
MahjongProtocol.requestPengCard = function (actionData, callback) {
    GameNet.getInstance().request("room.hzhmjHandler.peng", {}, function (rtn) {
        cc.log('room.hzhmjHandler.peng response:%d', rtn.result);
        callback(rtn);
    });
};
MahjongProtocol.requestAnGangCard = function (actionData, callback) {
    GameNet.getInstance().request("room.hzhmjHandler.gangAn", {card: actionData.cards}, function (rtn) {
        cc.log('room.hzhmjHandler.gangAn response:%d', rtn.result);
        callback(rtn);
    });
};
MahjongProtocol.requestMingGangCard = function (actionData, callback) {
    GameNet.getInstance().request("room.hzhmjHandler.gangMing", {}, function (rtn) {
        cc.log('room.hzhmjHandler.gangMing response:%d', rtn.result);
        callback(rtn);
    });
};
MahjongProtocol.requestBuGangCard = function (actionData, callback) {
    GameNet.getInstance().request("room.hzhmjHandler.gangBu", {card: actionData.cards}, function (rtn) {
        cc.log('room.hzhmjHandler.gangBu response:%d', rtn.result);
        callback(rtn);
    });
};
MahjongProtocol.requestDianPao = function (actionData, callback) {
    GameNet.getInstance().request("room.hzhmjHandler.dianPao", {}, function (rtn) {
        cc.log('room.hzhmjHandler.dianPao response:%d', rtn.result);
        callback(rtn);
    });
};
MahjongProtocol.requestHu = function (actionData, callback) {
    GameNet.getInstance().request("room.hzhmjHandler.hu", {}, function (rtn) {
        cc.log('room.hzhmjHandler.hu response:%d', rtn.result);
        callback(rtn);
    });
};

MahjongProtocol.registMessage = function() {
    GameNet.getInstance().setCallBack('hzhmj-onGameInfo', function (data) {
        game.getGameData().onGameInfoSetData(data);
        sendEvent('onGameInfo', data);
        sendEvent('onGameTurn');
        sendEvent('updateCards');
    });
    GameNet.getInstance().setCallBack('hzhmj-initCardHand', function (data) {
        game.getGameData().initCardHandSetData(data);
        sendEvent('initCardHand', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-initCardHandNum', function (data) {
        game.getGameData().initCardHandNumSetData(data);
        sendEvent('initCardHandNum', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-initCardChi', function (data) {
        game.getGameData().initCardChiSetData(data);
        sendEvent('initCardChi', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-initCardPeng', function (data) {
        game.getGameData().initCardPengSetData(data);
        sendEvent('initCardPeng', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-initCardGang', function (data) {
        game.getGameData().initCardGangSetData(data);
        sendEvent('initCardGang', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-initCardDis', function (data) {
        game.getGameData().initCardDisSetData(data);
        sendEvent('initCardDis', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onGamePass', function (data) {
        game.getGameData().onGamePassSetData(data);
        sendEvent('onGamePass', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onGameAction', function (data) {
        game.getGameData().onGameActionSetData(data);
        sendEvent('onGameAction', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onCardDis', function (data) {
        game.getGameData().setActionEffect('dis', data);
        sendEvent('onCardDis', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onCardChi', function (data) {
        game.getGameData().setActionEffect('chi', data);
        sendEvent('onCardChi', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onCardPeng', function (data) {
        game.getGameData().setActionEffect('peng', data);
        sendEvent('onCardPeng', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onCardGangAn', function (data) {
        game.getGameData().setActionEffect('gang', data);
        sendEvent('onCardGangAn', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onCardGangMing', function (data) {
        game.getGameData().setActionEffect('gang', data);
        sendEvent('onCardGangMing', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onCardGangBu', function (data) {
        game.getGameData().setActionEffect('gang', data);
        sendEvent('onCardGangBu', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onCardHu', function (data) {
        game.getGameData().setActionEffect('hu', data);
        sendEvent('onCardHu', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onGameStart', function (data) {
        game.getGameData().onGameStartSetData(data);
        sendEvent('onGameStart', data);
    });
    GameNet.getInstance().setCallBack('hzhmj-onGameScore', function (data) {
        game.getGameData().onGameScoreSetData(data);
        sendEvent('onGameScore', data);
    });
};
