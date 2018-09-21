// var shopConfig = require('shopConfig');
// var gameDefine = require('gameDefine');
// var soundMngr = require('SoundMngr');

cc.Class({
    extends: cc.Component,

    properties: {
        webView: cc.WebView
    },
    onLoad: function () {
        WriteLog('onLoad');
    },
    onDestroy: function () {
        WriteLog('onDestroy');
    },
    onEnable: function () {
        WriteLog('onEnable');
    },
    onClose: function () {
        WriteLog('onClose');
        this.node.active = false;
    }, 
    onOpen: function(url){
        if(url && url.length > 0){
            this.webView.url = url;
        }
    }
});
