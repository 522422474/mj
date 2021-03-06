cc.Class({
    extends: cc.Component,

    properties: {
        voiceBtnNode: cc.Node,
    },

    onLoad: function () {
        require('util').registEvent('yunwaUploaded', this, this.handleVoice);
        require('util').registEvent('shortRecord', this, this.YVShortRecordCallback);
    },

    onDestroy: function () {
        unrequire('util').registEvent('yunwaUploaded', this, this.handleVoice);
        unrequire('util').registEvent('shortRecord', this, this.YVShortRecordCallback);
    },

    onEnable: function() {
        this.setVoiceBtn();
        this.initTalkNode();
    },

    setVoiceBtn: function() {
        var self = this;
        this.voiceBtnNode.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (inCD(1000)) return;
            self.startTalk();
        });
        this.voiceBtnNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var movePos = event.touch.getLocation();
            var talkBtnWorldPos = this.convertToWorldSpace(this.getPosition());
            var RelativeCoordinatePos = {};
            RelativeCoordinatePos.x = talkBtnWorldPos.x - this.getPosition().x + 170;
            RelativeCoordinatePos.y = talkBtnWorldPos.y - this.getPosition().y + 50;
            var distance = cc.pDistance(movePos, RelativeCoordinatePos);
            if (distance > this.width) {
                self.cancelTalk();
            }
        });
        this.voiceBtnNode.on(cc.Node.EventType.TOUCH_END, function () {
            self.endTalk();
        });
        this.voiceBtnNode.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            self.endTalk();
        });
    },

    initTalkNode: function() {
        this.talkNode = new cc.Node();
        this.talkNode.setTag('talkNode');

        var sprite = cc.textureCache.addImage(cc.url.raw('resources/animation/yuyin/yuyinjingtan.png'));
        var spriteNode = this.talkNode.addComponent(cc.Sprite);
        spriteNode.spriteFrame = new cc.SpriteFrame(sprite);

        var animNode = this.talkNode.addComponent(cc.Animation);
        cc.loader.loadRes("animation/yuyin/yuyin", function (err, clip) {
            animNode.addClip(clip, 'yuyin');
        });
        cc.loader.loadRes("animation/yuyin/CancelSend", function (err, clip) {
            animNode.addClip(clip, 'CancelSend');
        });
        cc.loader.loadRes("animation/yuyin/ShortRecoed", function (err, clip) {
            animNode.addClip(clip, 'ShortRecoed');
        });
    },

    startTalk: function() {
        yunwaStartTalk();
        GameData.isPlayVioce = true;
        cc.audioEngine.pauseAll();
        cc.director.getScene().getChildByName('Canvas').addChild(this.talkNode);
        this.talkNode.getComponent(cc.Animation).play("yuyin");
    },

    endTalk: function() {
        yunwaStopTalk();
        GameData.isPlayVioce = false;
        cc.audioEngine.resumeAll();
        cc.director.getScene().getChildByName('Canvas').removeChildByTag('talkNode');
    },

    cancelTalk: function() {
        GameData.isPlayVioce = false;
        cc.audioEngine.resumeAll();
        this.talkNode.getComponent(cc.Animation).play("CancelSend");
    },

    handleVoice: function (data) {
        var soundurl = data.detail;
        ChatHandler.getInstance().sendRecord(soundurl);
    },

    YVShortRecordCallback: function () {
        cc.director.getScene().getChildByName('Canvas').addChild(this.talkNode);
        this.talkNode.getComponent(cc.Animation).play("ShortRecoed");

        this.unschedule(this.goToHide);
        this.scheduleOnce(this.goToHide, 1);
    },

    goToHide: function() {
        cc.director.getScene().getChildByName('Canvas').removeChildByTag('talkNode');
    },
});