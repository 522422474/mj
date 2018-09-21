var configMgr = require('configMgr');
var soundMngr = require('SoundMngr');

cc.Class({
    extends: cc.Component,

    properties: {
        Str1: cc.Label,
        Str2: cc.Label,
        Str3: cc.Label,
        Str1Type: cc.Label,
        Str2Type: cc.Label,
        Str3Type: cc.Label
    },
    onLoad: function () {
        //var WXconfig = GameData.configData.agentWechat;

        var WXConfig = configMgr.getAgentWeChat();
        cc.log("..WXConfig:"+JSON.stringify(WXConfig));
        if(WXConfig){
            this.Str1.string = WXConfig.accounts.number;
            this.Str2.string = WXConfig.agentConsult.number;
            this.Str3.string = WXConfig.gameProblem.number;
            this.Str1Type.string = WXConfig.accounts.type;
            this.Str2Type.string = WXConfig.agentConsult.type;
            this.Str3Type.string = WXConfig.gameProblem.type;
        }
    },
    onCopyNumber1: function () {
        if (inCD(1000)) return;
        soundMngr.instance.playAudioOther('button');
        var number = this.Str1.string;
        textClipboard(number);
        createMoveMessage('已复制。');
        console.log('Copy successed');
    },
    onCopyNumber2: function () {
        if (inCD(1000)) return;
        soundMngr.instance.playAudioOther('button');
        var number = this.Str2.string;
        textClipboard(number);
        createMoveMessage('已复制。');
        console.log('Copy successed');
    },
    onCopyNumber3: function (text) {
        if (inCD(1000)) return;
        soundMngr.instance.playAudioOther('button');
        var number = this.Str3.string;
        textClipboard(number);
        createMoveMessage('已复制。');
        console.log('Copy successed');
    },
    onClose: function () {
        soundMngr.instance.playAudioOther('button');
        closeView('kefuweixin');
    }
});