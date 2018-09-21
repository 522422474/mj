var soundMngr = require('SoundMngr');

cc.Class({
	extends: cc.Component,

	properties: {
		joinClubEditBox: cc.EditBox
	},
	onLoad: function () {},

	onDestroy: function () {},

	joinClubClick: function () {
        soundMngr.instance.playAudioOther('button');
		var clubID = this.joinClubEditBox.getComponent(cc.EditBox).string;
		ClubHandler.getInstance().reqJoinClub(clubID);
	},
	close: function () {
        soundMngr.instance.playAudioOther('button');
		closeView("joinclubIDPanel");
	}
});