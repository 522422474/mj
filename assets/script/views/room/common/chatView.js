var game = require('gameConfig');
var soundMngr = require('SoundMngr');

cc.Class({
    extends: cc.Component,

    properties: {
        chatInput: cc.EditBox,
        sendButton: cc.Node,
        fastVoiceItem : cc.Node,
        chatAnimationItem : cc.Node
    },

    onLoad: function () {

    },

    onDestroy : function() {

    },

    onEnable: function() {
        this.initFastVoiceItems();
        this.initEmoAnimation();
        this.selectEmoAndWord(null, 1);
    },

    onClose: function() {
        soundMngr.instance.playAudioOther('button');
        for(var i = 0; i < this.chatAnimationItem.parent.childrenCount; i++) {
            var charEmo = this.chatAnimationItem.parent.children[i];
            var animation = charEmo.getComponent(cc.Animation);
            if (animation) {
                var aniName = animation.getClips()[i].name;
                animation.stop(aniName);
            }
        }
        this.node.active = false;
    },

    initEmoAnimation: function() {
        var animationCount = 16;
        for(var i = 0; i < animationCount; i++) {
            var charEmo = this.chatAnimationItem.parent.getChildren()[i];
            if (charEmo == null) {
                charEmo = cc.instantiate(this.chatAnimationItem);
                this.chatAnimationItem.parent.addChild(charEmo);
                charEmo.x = this.chatAnimationItem.x + i % 6*140;
                charEmo.y = this.chatAnimationItem.y - parseInt(i/6)*150;
            }
            var animation = charEmo.getComponent(cc.Animation);
            if (animation) {
                var aniName = animation.getClips()[i].name;
                charEmo.name = aniName;
                animation.play(aniName);
                charEmo.on(cc.Node.EventType.TOUCH_END, this.onEmoClick,this);
            }
        }
    },

    initFastVoiceItems: function() {
        var chatData = game.getChatData();
        var talks = chatData.talks;
        var soundKeys = chatData.soundKeys;

        for(var i = 0; i < talks.length; i++) {
            var voiceItem = this.fastVoiceItem.parent.getChildren()[i];
            if (voiceItem == null) {
                voiceItem = cc.instantiate(this.fastVoiceItem);
                voiceItem.parent = this.fastVoiceItem.parent;
                voiceItem.x = this.fastVoiceItem.x;
                voiceItem.y = this.fastVoiceItem.y - i*61;
            }

            cc.find('Label',voiceItem).getComponent(cc.Label).string = talks[i];
            voiceItem.tag = soundKeys[i];
            voiceItem.on(cc.Node.EventType.TOUCH_END, this.onVoiceClick,this);
        }
        this.fastVoiceItem.parent.height = this.fastVoiceItem.parent.childrenCount*this.fastVoiceItem.height;
    },

    onVoiceClick: function(evt) {
        soundMngr.instance.playAudioOther('button');
        var key = evt.target.tag;
        var talkContent = cc.find('Label',evt.target).getComponent(cc.Label).string;
        ChatHandler.getInstance().requestChat('fast', {sound:key,content:talkContent}, function(rtn){});
        this.onClose();
    },

    onEmoClick: function(evt) {
        soundMngr.instance.playAudioOther('button');
        var aniName = evt.target.name;
        ChatHandler.getInstance().requestChat('emo', aniName, function(rtn){});
        this.onClose();
    },

    onSendButton: function() {
        soundMngr.instance.playAudioOther('button');
        if (this.chatInput.string != '') {
            ChatHandler.getInstance().requestChat('word', this.chatInput.string, function(rtn){});
            this.chatInput.string = '';
            this.onClose();
        }
    },

    selectEmoAndWord: function(evt, type) {
        if (evt) {
            soundMngr.instance.playAudioOther('button');
        }
        var emoScoreView = cc.find('allPanel/emoScrollView',this.node);
        var wordScoreView = cc.find('allPanel/wordScrollView',this.node);
        var wordBtn = cc.find('allPanel/switchToggle/wordBtn',this.node);
        var emoBtn = cc.find('allPanel/switchToggle/emoBtn',this.node);
        var wordBtn_stop = cc.find('allPanel/switchToggle/wordBtn_stop',this.node);
        var emoBtn_stop = cc.find('allPanel/switchToggle/emoBtn_stop',this.node);

        if (type == 1) {
            wordBtn.active = true;
            emoBtn_stop.active = true;
            wordScoreView.active = true;

            emoBtn.active = false;
            wordBtn_stop.active = false;
            emoScoreView.active = false;
        } else if (type == 2) {
            wordBtn.active = false;
            emoBtn_stop.active = false;
            wordScoreView.active = false;

            emoBtn.active = true;
            wordBtn_stop.active = true;
            emoScoreView.active = true;
        }
    },

});