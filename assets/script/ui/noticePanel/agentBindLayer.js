var soundMngr = require('SoundMngr');

cc.Class({
	extends: cc.Component,
	properties: {
		EditBox: cc.EditBox,
		//奖励数量
		jlNum: cc.Label
	},

	onLoad: function () {
		this.jlNum.string = '5';
	},
	agentBindClick: function () {
        soundMngr.instance.playAudioOther('button');
		var agentID = this.EditBox.getComponent(cc.EditBox).string;
		ClubHandler.getInstance().reqBindAgent(GameData.player.uid, agentID);
	}
});