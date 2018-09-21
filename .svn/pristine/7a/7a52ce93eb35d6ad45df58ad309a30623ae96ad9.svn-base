cc.Class({
    extends: cc.Component,

    properties: {
        bgImg: cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {
        this.isShow = true; // 是否需要显示
        this.isTurn = false; // 是否已经翻开
        this.cardInfo = null;
    },

    initCardInfo : function (cardInfo) {
        this.cardInfo = cardInfo;
        this.updateUI();
    },

    updateUI : function () {
        var imgName = this.getSpriteNameByCardId();
        var strImgName = imgName + ".png";
        var texture = cc.textureCache.addImage(cc.url.raw("resources/niuNiuTable/poker/" + strImgName));
        this.bgImg.spriteFrame = new cc.SpriteFrame(texture);
    },
    initUI: function () {
        var texture = cc.textureCache.addImage(cc.url.raw("resources/niuNiuTable/poker/0.png"));
        this.bgImg.spriteFrame = new cc.SpriteFrame(texture);
    },
    clearCardsUI: function () {
        this.bgImg.spriteFrame = null;
    },
    turnOver: function (isTurn) {
        if (isTurn === undefined) {
            isTurn = true;
        }
        this.isTurn = isTurn;
        this.updateUI();
    },

    /**
     *  suit : 0 方块 1 梅花 2 红桃 3 黑桃
     *  index : 0 ~ 12
     */
    getSpriteNameByCardId : function () {
        if (!this.cardInfo) {

            return 0+"";
        }
        if (!this.isTurn) {

            return 0+"";
        }
        var suitType = parseInt(this.cardInfo/100);
        var baseNum = (suitType-1) * 16;
        var cardNum = this.cardInfo-suitType*100;
        return (cardNum + baseNum) + "";
    },

    showTipAction: function () {
      this.node.runAction(cc.moveBy(0.2, cc.p(0,60)));
    },
});
