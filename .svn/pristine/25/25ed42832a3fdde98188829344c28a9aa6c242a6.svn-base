var Promise = require('es6-promise');

cc.Class({
	extends: cc.Component,

	properties: {

	},

	onLoad: function() {
		this.state = 0;
		this.stateList = {};
	},

	registState: function(state, parent, func_before, func_run, func_after) {
		this.stateList[state] = {parent: parent, before: func_before, run: func_run, after: func_after};
	},

	unregistState: function(state) {
		delete this.stateList[state];
	},

	setState: function(state) {
		if (this.state == state) return;
		
		var self = this;
		Promise.resolve()
			.then(function() {
				var st = self.stateList[self.state];
				if (st == null || typeof st.after != 'function') Promise.resolve();
				else st.after.call(st.parent, function() {Promise.resolve()});
			})
			.then(function() {
				var st = self.stateList[state];
				if (st == null || typeof st.before != 'function') Promise.resolve();
				else st.before.call(st.parent, function() {Promise.resolve()});
			})
			.then(function() {
				self.state = state;
				Promise.resolve();
			})
			.then(function() {
				var st = self.stateList[self.state];
				if (st == null || typeof st.run != 'function') Promise.resolve();
				else st.run.call(st.parent, function() {Promise.resolve()});
			})
			.catch(function() {
				console.log('Execute Promise error, state:'+state);
			})
	},

});