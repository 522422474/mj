var gameDefine = require('gameDefine');
var roomHandler = require('roomHandler');

module.exports = {
	getConfig: function() {
		var gameType = roomHandler.room.opts.gameType;
		switch (gameType) {
			case gameDefine.GameType.Game_Mj_HZ: return require('TuiDaoHu');
			default: return null; 
		}
	},

	getName: function() {
		return this.getConfig().name;
	},

	getLanguage: function() {
		return this.getConfig().language;
	},

	getViews: function(state) {
		return this.getConfig().views[state];
	},

	getView: function(tag) {
		return this.getConfig().prefabs[tag];
	},

	getChatData: function() {
		return this.getConfig().chat;
	},

	getRuleStr: function() {
		return this.getConfig().getRuleStr(roomHandler.room.opts);
	},

	getWildIcon: function() {
		return this.getConfig().resources.wildIcon;
	},

	getActionData: function(action) {
		return this.getConfig().actions[action];
	},

	getGameData: function() {
		return this.getConfig().getDataHandler();
	},

	getGameRule: function() {
		return this.getConfig().getRuleHandler();
	},

	getGameProtocol: function() {
		return this.getConfig().getProtocolHandler();
	},
};
