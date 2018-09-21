var roomUtil = require('roomUtil');
var hhdz_roomUtil = require('hhdz_roomUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        iconNode: cc.Sprite,
        nameNode: cc.Label,
        coinNode: cc.Label,

        _player: undefined,
        _initPos: undefined
    },

    onLoad: function () {
    },

    onDestroy: function () {
    },

    onEnable: function () {
        this._initPos = this.node.position;

        this.updateHeadInfo();
    },

    setPlayerData: function(data){
        if(data == undefined){
            return;
        }
        this._player = data;
        this.updateHeadInfo();
    },

    setPlayerIcon: function(headimgurl){
        if (headimgurl == undefined || headimgurl.length <= 0 ) {
            return;
        }
        var self = this;
        cc.loader.load({url: headimgurl, type: 'png'}, function (error, texture) {
            if (!error && texture) {
                self.iconNode = new cc.SpriteFrame(texture);
            }
        });
    },

    setPlayerName: function(str){
        str === undefined ? str = '' : null;
        this.nameNode.string = getShortStr(str,4);
    },

    setPlayerCoin: function(value){
        value === undefined ? value = 0 : null;
        this.coinNode.string = value;
    },

    updateHeadInfo: function(){
        if(this._player == undefined){
            return;
        }
        cc.log('..updateHeadInfo.');

        this.setPlayerIcon(this._player.headimgurl);
        this.setPlayerName(this._player.name);
        this.setPlayerCoin(this._player.coin);
    },

    runAddJetonAction: function(){
        this.node.position = this._initPos;

        var move1 = cc.moveTo(0.2, cc.p(this._initPos.x + 20, this._initPos.y));
        var move2 = cc.moveTo(0.2, this._initPos);

        this.node.stopAllActions();
        this.node.runAction(cc.sequence(move1, move2));
    },

    onHeadBtnClick: function(event){
        cc.log('..onHeadBtnClick:'+this._player.uid);
    }
});