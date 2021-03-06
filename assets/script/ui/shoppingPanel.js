var shopConfig = require('shopConfig');
var gameDefine = require('gameDefine');
var soundMngr = require('SoundMngr');

cc.Class({
    extends: cc.Component,

    properties: {
        clickBtns: {
            default: [],
            type: [cc.Node]
        },
        panelViews: {
            default: [],
            type: [cc.Node]
        },
        leftArray: [],

        jifenStr: cc.Label,
        coinStr: cc.Label,
        commodityPrefab: cc.Prefab,

        jifenScollView: cc.ScrollView,
        cardScollView: cc.ScrollView,
        cashScollView: cc.ScrollView,
        coinScollView: cc.ScrollView,
    },
    onLoad: function () {
        this.initGoodsType();
        this.getLeftLenArray();
        require('util').registEvent('onPlayerUpdate', this, this.showNumber);
    },
    onEnable: function () {
        this.showPanel(1);
        this.showNumber();
    },
    onDestroy: function () {
        unrequire('util').registEvent('onPlayerUpdate', this, this.showNumber);
    },
    getLeftLenArray: function () {
        for (var key in shopConfig) {
            var data = shopConfig[key].costType;
            var isHave = contains(this.leftArray, data);
            if (!isHave) {
                this.leftArray.push(data);
            }
        }
    },
    clickShowView: function (evt) {
        soundMngr.instance.playAudioOther('button');
        this.showPanel(evt.target.name.split('_')[1]);
    },
    showPanel: function (index) {
        for (var i = 0; i < this.clickBtns.length; i++) {
            var btnNode = this.clickBtns[i];
            if (i < this.leftArray.length) {
                var btn = btnNode.getComponent(cc.Button);
                var tname = 'btn_' + index;
                if (btnNode.name == tname) {
                    btn.interactable = false;
                } else {
                    btn.interactable = true;
                }
                btnNode.active = true;    
            }else{
                btnNode.active = false;
            }
            
        }
        this.showView(index);
    },
    showView: function (index) {
        for (var i = 0; i < this.panelViews.length; i++) {
            var viewNode = this.panelViews[i];
            // var view = viewNode.getComponent(cc.Button);
            var vname = 'View_' + index;
            if (viewNode.name == vname) {
                viewNode.active = true;
            } else {
                viewNode.active = false;
            }
        }
    },
    initGoodsType: function () {
        for (var key in shopConfig) {
            var data = shopConfig[key];
            if (data.costType == gameDefine.shopCostType.Shop_Cost_Point) {
                //积分
                var jifenPrefsb = cc.instantiate(this.commodityPrefab);
                this.jifenScollView.content.addChild(jifenPrefsb);

                jifenPrefsb.getComponent('goodsType').getButtonId(key);
                jifenPrefsb.getComponent('goodsType').initUI(data);

                var childLen = this.jifenScollView.content.childrenCount - 1;
                jifenPrefsb.x = -354 + childLen % 4*230;
                jifenPrefsb.y = -98 - parseInt(childLen/4)*197;
                this.jifenScollView.content.height = parseInt(this.jifenScollView.content.childrenCount/4)*197;
                
            }else if (data.costType == gameDefine.shopCostType.Shop_Cost_Card) {
                //房卡
                var cardPrefsb = cc.instantiate(this.commodityPrefab);
                this.cardScollView.content.addChild(cardPrefsb);

                cardPrefsb.getComponent('goodsType').getButtonId(key);
                cardPrefsb.getComponent('goodsType').initUI(data);

                var childLen = this.cardScollView.content.childrenCount - 1;
                cardPrefsb.x = -354 + childLen % 4*230;
                cardPrefsb.y = -98 - parseInt(childLen/4)*197;
                this.cardScollView.content.height = parseInt(this.cardScollView.content.childrenCount/4)*197;

            }else if (data.costType == gameDefine.shopCostType.Shop_Cost_Cash) {
                //现金
                var cashPrefsb = cc.instantiate(this.commodityPrefab);
                this.cashScollView.content.addChild(cashPrefsb);

                cashPrefsb.getComponent('goodsType').getButtonId(key);
                cashPrefsb.getComponent('goodsType').initUI(data);

                var childLen = this.cashScollView.content.childrenCount - 1;
                cashPrefsb.x = -354 + childLen % 4*230;
                cashPrefsb.y = -98 - parseInt(childLen/4)*197;
                this.cashScollView.content.height = parseInt(this.cashScollView.content.childrenCount/4)*197;
                
            }else if (data.costType == gameDefine.shopCostType.Shop_Cost_Coin) {
                //金币
                var coinPrefsb = cc.instantiate(this.commodityPrefab);
                this.coinScollView.content.addChild(coinPrefsb);

                coinPrefsb.getComponent('goodsType').getButtonId(key);
                coinPrefsb.getComponent('goodsType').initUI(data);

                var childLen = this.coinScollView.content.childrenCount - 1;
                coinPrefsb.x = -354 + childLen % 4*230;
                coinPrefsb.y = -98 - parseInt(childLen/4)*197;
                this.coinScollView.content.height = parseInt(this.coinScollView.content.childrenCount/4)*197;
            }
        }
    },
    showNumber: function () {
        var jifenNum = 0;
        var coinNum = 0;
        if (GameData.player.point) {
            jifenNum = GameData.player.point;
        }
        if (GameData.player.coin) {
            coinNum = GameData.player.coin;
        }
        this.jifenStr.getComponent(cc.Label).string = ConversionCoinValue(jifenNum, 0);
        this.coinStr.getComponent(cc.Label).string = ConversionCoinValue(coinNum, 0);
    },

    closeNode: function () {
        soundMngr.instance.playAudioOther('button');
        closeView(this.node.name);
    }
});
