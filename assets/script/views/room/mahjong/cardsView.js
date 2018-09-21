var game = require('gameConfig');
var roomHandler = require('roomHandler');

cc.Class({
    extends: cc.Component,

    properties: {
        play_layer_up: cc.Node,
        play_layer_down: cc.Node,
        play_layer_left: cc.Node,
        play_layer_right: cc.Node,

        disCardArrow: cc.Prefab,
        cardButtonPrefab: cc.Prefab,
        cardHuierPrefab: cc.Prefab,
        cardTingPrefab: cc.Prefab,
        cardMaskPrefab: cc.Prefab,
    },

    onLoad: function () {
        require('util').registEvent('onGameInfo', this, this.showCards);
        require('util').registEvent('onGameScore', this, this.showResult);
        require('util').registEvent('onSelectCard', this, this.onSelectCard);
    },

    onDestroy: function () {
        unrequire('util').registEvent('onGameInfo', this, this.showCards);
        unrequire('util').registEvent('onGameScore', this, this.showResult);
        unrequire('util').registEvent('onSelectCard', this, this.onSelectCard);
    },

    onEnable: function () {
        this.play_layer_up.active = false;
        //this.play_layer_down.active = false;
        this.play_layer_left.active = false;
        this.play_layer_right.active = false;

        this._cardArrow = cc.instantiate(this.disCardArrow);
        this._cardArrow.active = false;
        this.showCards();
    },

    showCards: function() {
        var gameData = game.getGameData();
        for (var uid in gameData.cards) {
            var cards = gameData.cards[uid];
            var obtain = gameData.game.obtain;

            this.showMyHandCards(uid, cards['hand'], obtain);
            this.showHandCards(uid, cards['handnum']);
            this.showUsedCards(uid, cards['chi'], cards['peng'], cards['gang']);
            this.showDisCards(uid, cards['dis']);
        }
    },

    showMyHandCards: function (uid, cards, obtain) {
        if (uid != GameData.player.uid) return;

        var cardsNode = cc.find('cardHand', this.play_layer_down);
        if (cardsNode == null) return;

        var gameRule = game.getGameRule(), flag = true;
        var showCards = [], wildCards = [];
        if (obtain > 0) showCards.push(obtain);
        for (var i = cards.length - 1; i >= 0; --i) {
            var c = cards[i];
            if (flag && c == obtain) {
                flag = false;
                continue;
            }
            gameRule.isWildCard(c) ? wildCards.push(c) : showCards.push(c);
        }
        showCards = showCards.concat(wildCards);

        var maxSize = GameData.client.handsize;
        for (var idx = 0, cardIdx = 0, num = showCards.length; idx <= maxSize; ++idx) {
            var node = cc.find('cardHand'+idx, cardsNode);

            if (idx == 0) {
                node.active = (num % 3 == 2);
                num = (num % 3 == 2) ? num-1 : num;
            } else {
                node.active = (idx <= num);
            }

            if (node.active) {
                var card = showCards[cardIdx++];
                this.showCardContent(node, card, 'mj_face_xia_shou');
                this.setCardButton(node, card, idx);
                this.setWildVisible(node, card, 'down');
                //this.setMyTingVisible(node, card);
            }
        }
        cardsNode.active = true;
    },

    showHandCards: function (uid, num) {
        if (uid == GameData.player.uid) return;

        var pos = GameData.getPlayerPosByUid(uid);
        var parent = this['play_layer_'+pos];
        if (parent == null) return;

        var cardsNode = cc.find('cardHand', parent);
        if (cardsNode == null) return;

        var node0 = cc.find('cardHand0', cardsNode);
        var turn = (uid == game.getGameData().getGameInfoData().turn);
        node0.active = turn;
        num = turn ? num-1 : num;

        var handSize = GameData.client.handsize;
        for (var idx = 1; idx <= handSize; ++idx) {
            var node = cc.find('cardHand'+idx, cardsNode);
            node.active = idx <= num;
        }
        cardsNode.active = true;
        parent.active = true;
    },

    showUsedCards: function (uid, chi, peng, gang) {
        var size = parseInt(GameData.client.handsize / 3);
        var cards = [].concat(gang, peng, chi);
        var pos = GameData.getPlayerPosByUid(uid);
        var parent = this['play_layer_'+pos];
        if (parent == null) return;

        var pengNode = cc.find('cardPeng', parent);
        if (pengNode == null) return;

        var img = this.getCardImgStr(pos);
        var gameRule = game.getGameRule();
        for (var i = 0; i<size; ++i) {
            var node = cc.find('cardPeng'+(i+1), pengNode);
            if (node == null) continue;

            node.active = (i < cards.length);
            if (i >= cards.length) continue;

            var usedCards = cards[i].cards;
            usedCards.sort(function(a, b) {return a-b;});

            for (var n = 0; n < 4; ++n) {
                var faceNode = node.getChildByName('card_face'+(n+1));
                if (n < usedCards.length) {
                    var cardId = usedCards[n];
                    this.showCardContent(faceNode, cardId, img);

                    if (n == 3 && gameRule.isWildCard(cardId) == true) {
                        this.addHuierIcon(faceNode, pos);
                    }
                    faceNode.active = true;
                } else {
                    faceNode.active = false;
                }
            }
            if (usedCards.length == 5) { //暗杠
                node.getChildByName('card_face4').active = false;
                node.getChildByName('card_back4').active = true;
            } else {
                node.getChildByName('card_back4').active = false;
            }
        }
    },

    showDisCards: function (uid, cards) {
        var pos = GameData.getPlayerPosByUid(uid);
        var joinermax = roomHandler.getRoomData().opts.joinermax;
        var parent = this['play_layer_'+pos];
        if (parent == null) return;

        var node4 = cc.find('cardDis_4', parent);
        if (node4) node4.active = false;
        var node3 = cc.find('cardDis_3', parent);
        if (node3) node3.active = false;
        var node2 = cc.find('cardDis_2', parent);
        if (node2) node2.active = false;
        var disNode = cc.find('cardDis_' + joinermax, parent);
        disNode.active = true;

        var img = this.getCardImgStr(pos);
        var lastDisUid = game.getGameData().getGameInfoData().lastdisUid;
        var lastDisCard = game.getGameData().getGameInfoData().lastdisCard;

        for (var i = 1; i <= disNode.childrenCount; i++) {
            var node = cc.find('card_face' + i, disNode);
            if (i <= cards.length) {
                var iconUrl = '';
                var card = cards[i - 1];
                node.active = true;

                this.showCardContent(node, card, img);

                if (uid == lastDisUid && card == lastDisCard) {
                    this._cardArrow.active = true;
                    this._cardArrow.parent = node;
                    this._cardArrow.position.x = 0;
                    this._cardArrow.position.y = 0;
                    cc.find('left', this._cardArrow).active = pos == 'left' ? true : false;
                    cc.find('down', this._cardArrow).active = pos == 'down' ? true : false;
                    cc.find('right', this._cardArrow).active = pos == 'right' ? true : false;
                    cc.find('up', this._cardArrow).active = pos == 'up' ? true : false;
                }
            } else {
                node.active = false;
            }
        }
    },

    showCardContent: function (cardNode, cardId, cardHeader) {
        var card = cardNode.getComponent('Card');
        if (card != null) card.id = cardId;

        var iconUrl = 'resources/mjcard2d/' + cardHeader + '_' + cardId + '.png';
        var texture = cc.textureCache.addImage(cc.url.raw(iconUrl));
        cardNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    },

    setCardButton: function (cardNode, cardId, index) {
        var cardBtn = cardNode.getChildByName(cardNode.name + '_button');
        if (cardBtn == null) {
            cardBtn = cc.instantiate(this.cardButtonPrefab);
            cardBtn.name = cardNode.name + '_button';
            cardNode.addChild(cardBtn);
        }
        var cardButton = cardBtn.getComponent('cardBtnView');
        cardButton.setCardId(cardId);
        cardButton.setIndex(index);
        cardButton.cardRestoration();
    },

    setWildVisible: function (cardNode, cardId, direction) {
        var show = game.getGameRule().isWildCard(cardId);
        var huierNode = cardNode.getChildByName(cardNode.name + '_huier');
        if (huierNode == null) {
            if (show) {
                huierNode = cc.instantiate(this.cardHuierPrefab);
                cc.find('up', huierNode).active = false;
                cc.find('down', huierNode).active = false;
                cc.find('right', huierNode).active = false;
                cc.find('left', huierNode).active = false;

                cc.find(direction, huierNode).active = true;
                huierNode.y = huierNode.y - 18;
                cardNode.addChild(huierNode);
                huierNode.name = cardNode.name + '_huier';
            }
        } else {
            huierNode.active = show;
        }
    },

    onSelectCard: function (data) {
        var selectCard = data.detail;
        var player = GameData.getPlayerByPos('up');
        if (player) {
            this.showPengCardMask(selectCard, this.play_layer_up, 'up');
            this.showDisCardMask(selectCard, this.play_layer_up, 'up');
        }

        player = GameData.getPlayerByPos('down');
        if (player) {
            this.showPengCardMask(selectCard, this.play_layer_down, 'down');
            this.showDisCardMask(selectCard, this.play_layer_down, 'down');
        }

        player = GameData.getPlayerByPos('left');
        if (player) {
            this.showPengCardMask(selectCard, this.play_layer_left, 'left');
            this.showDisCardMask(selectCard, this.play_layer_left, 'left');
        }

        player = GameData.getPlayerByPos('right');
        if (player) {
            this.showPengCardMask(selectCard, this.play_layer_right, 'right');
            this.showDisCardMask(selectCard, this.play_layer_right, 'right');
        }
    },

    showPengCardMask: function (selectCard, parent, direction) {
        var pengNode = cc.find('cardPeng', parent);
        for (var i = 1; i <= pengNode.childrenCount; i++) {
            var node = cc.find('cardPeng' + i, pengNode);
            if (node != null && node.active) {
                for (var k = 1; k < 5; k++) {
                    var cardNode = cc.find('card_face' + k, node);
                    if (cardNode.active) {
                        this.gotoMask(cardNode, selectCard, direction);
                    }
                }
            }
        }
    },

    showDisCardMask: function (selectCard, parent, direction) {
        var disNode = cc.find('cardDis_' + roomHandler.getRoomData().opts.joinermax, parent);
        if (disNode == null) return;

        for (var i = 1; i <= disNode.childrenCount; i++) {
            var cardNode = cc.find('card_face' + i, disNode);
            if (cardNode.active) {
                this.gotoMask(cardNode, selectCard, direction);
            }
        }
    },

    gotoMask: function (cardNode, selectCard, direction) {
        var card = cardNode.getComponent('Card');
        if (card == null) return;

        var show = selectCard == card.id;
        var maskNode = this.setMaskVisible(cardNode, show);
        if (maskNode != null) {
            cc.find('up', maskNode).active = false;
            cc.find('down', maskNode).active = false;
            cc.find('right', maskNode).active = false;
            cc.find('left', maskNode).active = false;
            cc.find(direction, maskNode).active = true;
        }
    },

    setMaskVisible: function (cardNode, show) {
        var maskNode = cardNode.getChildByName(cardNode.name + '_mask');
        if (maskNode == null) {
            if (show) {
                maskNode = cc.instantiate(this.cardMaskPrefab);
                maskNode.name = cardNode.name + '_mask';
                cardNode.addChild(maskNode);
            }
        } else {
            maskNode.active = show;
        }
        return maskNode;
    },

    getCardImgStr: function(pos) {
        if (pos == 'down') return 'mj_face_xia_chu';
        else if (pos == 'up') return 'mj_face_shang_shou';
        else if (pos == 'left') return 'mj_face_zuo_chu';
        else if (pos == 'right') return 'mj_face_you_chu';
        return '';
    },

    showResult: function() {
        setTimeout(function () {
            sendEvent('onShowView', 'resultView');
        }, 1500);
    },

});