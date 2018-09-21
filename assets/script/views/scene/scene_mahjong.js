var game = require('gameConfig');
var configMgr = require('configMgr');
var gameDefine = require('gameDefine');
var roomHandler = require('roomHandler');
var stateMachine = require('stateMachine');

cc.Class({
    extends: stateMachine,

    properties: {
        debugBtn: cc.Button,

        talkViewNode: cc.Node,
        timeViewNode: cc.Node,
        wifiViewNode: cc.Node,
        powerViewNode: cc.Node,
        roomNumViewNode: cc.Node,
        wildCard1ViewNode: cc.Node,
    },

    onLoad: function () {
    	require('util').registEvent('onRoomInfo', this, this.showStateViews);
        require('util').registEvent('onRoomDissolve', this, this.onShowDissolve);
        require('util').registEvent('onShowView', this, this.onShowView);
        require('util').registEvent('onCloseView', this, this.onCloseView);
    },

    onDestroy: function () {
    	unrequire('util').registEvent('onRoomInfo', this, this.showStateViews);
        unrequire('util').registEvent('onRoomDissolve', this, this.onShowDissolve);
        unrequire('util').registEvent('onShowView', this, this.onShowView);
        unrequire('util').registEvent('onCloseView', this, this.onCloseView);
    },

    onEnable: function () {
        this.viewState = '';
    	this.loadViews('base');
        this.showStateViews();

        this.debugBtn.active = configMgr.getSetCardsOpen();
    },

    loadViews: function (name) {
        if (name == '') return;
        this.viewState = name;
        var self = this;
        var views = game.getViews(name);
        var parent = cc.director.getScene().getChildByName('Canvas');
        var layer = parent.getChildByTag(name);
        if (layer != null) {
            layer.active = true;
        } else {
            var prefabs = []
            layer = new cc.Node();
            layer.setTag(name);
            parent.addChild(layer);

            for (var i = 0, len = views.length; i < len; ++i) {
                var prefab = game.getView(views[i]);
                if (prefab) prefabs.push(prefab);
            }

            cc.loader.loadResArray(prefabs, function(err, res) {
                for (var i = 0, len = res.length; i < len; ++i) {
                    var prefab = res[i];
                    if (prefab != null) {
                        var node = cc.instantiate(prefab);
                        var baseNode = self[views[i]+'Node'];
                        if (baseNode != null) node.position = baseNode.position;
                        node.setTag(views[i]);
                        layer.addChild(node);
                        cc.log('loadView: '+views[i]);
                    }
                }
            });
        }
    },

    closeViews: function (name) {
        if (name == '') return;
        var parent = cc.director.getScene().getChildByName('Canvas');
        var layer = parent.getChildByTag(name);
        if (layer != null) layer.active = false;
    },

    onShowView: function (data) {
        var tag = data.detail;
        var parent = cc.director.getScene().getChildByName('Canvas');
        var view = parent.getChildByTag(tag);
        if (view != null) {
            view.active = true;
        } else {
            var prefab = game.getView(tag);
            if (prefab) openPrefabView(prefab, parent, tag);
        }
    },

    onCloseView: function (data) {
        var tag = data.detail;
        var parent = cc.director.getScene().getChildByName('Canvas');
        var view = parent.getChildByTag(tag);
        if (view != null) view.active = false;
    },

    showStateViews: function (data) {
    	var state = roomHandler.room.status;
    	switch (state) {
    		case gameDefine.RoomState.WAIT:
                this.loadViews('wait');
                break;
            case gameDefine.RoomState.GAMEING:
                this.closeViews(this.viewState);
                this.loadViews('game');
                break;
    		case gameDefine.RoomState.READY:
                if (data.detail.force || this.viewState != 'game') {
                    this.closeViews(this.viewState);
                    this.loadViews('ready');
                }
    			break;
    		default: break;
    	}
    },

    onShowDissolve: function(data) {
        sendEvent('onShowView', 'dissolveView');
    },

    onSettingClicked: function(evt) {
        sendEvent('onShowView', 'settingView');
    },

    onRuleClicked: function(evt) {
        sendEvent('onShowView', 'ruleTipsView');
    },

    onChatClicked: function(evt) {
        sendEvent('onShowView', 'chatView');
    },

    onDebugClicked: function(evt) {
        sendEvent('onShowView', 'debugView');
    },
});