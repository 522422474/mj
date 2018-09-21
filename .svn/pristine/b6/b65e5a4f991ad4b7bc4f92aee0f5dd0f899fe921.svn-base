var MahjongData = function() {
    this.cards = {};
    this.game = {
        roundType: 0,
        roundNum: 0,
        roundmax: 0,
        zhuangUid: 0,
        cardleft: 0,
        turn: 0,
        wildcard: [],
        lastdisUid: 0,
        lastdisCard: 0,
        winnerUid: 0,
        winnerType: 0,
        obtain: 0
    };
    this.passAction = {
        lastUid: 0,
        fromCard: 0,
        action: [],
        checkCards: []
    };
    this.actionType = false;   //是否为摸牌有操作（暗杠，补杠，自摸）
    this.actionEffect = {      //操作通知数据
        uid: null,
        card: null,
        action: null
    };
    this.scores = {};
};

module.exports = new MahjongData;

//获取数据
MahjongData.prototype.getGameInfoData = function(){
    return this.game;
};
MahjongData.prototype.getPlayerCards = function (uid) {
    this.cards[uid] == undefined ? this.cards[uid] = {} : null;
    return this.cards[uid];
};
MahjongData.prototype.getChiCards = function (uid) {
    this.cards[uid] == undefined ? this.cards[uid] = {} : null;
    return this.cards[uid]['chi'];
};
MahjongData.prototype.getPengCards = function (uid) {
    this.cards[uid] == undefined ? this.cards[uid] = {} : null;
    return this.cards[uid]['peng'];
};
MahjongData.prototype.getGangCards = function (uid) {
    this.cards[uid] == undefined ? this.cards[uid] = {} : null;
    return this.cards[uid]['gang'];
};
MahjongData.prototype.getHandCards = function (uid) {
    this.cards[uid] == undefined ? this.cards[uid] = {} : null;
    return this.cards[uid]['hand'];
};
MahjongData.prototype.getHandCardNum = function (uid) {
    this.cards[uid] == undefined ? this.cards[uid] = {} : null;
    return this.cards[uid]['handnum'];
};
MahjongData.prototype.getDisCards = function (uid) {
    this.cards[uid] == undefined ? this.cards[uid] = {} : null;
    return this.cards[uid]['dis'];
};
MahjongData.prototype.getPassActionsData = function () {
    return this.passAction;
};
MahjongData.prototype.getActionsType = function () {
    return this.actionType;
};
MahjongData.prototype.getActionEffectData = function(){
    return this.actionEffect;
};
MahjongData.prototype.getGameScoreData = function(){
    return this.scores;
};

//设置数据
MahjongData.prototype.onGameInfoSetData = function(data){
    if(data == undefined){
        return;
    }
    this.game.roundType = data.roundType;
    this.game.roundNum = data.roundNum;
    this.game.roundmax = data.roundmax;
    this.game.zhuangUid = data.zhuang;
    this.game.cardleft = data.cardleft;
    this.game.turn = data.turn;
    this.game.wildcard = data.wildcard;
    this.game.lastdisUid = data.disuid;
    this.game.lastdisCard = data.discard;
};
MahjongData.prototype.onGameStartSetData = function(data){
    if(data == undefined){
        return;
    }
    this.game.gameStart = true;
    this.passAction.lastUid = 0;
    this.passAction.fromCard = 0;
    this.passAction.action = [];
    this.passAction.checkCards = [];
};
MahjongData.prototype.onGameScoreSetData = function(data){
    if(data == undefined){
        return;
    }
    this.scores = data;
    this.game.gameStart = false;
};
MahjongData.prototype.onGamePassSetData = function(data){
    if(data == undefined){
        return;
    }
    this.passAction.lastUid = data.uid;
    this.passAction.fromCard = data.card;
    this.passAction.action = data.act;
    this.actionType = false;
};
MahjongData.prototype.onGameActionSetData = function(data){
    if(data == undefined){
        return;
    }
    this.passAction.action = data.act;
    this.actionType = true;
};
MahjongData.prototype.initCardHandSetData = function(data){
    if(data == undefined){
        return;
    }
    this.cards[data.uid] == undefined ? this.cards[data.uid] = {} : null;
    this.cards[data.uid]['hand'] = data.hand;
    this.game.obtain = data.obtain;
};
MahjongData.prototype.initCardHandNumSetData = function(data){
    if(data == undefined){
        return;
    }
    this.cards[data.uid] == undefined ? this.cards[data.uid] = {} : null;
    this.cards[data.uid]['handnum'] = data.num;
};
MahjongData.prototype.initCardChiSetData = function(data){
    if(data == undefined){
        return;
    }
    this.cards[data.uid] == undefined ? this.cards[data.uid] = {} : null;
    this.cards[data.uid]['chi'] = data.chi;
};
MahjongData.prototype.initCardPengSetData = function(data){
    if(data == undefined){
        return;
    }
    this.cards[data.uid] == undefined ? this.cards[data.uid] = {} : null;
    this.cards[data.uid]['peng'] = data.peng;
};
MahjongData.prototype.initCardGangSetData = function(data){
    if(data == undefined){
        return;
    }
    this.cards[data.uid] == undefined ? this.cards[data.uid] = {} : null;
    this.cards[data.uid]['gang'] = data.gang;
};
MahjongData.prototype.initCardDisSetData = function(data){
    if(data == undefined){
        return;
    }
    this.cards[data.uid] == undefined ? this.cards[data.uid] = {} : null;
    this.cards[data.uid]['dis'] = data.dis;
};
MahjongData.prototype.setActionEffect = function(action, data){
    if(action == undefined || data == undefined){
        return;
    }
    this.actionEffect.uid = data.player;
    this.actionEffect.card = data.card;
    this.actionEffect.action = action;
};
MahjongData.prototype.onCardDisSetData = function(data){
    this.setActionEffect('dis', data);
};
MahjongData.prototype.onCardChiSetData = function(data){
    this.setActionEffect('chi', data);
};
MahjongData.prototype.onCardPengSetData = function(data){
    this.setActionEffect('peng', data);
};
MahjongData.prototype.onCardGangMingSetData = function(data){
    this.setActionEffect('gang', data);
};
MahjongData.prototype.onCardGangAnSetData = function(data){
    this.setActionEffect('gang', data);
};
MahjongData.prototype.onCardGangBuSetData = function(data){
    this.setActionEffect('gang', data);
};
MahjongData.prototype.onCardHuSetData = function(data){
    this.setActionEffect('hu', data);
};
