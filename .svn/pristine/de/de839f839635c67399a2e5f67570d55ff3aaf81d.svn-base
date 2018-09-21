cc.Class({
    extends: cc.Component,

    properties: {
        headNode: cc.Node,
        nameLabel: cc.Label,
        idLabel: cc.Label,
        winningLabel: cc.Label,
        roundLabel: cc.Label,
        winRateLabel: cc.Label,
        playerTemplate: cc.Prefab,

        _player: undefined
    },

    onLoad: function () {
    },
    onDestroy: function () {
    },
    onEnable: function () {
    },

    onShow: function(player) {
        if(player == undefined || Object.keys(player).length <= 0){
            return;
        }
        this._player = player;

        var headNode = this.headNode.getChildByName('playerHeadNode');
        if(headNode == undefined){
            headNode = cc.instantiate(this.playerTemplate);
            this.headNode.addChild(headNode);
        }
        var template = headNode.getComponent('playerTemplate');
        if(template){
            template.setName('');
            template.showZhuang(false);
            template.enableHeadBtn(false);
            template.setHeadIcon(player.headimgurl);
        }
        this.node.active = true;

        if (isChinese(player.name)) {
            this.nameLabel.string = getShortStr(player.name,8);
        }else{
            this.nameLabel.string = getShortStr(player.name,16);
        }
        this.idLabel.string = player.uid;
        // this.winningLabel.string = player.winning || 0;
        // this.roundLabel.string = player.round || 0;
        // this.winRateLabel.string = player.winper || 0;
    },

    onSendMessage: function(evt, data){
        if (inCD(1000)) return;
        if(data == undefined){
            return;
        }
        if(this._player == undefined){
            return;
        }
        if(this._player.uid == GameData.player.uid){
            createMoveMessage('不能对自己使用道具哦！');
            return;
        }
        cc.log('..playerUid:'+GameData.player.uid);
        cc.log('..toUid:'+this._player.uid);
        cc.log('..data:'+data);

        ChatHandler.getInstance().dynChat(GameData.player.uid, this._player.uid, data,function(rtn){});
        this.onClose();
    },

    onClose: function() {
        this.node.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});