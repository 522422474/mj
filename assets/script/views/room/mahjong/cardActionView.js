var game = require('gameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        spineNode: cc.Node,
        actionLayer: cc.Node,
        actionSecondaryLayer: cc.Node,
    },

    onLoad: function () {
        require('util').registEvent('onGameStart', this, this.onEnable);
        require('util').registEvent('onGamePass', this, this.setActionData);
        require('util').registEvent('onGameAction', this, this.setActionData);
        require('util').registEvent('onCardChi', this, this.handleCardChi);
        require('util').registEvent('onCardPeng', this, this.handleCardPeng);
        require('util').registEvent('onCardGang', this, this.handleCardGang);
        require('util').registEvent('onCardHu', this, this.handleCardHu);
    },

    onDestroy: function () {
        unrequire('util').registEvent('onGameStart', this, this.onEnable);
        unrequire('util').registEvent('onGamePass', this, this.setActionData);
        unrequire('util').registEvent('onGameAction', this, this.setActionData);
        unrequire('util').registEvent('onCardChi', this, this.handleCardChi);
        unrequire('util').registEvent('onCardPeng', this, this.handleCardPeng);
        unrequire('util').registEvent('onCardGang', this, this.handleCardGang);
        unrequire('util').registEvent('onCardHu', this, this.handleCardHu);
    },

    onEnable: function () {
        this.actions = [];
        this.spineNode.active = false;
        this.setActionData();
    },

    setActionData: function() {
        this.actions = [];
        var actionsData = game.getGameData().getPassActionsData();
        var actionsNum = actionsData.action.length;
        var fromCard = actionsData.fromCard, lastType = '', lastIdx = -1;

        for (var i = 0; i < actionsNum; ++i) {
            var data = actionsData.action[i];
            var action = data.act, cards = data.cards;
            var actionCfg = game.getActionData(action);

            if (lastType != actionCfg.type) {
                lastType = actionCfg.type;
                this.actions[++lastIdx] = {type: actionCfg.type, actionData: []};
            }
            if (cards != null && cards[0] instanceof Array) {
                for (var n = 0; n < cards.length; ++n) {
                    this.actions[lastIdx].actionData.push({act:action, fromCard:fromCard, cards:cards[n]});
                }
            } else {
                this.actions[lastIdx].actionData.push(data);
            }
        }
        console.log('actions Data:' + JSON.stringify(this.actions));
        this.showActions();
    },

    showActions: function() {
        for (var n = 1; n <= 4; ++n) {
            if (n <= this.actions.length) {
                var data = this.actions[n-1];
                var actionCfg = game.getActionData(data.actionData[0].act);
                this.createActionBtn(n, actionCfg.icon);
            } else {
                var actionBtn = cc.find('btnAct'+n, this.actionLayer);
                actionBtn.active = false;
            }
        }
        this.actionLayer.active = (this.actions.length > 0);
    },

    showActionsSecondary: function () {
        var cardTemp = cc.find('card', this.actionSecondaryLayer);
        var cardLayout = cc.find('cardLayout', this.actionSecondaryLayer);

        cardLayout.removeAllChildren();
        this.actionSecondaryLayer.active = true;

        var actionsData = this.actions[this.selectAction].actionData;
        console.log('actions Secondary Data:' + JSON.stringify(actionsData));
        for (var i = 0; i < actionsData.length; i++) {
            var action = actionsData[i];
            var cardGroup = cc.instantiate(cardTemp);
            cardGroup.name = i + '';
            cardGroup.active = true;
            cardGroup.on(cc.Node.EventType.TOUCH_START, this.onClickActionSecondaryBtn, this);
            cardLayout.addChild(cardGroup);

            var cardArray = action.cards.concat(action.fromCard);
            cardArray.sort(function (a, b) {return a - b;});
            for (var n = 0; n < cardArray.length; n++) {
                var cardNode = cc.find('card_'+n, cardGroup);
                if (cardNode == null) continue;
                var iconUrl = 'resources/mjcard2d/mj_face_xia_shou_' + cardArray[n] + '.png';
                var texture = cc.textureCache.addImage(cc.url.raw(iconUrl));
                cardNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            }
        }
    },

    onBackToActionLayer: function () {
        this.actionLayer.active = true;
        this.actionSecondaryLayer.active = false;
    },

    onClickActionSecondaryBtn: function (e) {
        var self = this;
        var index = e.target.name;
        var data = this.actions[this.selectAction].actionData[index];
        console.log('actions Secondary Clicked Data:' + JSON.stringify(data));
        var actionInfo = game.getActionData(data.act);
        game.getGameProtocol()[actionInfo.request_fn](data, function (res) {
            if (res.result == 0) showSpineEffect(self.spineNode, actionInfo.spine, actionInfo.animate);
        });

        this.moveBackMyCards();
        this.actionSecondaryLayer.active = false;
    },

    createActionBtn: function (index, icon) {
        var actionNode = cc.find('btnAct' + index, this.actionLayer);
        var texture = cc.textureCache.addImage(cc.url.raw(icon));
        actionNode.getComponent('cc.Sprite').spriteFrame = new cc.SpriteFrame(texture);
        actionNode.active = true;
    },

    onBtnActionClicked: function (evt, index) {
        var self = this;
        var actionsData = this.actions[index].actionData;
        console.log('actions Clicked Data:' + JSON.stringify(actionsData));
        if (actionsData.length > 1) {
            this.selectAction = index;
            this.showActionsSecondary();
        } else if (actionsData.length == 1) {
            var data = actionsData[0];
            var actionInfo = game.getActionData(data.act);
            game.getGameProtocol()[actionInfo.request_fn](data, function (res) {
                if (res.result == 0) showSpineEffect(self.spineNode, actionInfo.spine, actionInfo.animate);
            });
        }

        this.moveBackMyCards();
        this.actionLayer.active = false;
    },

    onBtnPassClicked: function (evt) {
        if (game.getGameData().getGameInfoData().turn != GameData.player.uid) {
            game.getGameProtocol().requestPass(function (res) {});
        }
        this.moveBackMyCards();
        this.actionLayer.active = false;
        this.actionSecondaryLayer.active = false;
    },

    handleCardChi: function (data) {
        var uid = data.detail.player;
        if (uid == GameData.player.uid) return;
        var pos = GameData.getPlayerPosByUid(uid);
        this.playActionAnimation(pos, 'chi');
        console.log('playActionAnimation uid:%d %s chi', uid, pos);
    },

    handleCardPeng: function (data) {
        var uid = data.detail.player;
        if (uid == GameData.player.uid) return;
        var pos = GameData.getPlayerPosByUid(uid);
        this.playActionAnimation(pos, 'peng');
        console.log('playActionAnimation uid:%d %s peng', uid, pos);
    },

    handleCardGang: function (data) {
        var uid = data.detail.player;
        if (uid == GameData.player.uid) return;
        var pos = GameData.getPlayerPosByUid(uid);
        this.playActionAnimation(pos, 'gang');
        console.log('playActionAnimation uid:%d %s gang', uid, pos);
    },

    handleCardHu: function (data) {
        var uid = data.detail.player;
        if (uid == GameData.player.uid) return;
        var pos = GameData.getPlayerPosByUid(uid);
        this.playActionAnimation(pos, 'hu');
        console.log('playActionAnimation uid:%d %s hu', uid, pos);
    },

    playActionAnimation: function (pos, action) {
        console.log('playActionAnimation %s %s', pos, action);
        var animationNode = cc.find('actionAnimations/'+pos, this.node);
        if (animationNode != null) {
            animationNode.getComponent(cc.Animation).play(action);
        }
    },

    moveBackMyCards: function() {

    },

});