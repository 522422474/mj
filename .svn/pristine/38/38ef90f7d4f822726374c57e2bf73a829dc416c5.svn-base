var soundMngr = require('SoundMngr');

cc.Class({
    extends: cc.Component,

    properties: {
        shareImage: cc.Node,
    },
    onLoad: function () {
        this.shareImage.active = false;
    },
    cancel:function(){
        soundMngr.instance.playAudioOther('button');
        closeView(this.node.name);
    },
    shareContent: function(){
        this.shareImage.active = true;
    	if(inCD(3000)) {
            return;
        }
        soundMngr.instance.playAudioOther('button');
        screenShoot(wxShareTexture);
    }
});
