var configMgr = require('configMgr');
var soundMngr = require('SoundMngr');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {

    },

    onClose: function () {

        closeView(this.node.name);
    },

    onShareWeixin: function () {
        soundMngr.instance.playAudioOther('button');
        cc.log('share weixin');
        var title = configMgr.getGameName();
        var text = configMgr.getWxWelcomeText();
        wxShareWeb(title, text);
    },

    onSharePengyouQuan: function () {
        soundMngr.instance.playAudioOther('button');
        cc.log('share peng youquan');
        var title = configMgr.getGameName();
        wxShareTimeline(title,
            "玩家ID：" + GameData.player.uid + "邀请您加入【"+ title+ "】，点击分享信息后，进入该产品下载界面。");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});